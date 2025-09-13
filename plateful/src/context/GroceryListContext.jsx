import { createContext, useContext, useReducer, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  generateGroceryListFromMealPlan,
  groupItemsByCategory,
  getShoppingStats,
  sampleGroceryList
} from '../utils/groceryListSchema';

console.log('Imported sampleGroceryList:', sampleGroceryList);

// Grocery list context
const GroceryListContext = createContext();

// Initial state
const initialState = {
  currentList: null,
  loading: false,
  error: null,
  groupedItems: {},
  stats: { total: 0, purchased: 0, remaining: 0, progress: 0 }
};

// Action types
const GROCERY_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_GROCERY_LIST: 'SET_GROCERY_LIST',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  TOGGLE_PURCHASED: 'TOGGLE_PURCHASED',
  SET_ERROR: 'SET_ERROR',
  UPDATE_STATS: 'UPDATE_STATS'
};

// Reducer
const groceryReducer = (state, action) => {
  switch (action.type) {
    case GROCERY_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case GROCERY_ACTIONS.SET_GROCERY_LIST:
      const newList = action.payload;
      console.log('Reducer: Setting grocery list:', newList);
      console.log('Reducer: Items count:', newList.items.length);
      const grouped = groupItemsByCategory(newList.items);
      console.log('Reducer: Grouped items:', grouped);
      const stats = getShoppingStats(newList.items);
      console.log('Reducer: Stats:', stats);
      return { 
        ...state, 
        currentList: newList, 
        groupedItems: grouped,
        stats,
        loading: false, 
        error: null 
      };
    
    case GROCERY_ACTIONS.ADD_ITEM:
      const newItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...action.payload,
        sourceRecipes: action.payload.sourceRecipes || [], // Ensure sourceRecipes exists
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedListWithNewItem = {
        ...state.currentList,
        items: [...state.currentList.items, newItem],
        updatedAt: new Date()
      };
      
      const newGroupedItems = groupItemsByCategory(updatedListWithNewItem.items);
      const newStats = getShoppingStats(updatedListWithNewItem.items);
      
      return {
        ...state,
        currentList: updatedListWithNewItem,
        groupedItems: newGroupedItems,
        stats: newStats
      };
    
    case GROCERY_ACTIONS.UPDATE_ITEM:
      const { itemId, updates } = action.payload;
      const updatedItems = state.currentList.items.map(item =>
        item.id === itemId ? { ...item, ...updates, updatedAt: new Date() } : item
      );
      
      const updatedList = {
        ...state.currentList,
        items: updatedItems,
        updatedAt: new Date()
      };
      
      const updatedGroupedItems = groupItemsByCategory(updatedList.items);
      const updatedStats = getShoppingStats(updatedList.items);
      
      return {
        ...state,
        currentList: updatedList,
        groupedItems: updatedGroupedItems,
        stats: updatedStats
      };
    
    case GROCERY_ACTIONS.DELETE_ITEM:
      const filteredItems = state.currentList.items.filter(item => item.id !== action.payload);
      const listAfterDelete = {
        ...state.currentList,
        items: filteredItems,
        updatedAt: new Date()
      };
      
      const groupedAfterDelete = groupItemsByCategory(listAfterDelete.items);
      const statsAfterDelete = getShoppingStats(listAfterDelete.items);
      
      return {
        ...state,
        currentList: listAfterDelete,
        groupedItems: groupedAfterDelete,
        stats: statsAfterDelete
      };
    
    case GROCERY_ACTIONS.TOGGLE_PURCHASED:
      const { itemId: toggleItemId } = action.payload;
      const toggledItems = state.currentList.items.map(item =>
        item.id === toggleItemId 
          ? { ...item, purchased: !item.purchased, updatedAt: new Date() }
          : item
      );
      
      const listAfterToggle = {
        ...state.currentList,
        items: toggledItems,
        updatedAt: new Date()
      };
      
      const groupedAfterToggle = groupItemsByCategory(listAfterToggle.items);
      const statsAfterToggle = getShoppingStats(listAfterToggle.items);
      
      return {
        ...state,
        currentList: listAfterToggle,
        groupedItems: groupedAfterToggle,
        stats: statsAfterToggle
      };
    
    case GROCERY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    default:
      return state;
  }
};

// Provider component
export const GroceryListProvider = ({ children }) => {
  console.log('GroceryListProvider rendering...');
  const [state, dispatch] = useReducer(groceryReducer, initialState);
  console.log('GroceryListProvider state:', state);

  // Load grocery list
  const loadGroceryList = async () => {
    try {
      dispatch({ type: GROCERY_ACTIONS.SET_LOADING, payload: true });
      
      // For now, use sample data (skip Firebase due to connection issues)
      console.log('Loading sample grocery list...', sampleGroceryList);
      console.log('Sample data items count:', sampleGroceryList.items.length);
      
      // Test the grouping function
      const testGrouped = groupItemsByCategory(sampleGroceryList.items);
      console.log('Test grouped items:', testGrouped);
      
      dispatch({ type: GROCERY_ACTIONS.SET_GROCERY_LIST, payload: sampleGroceryList });
      
      // TODO: Implement Firebase loading when connection is fixed
      /*
      const querySnapshot = await getDocs(collection(db, 'groceryLists'));
      if (querySnapshot.empty) {
        // Create new grocery list
        const newList = {
          name: 'Weekly Groceries',
          items: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const docRef = await addDoc(collection(db, 'groceryLists'), newList);
        dispatch({ type: GROCERY_ACTIONS.SET_GROCERY_LIST, payload: { ...newList, id: docRef.id } });
      } else {
        const listDoc = querySnapshot.docs[0];
        const list = { id: listDoc.id, ...listDoc.data() };
        dispatch({ type: GROCERY_ACTIONS.SET_GROCERY_LIST, payload: list });
      }
      */
    } catch (error) {
      console.error('Error loading grocery list:', error);
      dispatch({ type: GROCERY_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Generate grocery list from meal plan
  const generateFromMealPlan = (mealPlan, recipes = []) => {
    try {
      console.log('Generating grocery list from meal plan:', mealPlan);
      console.log('Available recipes:', recipes);
      
      const items = generateGroceryListFromMealPlan(mealPlan, recipes);
      console.log('Generated items:', items);
      
      const newList = {
        id: `grocery_${Date.now()}`,
        name: 'Weekly Groceries',
        items,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      dispatch({ type: GROCERY_ACTIONS.SET_GROCERY_LIST, payload: newList });
      
      // TODO: Save to Firebase when connection is fixed
      /*
      if (state.currentList) {
        const listRef = doc(db, 'groceryLists', state.currentList.id);
        await updateDoc(listRef, {
          items: newList.items,
          updatedAt: new Date()
        });
      }
      */
    } catch (error) {
      console.error('Error generating grocery list:', error);
      dispatch({ type: GROCERY_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Add new item
  const addItem = async (itemData) => {
    try {
      dispatch({ type: GROCERY_ACTIONS.ADD_ITEM, payload: itemData });
      
      // TODO: Save to Firebase when connection is fixed
      /*
      if (state.currentList) {
        const listRef = doc(db, 'groceryLists', state.currentList.id);
        await updateDoc(listRef, {
          items: state.currentList.items,
          updatedAt: new Date()
        });
      }
      */
    } catch (error) {
      console.error('Error adding item:', error);
      dispatch({ type: GROCERY_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Update item
  const updateItem = async (itemId, updates) => {
    try {
      dispatch({ type: GROCERY_ACTIONS.UPDATE_ITEM, payload: { itemId, updates } });
      
      // TODO: Save to Firebase when connection is fixed
      /*
      if (state.currentList) {
        const listRef = doc(db, 'groceryLists', state.currentList.id);
        await updateDoc(listRef, {
          items: state.currentList.items,
          updatedAt: new Date()
        });
      }
      */
    } catch (error) {
      console.error('Error updating item:', error);
      dispatch({ type: GROCERY_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    try {
      dispatch({ type: GROCERY_ACTIONS.DELETE_ITEM, payload: itemId });
      
      // TODO: Save to Firebase when connection is fixed
      /*
      if (state.currentList) {
        const listRef = doc(db, 'groceryLists', state.currentList.id);
        await updateDoc(listRef, {
          items: state.currentList.items,
          updatedAt: new Date()
        });
      }
      */
    } catch (error) {
      console.error('Error deleting item:', error);
      dispatch({ type: GROCERY_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Toggle purchased status
  const togglePurchased = async (itemId) => {
    try {
      dispatch({ type: GROCERY_ACTIONS.TOGGLE_PURCHASED, payload: { itemId } });
      
      // TODO: Save to Firebase when connection is fixed
      /*
      if (state.currentList) {
        const listRef = doc(db, 'groceryLists', state.currentList.id);
        await updateDoc(listRef, {
          items: state.currentList.items,
          updatedAt: new Date()
        });
      }
      */
    } catch (error) {
      console.error('Error toggling purchased status:', error);
      dispatch({ type: GROCERY_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Load grocery list on mount  
  useEffect(() => {
    try {
      // Comment out sample data to test auto-population
      // console.log('Loading sample grocery list...');
      // console.log('Sample data:', sampleGroceryList);
      // console.log('Sample items count:', sampleGroceryList.items.length);
      // dispatch({ type: GROCERY_ACTIONS.SET_GROCERY_LIST, payload: sampleGroceryList });
      
      // Start with empty grocery list
      const emptyList = {
        id: 'grocery_empty',
        name: 'Weekly Groceries',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      dispatch({ type: GROCERY_ACTIONS.SET_GROCERY_LIST, payload: emptyList });
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, []);

  const value = {
    ...state,
    loadGroceryList,
    generateFromMealPlan,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased
  };
  
  console.log('GroceryListProvider value:', value);
  console.log('GroceryListProvider currentList:', value.currentList);
  console.log('GroceryListProvider groupedItems:', value.groupedItems);
  console.log('GroceryListProvider stats:', value.stats);

  return (
    <GroceryListContext.Provider value={value}>
      {children}
    </GroceryListContext.Provider>
  );
};

// Custom hook to use grocery list context
export const useGroceryList = () => {
  const context = useContext(GroceryListContext);
  if (!context) {
    throw new Error('useGroceryList must be used within a GroceryListProvider');
  }
  return context;
};
