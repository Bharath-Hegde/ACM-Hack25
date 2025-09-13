import { createContext, useContext, useReducer, useEffect } from 'react';
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

// Initial state
const initialState = {
  currentMealPlan: null,
  loading: false,
  error: null,
  selectedWeek: getWeekStartDate(),
  selectedDay: null,
  selectedMealType: null
};

// Action types
const MEAL_PLAN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_MEAL_PLAN: 'SET_MEAL_PLAN',
  UPDATE_MEAL: 'UPDATE_MEAL',
  SET_ERROR: 'SET_ERROR',
  SET_SELECTED_WEEK: 'SET_SELECTED_WEEK',
  SET_SELECTED_DAY: 'SET_SELECTED_DAY',
  SET_SELECTED_MEAL_TYPE: 'SET_SELECTED_MEAL_TYPE'
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
    
    default:
      return state;
  }
};

// Provider component
export const MealPlanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mealPlanReducer, initialState);

  // Load meal plan for current week
  const loadMealPlan = async (weekStartDate = state.selectedWeek) => {
    try {
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_LOADING, payload: true });
      
      // For now, use sample data (skip Firebase due to connection issues)
      console.log('Loading sample meal plan...');
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_MEAL_PLAN, payload: sampleMealPlan });
      
      // TODO: Implement Firebase loading when connection is fixed
      /*
      const mealPlansQuery = query(
        collection(db, 'mealPlans'),
        where('weekStartDate', '==', weekStartDate)
      );
      
      const querySnapshot = await getDocs(mealPlansQuery);
      
      if (querySnapshot.empty) {
        // Create new meal plan for this week
        const newMealPlan = createEmptyMealPlan(weekStartDate);
        const docRef = await addDoc(collection(db, 'mealPlans'), newMealPlan);
        dispatch({ type: MEAL_PLAN_ACTIONS.SET_MEAL_PLAN, payload: { ...newMealPlan, id: docRef.id } });
      } else {
        const mealPlanDoc = querySnapshot.docs[0];
        const mealPlan = { id: mealPlanDoc.id, ...mealPlanDoc.data() };
        dispatch({ type: MEAL_PLAN_ACTIONS.SET_MEAL_PLAN, payload: mealPlan });
      }
      */
    } catch (error) {
      console.error('Error loading meal plan:', error);
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Update a specific meal
  const updateMeal = async (dayOfWeek, mealType, mealData) => {
    try {
      dispatch({ 
        type: MEAL_PLAN_ACTIONS.UPDATE_MEAL, 
        payload: { dayOfWeek, mealType, mealData } 
      });
      
      // TODO: Save to Firebase when connection is fixed
      /*
      if (state.currentMealPlan) {
        const mealPlanRef = doc(db, 'mealPlans', state.currentMealPlan.id);
        await updateDoc(mealPlanRef, {
          [`meals.${dayOfWeek}.${mealType}`]: mealData,
          updatedAt: new Date()
        });
      }
      */
    } catch (error) {
      console.error('Error updating meal:', error);
      dispatch({ type: MEAL_PLAN_ACTIONS.SET_ERROR, payload: error.message });
    }
  };

  // Assign recipe to meal
  const assignRecipeToMeal = (dayOfWeek, mealType, recipe) => {
    const mealData = {
      recipe,
      status: MEAL_STATUSES.PLANNED,
      plannedAt: new Date(),
      notes: ''
    };
    updateMeal(dayOfWeek, mealType, mealData);
  };

  // Update meal status
  const updateMealStatus = (dayOfWeek, mealType, status) => {
    const mealData = {
      status,
      completedAt: status === MEAL_STATUSES.COOKED ? new Date() : null
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

  // Navigation functions
  const setSelectedWeek = (weekStartDate) => {
    dispatch({ type: MEAL_PLAN_ACTIONS.SET_SELECTED_WEEK, payload: weekStartDate });
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
    loadMealPlan();
  }, []);

  const value = {
    ...state,
    loadMealPlan,
    updateMeal,
    assignRecipeToMeal,
    updateMealStatus,
    removeRecipeFromMeal,
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
