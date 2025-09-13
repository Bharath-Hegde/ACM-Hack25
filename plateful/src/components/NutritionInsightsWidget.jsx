import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Grid,
  CircularProgress
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getWeekStartDate, getWeekDates, MEAL_TYPES, DAYS_OF_WEEK } from '../utils/mealPlanSchema';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useRecipes } from '../context/RecipeContext';

const NutritionInsightsWidget = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate());
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { recipes } = useRecipes();

  // Calculate nutrition data for a specific week
  const calculateWeekNutrition = async (mealPlan) => {
    if (!mealPlan || !mealPlan.meals) {
      console.log('No meal plan or meals found');
      return null;
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;
    let mealCount = 0;

    // Collect all recipe IDs from the week
    const recipeIds = new Set();
    DAYS_OF_WEEK.forEach(day => {
      MEAL_TYPES.forEach(mealType => {
        const meal = mealPlan.meals[day]?.[mealType];
        if (meal && meal.recipe && meal.recipe.id) {
          recipeIds.add(meal.recipe.id);
        }
      });
    });

    console.log('Found recipe IDs:', Array.from(recipeIds));
    console.log('Available recipes from context:', recipes.length);

    // Create a map of recipes by ID for quick lookup
    const recipesMap = new Map();
    recipes.forEach(recipe => {
      recipesMap.set(recipe.id, recipe);
    });

    console.log('Recipes map created with', recipesMap.size, 'recipes');

    // Calculate nutrition for each meal
    DAYS_OF_WEEK.forEach(day => {
      MEAL_TYPES.forEach(mealType => {
        const meal = mealPlan.meals[day]?.[mealType];
        if (meal && meal.recipe && meal.recipe.id) {
          const recipe = recipesMap.get(meal.recipe.id);
          if (recipe && recipe.nutrition) {
            console.log(`Adding nutrition for ${recipe.name}:`, recipe.nutrition);
            totalCalories += recipe.nutrition.calories || 0;
            totalProtein += recipe.nutrition.protein || 0;
            totalCarbs += recipe.nutrition.carbs || 0;
            totalFat += recipe.nutrition.fat || 0;
            totalFiber += recipe.nutrition.fiber || 0;
            mealCount++;
          } else {
            console.log(`Recipe ${meal.recipe.id} not found in recipes map or no nutrition data`);
          }
        }
      });
    });

    console.log('Final nutrition totals:', {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      fiber: totalFiber,
      mealCount
    });

    if (mealCount === 0) {
      console.log('No meals with nutrition data found');
      return null;
    }

    const result = {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      fiber: Math.round(totalFiber),
      mealCount
    };

    console.log('Returning nutrition data:', result);
    return result;
  };

  useEffect(() => {
    const fetchNutritionData = async () => {
      setLoading(true);
      const weekStartString = currentWeekStart.toISOString().split('T')[0];
      
      try {
        // Query Firebase for this week's meal plan
        const mealPlansQuery = query(
          collection(db, 'mealPlans'),
          where('weekStartDate', '==', weekStartString)
        );
        
        const querySnapshot = await getDocs(mealPlansQuery);
        let mealPlan = null;
        
        if (!querySnapshot.empty) {
          const mealPlanDoc = querySnapshot.docs[0];
          mealPlan = { id: mealPlanDoc.id, ...mealPlanDoc.data() };
        }
        
        const nutrition = await calculateWeekNutrition(mealPlan);
        console.log('Nutrition data calculated:', nutrition);
        setNutritionData(nutrition);
      } catch (error) {
        console.error('Error loading nutrition data:', error);
        setNutritionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [currentWeekStart]);

  const handlePreviousWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeek);
  };

  const formatWeekRange = (weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  // Calculate percentages for pie chart
  const getNutritionPercentages = (nutrition) => {
    if (!nutrition || !nutrition.protein || !nutrition.carbs || !nutrition.fat) return null;
    
    const total = nutrition.protein + nutrition.carbs + nutrition.fat;
    if (total === 0) return null;
    
    return {
      protein: Math.round((nutrition.protein / total) * 100),
      carbs: Math.round((nutrition.carbs / total) * 100),
      fat: Math.round((nutrition.fat / total) * 100)
    };
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const percentages = getNutritionPercentages(nutritionData);

  return (
    <Card>
      <CardContent>
        {/* Header with navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Nutrition Composition
          </Typography>
          <Box>
            <IconButton onClick={handlePreviousWeek} size="small">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextWeek} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Week label */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {formatWeekRange(currentWeekStart)}
        </Typography>

        {!nutritionData || !percentages ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No nutrition data available for this week
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Add some recipes to your meal plan to see nutrition insights
            </Typography>
          </Box>
        ) : (
          <>
            {/* Pie Chart */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                {/* Protein (Green) */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `conic-gradient(
                      #4caf50 0deg ${percentages.protein * 3.6}deg,
                      #ff9800 ${percentages.protein * 3.6}deg ${(percentages.protein + percentages.carbs) * 3.6}deg,
                      #f44336 ${(percentages.protein + percentages.carbs) * 3.6}deg 360deg
                    )`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: '60%',
                      height: '60%',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {nutritionData.mealCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      meals
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50', borderRadius: 1 }} />
                <Typography variant="caption">Protein ({percentages.protein}%)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#ff9800', borderRadius: 1 }} />
                <Typography variant="caption">Carbs ({percentages.carbs}%)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, backgroundColor: '#f44336', borderRadius: 1 }} />
                <Typography variant="caption">Fat ({percentages.fat}%)</Typography>
              </Box>
            </Box>

            {/* Nutrition Details */}
            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Weekly Totals
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="primary.main">
                    {nutritionData.calories}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calories
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="success.main">
                    {nutritionData.protein}g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Protein
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="warning.main">
                    {nutritionData.carbs}g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Carbs
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" color="error.main">
                    {nutritionData.fat}g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fat
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Based on {nutritionData.mealCount} home-cooked meals
              </Typography>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NutritionInsightsWidget;
