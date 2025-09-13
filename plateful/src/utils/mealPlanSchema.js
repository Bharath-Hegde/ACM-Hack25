// Meal plan data schema and utilities
export const mealPlanSchema = {
  id: 'string',
  weekStartDate: 'date', // Monday of the week
  meals: {
    // Structure: { [dayOfWeek]: { [mealType]: { recipe, status, notes } } }
    // dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    // mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    // status: 'planned' | 'cooked' | 'eaten_out' | 'skipped'
  },
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Days of the week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

// Meal types
export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack'
];

// Meal statuses
export const MEAL_STATUSES = {
  PLANNED: 'planned',
  COOKED: 'cooked',
  EATEN_OUT: 'eaten_out',
  SKIPPED: 'skipped'
};

// Helper functions
export const getWeekStartDate = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

export const getWeekDates = (weekStart) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export const formatDayName = (dayOfWeek) => {
  return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
};

export const formatMealType = (mealType) => {
  return mealType.charAt(0).toUpperCase() + mealType.slice(1);
};

export const getMealStatusColor = (status) => {
  const colors = {
    [MEAL_STATUSES.PLANNED]: 'grey',
    [MEAL_STATUSES.COOKED]: 'green',
    [MEAL_STATUSES.EATEN_OUT]: 'orange',
    [MEAL_STATUSES.SKIPPED]: 'red'
  };
  return colors[status] || 'grey';
};

export const getMealStatusIcon = (status) => {
  const icons = {
    [MEAL_STATUSES.PLANNED]: '📋',
    [MEAL_STATUSES.COOKED]: '✅',
    [MEAL_STATUSES.EATEN_OUT]: '🍽️',
    [MEAL_STATUSES.SKIPPED]: '❌'
  };
  return icons[status] || '📋';
};

// Create empty meal plan for a week
export const createEmptyMealPlan = (weekStartDate) => {
  const meals = {};
  
  DAYS_OF_WEEK.forEach(day => {
    meals[day] = {};
    MEAL_TYPES.forEach(mealType => {
      meals[day][mealType] = {
        recipe: null,
        status: MEAL_STATUSES.PLANNED,
        notes: '',
        plannedAt: null,
        completedAt: null
      };
    });
  });

  return {
    id: `mealplan_${weekStartDate.getTime()}`,
    weekStartDate,
    meals,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Get meals for a specific day
export const getDayMeals = (mealPlan, dayOfWeek) => {
  return mealPlan?.meals?.[dayOfWeek] || {};
};

// Get meals for a specific meal type across the week
export const getMealTypeAcrossWeek = (mealPlan, mealType) => {
  const meals = {};
  DAYS_OF_WEEK.forEach(day => {
    meals[day] = mealPlan?.meals?.[day]?.[mealType] || null;
  });
  return meals;
};

// Count meals by status
export const countMealsByStatus = (mealPlan) => {
  const counts = {
    [MEAL_STATUSES.PLANNED]: 0,
    [MEAL_STATUSES.COOKED]: 0,
    [MEAL_STATUSES.EATEN_OUT]: 0,
    [MEAL_STATUSES.SKIPPED]: 0
  };

  DAYS_OF_WEEK.forEach(day => {
    MEAL_TYPES.forEach(mealType => {
      const meal = mealPlan?.meals?.[day]?.[mealType];
      if (meal && meal.recipe) {
        counts[meal.status]++;
      }
    });
  });

  return counts;
};

// Calculate home-cooked streak
export const calculateHomeCookedStreak = (mealPlan) => {
  let streak = 0;
  const today = new Date();
  const weekStart = getWeekStartDate(today);
  
  // Check each day from today backwards
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    // Skip if checking future dates
    if (checkDate > today) continue;
    
    const dayOfWeek = DAYS_OF_WEEK[checkDate.getDay() === 0 ? 6 : checkDate.getDay() - 1];
    const dayMeals = getDayMeals(mealPlan, dayOfWeek);
    
    // Check if any meal was cooked at home
    const hasHomeCooked = MEAL_TYPES.some(mealType => {
      const meal = dayMeals[mealType];
      return meal && meal.recipe && meal.status === MEAL_STATUSES.COOKED;
    });
    
    if (hasHomeCooked) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Sample meal plan data for testing
export const sampleMealPlan = createEmptyMealPlan(getWeekStartDate());

// Add some sample meals
sampleMealPlan.meals.monday.breakfast = {
  recipe: {
    id: '1',
    name: 'Classic Spaghetti Carbonara',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400'
  },
  status: MEAL_STATUSES.PLANNED,
  notes: 'Quick breakfast',
  plannedAt: new Date(),
  completedAt: null
};

sampleMealPlan.meals.tuesday.lunch = {
  recipe: {
    id: '2',
    name: 'Mediterranean Quinoa Bowl',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
  },
  status: MEAL_STATUSES.COOKED,
  notes: 'Healthy lunch',
  plannedAt: new Date(),
  completedAt: new Date()
};

sampleMealPlan.meals.wednesday.dinner = {
  recipe: {
    id: '3',
    name: 'Chicken Teriyaki Stir Fry',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400'
  },
  status: MEAL_STATUSES.PLANNED,
  notes: 'Family dinner',
  plannedAt: new Date(),
  completedAt: null
};
