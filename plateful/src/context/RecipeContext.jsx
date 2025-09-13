import { createContext, useContext, useReducer, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { sampleRecipes } from '../utils/recipeSchema';

// Recipe context
const RecipeContext = createContext();

// Initial state
const initialState = {
  recipes: [],
  loading: false,
  error: null,
  searchTerm: '',
  filterTags: [],
  sortBy: 'name' // 'name', 'prepTime', 'cookTime', 'createdAt'
};

// Action types
const RECIPE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_RECIPES: 'SET_RECIPES',
  ADD_RECIPE: 'ADD_RECIPE',
  UPDATE_RECIPE: 'UPDATE_RECIPE',
  DELETE_RECIPE: 'DELETE_RECIPE',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTER_TAGS: 'SET_FILTER_TAGS',
  SET_SORT_BY: 'SET_SORT_BY'
};

// Reducer
const recipeReducer = (state, action) => {
  switch (action.type) {
    case RECIPE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case RECIPE_ACTIONS.SET_RECIPES:
      return { ...state, recipes: action.payload, loading: false, error: null };
    
    case RECIPE_ACTIONS.ADD_RECIPE:
      return { ...state, recipes: [...state.recipes, action.payload] };
    
    case RECIPE_ACTIONS.UPDATE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        )
      };
    
    case RECIPE_ACTIONS.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload)
      };
    
    case RECIPE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case RECIPE_ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };
    
    case RECIPE_ACTIONS.SET_FILTER_TAGS:
      return { ...state, filterTags: action.payload };
    
    case RECIPE_ACTIONS.SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    
    default:
      return state;
  }
};

// Provider component
export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);

  // Load recipes from Firebase
  const loadRecipes = async () => {
    try {
      console.log('Starting to load recipes...');
      dispatch({ type: RECIPE_ACTIONS.SET_LOADING, payload: true });
      
      const recipesSnapshot = await getDocs(collection(db, 'recipes'));
      console.log('Firebase query completed, docs:', recipesSnapshot.docs.length);
      
      const recipes = recipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('Recipes from Firebase:', recipes);
      
      // If no recipes in database, add sample recipes
      if (recipes.length === 0) {
        console.log('No recipes found, adding sample recipes...');
        for (const recipe of sampleRecipes) {
          const docRef = await addDoc(collection(db, 'recipes'), recipe);
          console.log('Added recipe:', docRef.id);
        }
        console.log('Sample recipes added, dispatching...');
        dispatch({ type: RECIPE_ACTIONS.SET_RECIPES, payload: sampleRecipes });
      } else {
        console.log('Recipes found, dispatching...');
        dispatch({ type: RECIPE_ACTIONS.SET_RECIPES, payload: recipes });
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Add new recipe
  const addRecipe = async (recipeData) => {
    try {
      // For now, just add to local state (skip Firebase)
      const newRecipe = { 
        id: Date.now().toString(), // Simple ID generation
        ...recipeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch({ type: RECIPE_ACTIONS.ADD_RECIPE, payload: newRecipe });
      console.log('Recipe added locally:', newRecipe);
      return newRecipe;
    } catch (error) {
      console.error('Error adding recipe:', error);
      dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Update recipe
  const updateRecipe = async (recipeId, recipeData) => {
    try {
      const recipeRef = doc(db, 'recipes', recipeId);
      await updateDoc(recipeRef, {
        ...recipeData,
        updatedAt: new Date()
      });
      
      const updatedRecipe = { id: recipeId, ...recipeData };
      dispatch({ type: RECIPE_ACTIONS.UPDATE_RECIPE, payload: updatedRecipe });
      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Delete recipe
  const deleteRecipe = async (recipeId) => {
    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      dispatch({ type: RECIPE_ACTIONS.DELETE_RECIPE, payload: recipeId });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      dispatch({ type: RECIPE_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Search and filter functions
  const setSearchTerm = (term) => {
    dispatch({ type: RECIPE_ACTIONS.SET_SEARCH_TERM, payload: term });
  };

  const setFilterTags = (tags) => {
    dispatch({ type: RECIPE_ACTIONS.SET_FILTER_TAGS, payload: tags });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: RECIPE_ACTIONS.SET_SORT_BY, payload: sortBy });
  };

  // Get filtered and sorted recipes
  const getFilteredRecipes = () => {
    let filtered = [...state.recipes];

    // Filter by search term
    if (state.searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        )
      );
    }

    // Filter by tags
    if (state.filterTags.length > 0) {
      filtered = filtered.filter(recipe =>
        state.filterTags.every(tag =>
          recipe.tags.includes(tag)
        )
      );
    }

    // Sort recipes
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'prepTime':
          return a.prepTime - b.prepTime;
        case 'cookTime':
          return a.cookTime - b.cookTime;
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // Load recipes on mount
  useEffect(() => {
    // Show sample recipes immediately for better UX
    console.log('Showing sample recipes immediately...');
    dispatch({ type: RECIPE_ACTIONS.SET_RECIPES, payload: sampleRecipes });
    dispatch({ type: RECIPE_ACTIONS.SET_LOADING, payload: false });
    
    // Skip Firebase for now due to connection issues
    // loadRecipes();
  }, []);

  const value = {
    ...state,
    loadRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    setSearchTerm,
    setFilterTags,
    setSortBy,
    getFilteredRecipes
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom hook to use recipe context
export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
