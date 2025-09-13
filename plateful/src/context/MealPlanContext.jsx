import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  createEmptyMealPlan, 
  getWeekStartDate, 
  DAYS_OF_WEEK, 
  MEAL_TYPES, 
  MEAL_STATUSES,
  sampleMealPlan 
} from '../utils/mealPlanSchema';

// Meal plan context
const MealPlanContext = createContext();

// Global tracking to prevent duplicate loading across StrictMode instances
const globalLoadingWeeks = new Set();

// Initial state
const initialState = {
  currentMealPlan: null,
  loading: false,
  error: null,
  selectedWeek: getWeekStartDate(),
  selectedDay: null,
  selectedMealType: null,
  isLoadingMealPlan: false // Add flag to prevent race conditions
};

// Action types
const MEAL_PLAN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_MEAL_PLAN: 'SET_MEAL_PLAN',
  UPDATE_MEAL: 'UPDATE_MEAL',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_WEEK: 'SET_SELECTED_WEEK',
  SET_SELECTED_DAY: 'SET_SELECTED_DAY',
  SET_SELECTED_MEAL_TYPE: 'SET_SELECTED_MEAL_TYPE',
  SET_LOADING_MEAL_PLAN: 'SET_LOADING_MEAL_PLAN'
};

// Reducer
const mealPlanReducer = (state, action) => {
  switch (action.type) {
    case MEAL_PLAN_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case MEAL_PLAN_ACTIONS.SET_MEAL_PLAN:
      return { ...state, currentMealPlan: action.payload, loading: false, error: null };
    
    case MEAL_PLAN_ACTIONS.UPDATE_MEAL:
      const { dayOfWeek, mealType, mealData } = action.payload;
      const updatedMealPlan = { ...state.currentMealPlan };
      
      if (!updatedMealPlan.meals[dayOfWeek]) {
        updatedMealPlan.meals[dayOfWeek] = {};
      }
      
      updatedMealPlan.meals[dayOfWeek][mealType] = {
        ...updatedMealPlan.meals[dayOfWeek][mealType],
        ...mealData,
        updatedAt: new Date()
      };
      
      updatedMealPlan.updatedAt = new Date();
      
      return { ...state, currentMealPlan: updatedMealPlan };
    
    case MEAL_PLAN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case MEAL_PLAN_ACTIONS.SET_SELECTED_WEEK:
      return { ...state, selectedWeek: action.payload };
    
    case MEAL_PLAN_ACTIONS.SET_SELECTED_DAY:
      return { ...state, selectedDay: action.payload };
    
    case MEAL_PLAN_ACTIONS.SET_SELECTED_MEAL_TYPE:
      return { ...state, selectedMealType: action.payload };
    
    case MEAL_PLAN_ACTIONS.SET_LOADING_MEAL_PLAN:
      return { ...state, isLoadingMealPlan: action.payload };
    
    default:
      return state;
  }
};

// Provider component
export const MealPlanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mealPlanReducer, initialState);
  
  // Track if we've already attempted to load this week to prevent StrictMode duplicates
  const [loadedWeeks, setLoadedWeeks] = useState(new Set());

  // Load meal plan for current week
  const loadMealPlan = async (weekStartDate = state.selectedWeek) => {
    const callId = Math.random().toString(36).substr(2, 9); // Unique call identifier
    // Convert weekStartDate to a consistent format for comparison
    const weekStartString = weekStartDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    try {
      
      // Check if we already have a meal plan for this week
      if (state.currentMealPlan && state.currentMealPlan.weekStartDate === weekStartString) {
        console.log(`[${callId}] Already have meal plan for this week, skipping load`);
        return state.currentMealPlan;
      }
      
      // Check if we're already loading this week globally (Global race condition protection)
      if (globalLoadingWeeks.has(weekStartString)) {
        console.log(`[${callId}] Already loading this week globally, skipping duplicate call`);
        return state.currentMealPlan;
      }
      
      // Mark this week as being loaded globally
      globalLoadingWeeks.add(weekStartString);
      
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_LOADING_MEAL_PLAN, payload: true });
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_LOADING, payload: true });
      console.log(`[${callId}] 🔄 Loading meal plan for week:`, weekStartString);
      
      const mealPlansQuery = query(
        collection(db, 'mealPlans'),
        where('weekStartDate', '==', weekStartString)
      );
      
      const querySnapshot = await getDocs(mealPlansQuery);
      console.log(`[${callId}] 📊 Found meal plans:`, querySnapshot.docs.length);
      
      let mealPlan;
      if (querySnapshot.empty) {
        // For testing purposes, use sample data for all weeks
        // In production, you would create empty meal plans
        console.log(`[${callId}] ➕ Using sample meal plan for week:`, weekStartString);
        const sampleMealPlanCopy = { ...sampleMealPlan };
        sampleMealPlanCopy.weekStartDate = weekStartString;
        sampleMealPlanCopy.id = `sample_${weekStartString}`;
        mealPlan = sampleMealPlanCopy;
        dispatch({ type: MEAL_PLAN_ACTIONS.SET_MEAL_PLAN, payload: mealPlan });
        
        // TODO: In production, create empty meal plan and save to Firebase
        // const newMealPlan = createEmptyMealPlan(weekStartDate);
        // const docRef = await addDoc(collection(db, 'mealPlans'), newMealPlan);
        // mealPlan = { ...newMealPlan, id: docRef.id };
      } else {
        // Use the first (and should be only) meal plan for this week
        const mealPlanDoc = querySnapshot.docs[0];
        mealPlan = { id: mealPlanDoc.id, ...mealPlanDoc.data() };
        console.log(`[${callId}] 📥 Loaded existing meal plan:`, mealPlan.id);
        dispatch({ type: MEAL_PLAN_ACTIONS.SET_MEAL_PLAN, payload: mealPlan });
      }
      
      // Note: We don't mark weeks as globally loaded to allow loading different weeks
      
      // Return the loaded meal plan
      return mealPlan;
    } catch (error) {
      console.error(`[${callId}] ❌ Error loading meal plan:`, error);
      // Fallback to sample data if Firebase fails
      console.log(`[${callId}] 🔄 Falling back to sample meal plan...`);
      const fallbackMealPlan = sampleMealPlan;
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_MEAL_PLAN, payload: fallbackMealPlan });
      return fallbackMealPlan;
    } finally {
      // Clean up global loading state
      globalLoadingWeeks.delete(weekStartString);
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_LOADING_MEAL_PLAN, payload: false });
    }
  };

  // Update a specific meal
  const updateMeal = async (dayOfWeek, mealType, mealData) => {
    try {
      dispatch({ 
        type: MEAL_PLAN_ACTIONS.UPDATE_MEAL, 
        payload: { dayOfWeek, mealType, mealData } 
      });
      
      // Save to Firebase
      if (state.currentMealPlan && state.currentMealPlan.id) {
        const mealPlanRef = doc(db, 'mealPlans', state.currentMealPlan.id);
        await updateDoc(mealPlanRef, {
          [`meals.${dayOfWeek}.${mealType}`]: mealData,
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating meal:', error);
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Assign recipe to meal
  const assignRecipeToMeal = (dayOfWeek, mealType, recipe) => {
    const mealData = {
      recipe,
      status: null, // No status for recipes
      plannedAt: new Date(),
      notes: ''
    };
    updateMeal(dayOfWeek, mealType, mealData);
  };

  // Clear meal (remove all data)
  const clearMeal = (dayOfWeek, mealType) => {
    const mealData = {
      recipe: null,
      status: null,
      notes: '',
      plannedAt: null,
      completedAt: null
    };
    updateMeal(dayOfWeek, mealType, mealData);
  };

  // Remove recipe from meal
  const removeRecipeFromMeal = (dayOfWeek, mealType) => {
    const mealData = {
      recipe: null,
      status: MEAL_STATUSES.PLANNED,
      notes: '',
      plannedAt: null,
      completedAt: null
    };
    updateMeal(dayOfWeek, mealType, mealData);
  };

  // Mark meal as eating out
  const markMealAsEatOut = (dayOfWeek, mealType) => {
    const mealData = {
      recipe: null,
      status: MEAL_STATUSES.EATEN_OUT,
      notes: 'Eat out',
      plannedAt: new Date(),
      completedAt: new Date()
    };
    updateMeal(dayOfWeek, mealType, mealData);
  };

  // Mark meal as skip
  const markMealAsSkip = (dayOfWeek, mealType) => {
    const mealData = {
      recipe: null,
      status: MEAL_STATUSES.SKIP,
      notes: 'Skip this meal',
      plannedAt: new Date(),
      completedAt: null
    };
    updateMeal(dayOfWeek, mealType, mealData);
  };

  // Navigation functions
  const setSelectedWeek = (weekStartDate) => {
    dispatch({ type: MEAL_PLAN_ACTIONS.SET_SELECTED_WEEK, payload: weekStartDate });
    // Clear loaded weeks when changing weeks to allow loading new week
    setLoadedWeeks(new Set());
    // Clear global loading state for new week (but not loaded weeks)
    const weekStartString = weekStartDate.toISOString().split('T')[0];
    globalLoadingWeeks.delete(weekStartString);
    loadMealPlan(weekStartDate);
  };

  const setSelectedDay = (dayOfWeek) => {
    dispatch({ type: MEAL_PLAN_ACTIONS.SET_SELECTED_DAY, payload: dayOfWeek });
  };

  const setSelectedMealType = (mealType) => {
    dispatch({ type: MEAL_PLAN_ACTIONS.SET_SELECTED_MEAL_TYPE, payload: mealType });
  };

  // Get meals for a specific day
  const getDayMeals = (dayOfWeek) => {
    return state.currentMealPlan?.meals?.[dayOfWeek] || {};
  };

  // Get meals for a specific meal type across the week
  const getMealTypeAcrossWeek = (mealType) => {
    const meals = {};
    DAYS_OF_WEEK.forEach(day => {
      meals[day] = state.currentMealPlan?.meals?.[day]?.[mealType] || null;
    });
    return meals;
  };

  // Load meal plan on mount
  useEffect(() => {
    console.log('🚀 MealPlanProvider mounted, loading initial meal plan');
    loadMealPlan();
  }, []); // Empty dependency array is correct here - we want to load once on mount

  const value = {
    ...state,
    loadMealPlan,
    updateMeal,
    assignRecipeToMeal,
    clearMeal,
    removeRecipeFromMeal,
    markMealAsEatOut,
    markMealAsSkip,
    setSelectedWeek,
    setSelectedDay,
    setSelectedMealType,
    getDayMeals,
    getMealTypeAcrossWeek,
    DAYS_OF_WEEK,
    MEAL_TYPES,
    MEAL_STATUSES
  };

  return (
    <MealPlanContext.Provider value={value}>
      {children}
    </MealPlanContext.Provider>
  );
};

// Custom hook to use meal plan context
export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};
