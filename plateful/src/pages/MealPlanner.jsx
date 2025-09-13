import { Typography, Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useMealPlan } from '../context/MealPlanContext';
import WeekCalendar from '../components/WeekCalendar';

const MealPlanner = () => {
  const {
    currentMealPlan,
    loading,
    error,
    selectedWeek,
    setSelectedWeek,
    assignRecipeToMeal,
    updateMealStatus,
    getDayMeals
  } = useMealPlan();

  const handleMealClick = (dayOfWeek, mealType, meal) => {
    console.log('Meal clicked:', { dayOfWeek, mealType, meal });
    // TODO: Open recipe selection modal
  };

  const handleMealStatusChange = (dayOfWeek, mealType, currentStatus) => {
    console.log('Meal status change:', { dayOfWeek, mealType, currentStatus });
    // TODO: Open status selection modal
  };

  const handleAddMeal = () => {
    console.log('Add meal clicked');
    // TODO: Open add meal modal
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Loading meal plan...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Meal Planner
        </Typography>
        <Fab 
          color="primary" 
          aria-label="add meal"
          onClick={handleAddMeal}
          size="medium"
        >
          <Add />
        </Fab>
      </Box>

      <WeekCalendar
        mealPlan={currentMealPlan}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        onMealClick={handleMealClick}
        onMealStatusChange={handleMealStatusChange}
      />
    </Box>
  );
};

export default MealPlanner;
