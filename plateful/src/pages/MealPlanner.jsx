import { Typography, Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import { useMealPlan } from '../context/MealPlanContext';
import { useRecipes } from '../context/RecipeContext';
import WeekCalendar from '../components/WeekCalendar';
import MealSelectionDialog from '../components/MealSelectionDialog';

const MealPlanner = () => {
  const {
    currentMealPlan,
    loading,
    error,
    selectedWeek,
    setSelectedWeek,
    assignRecipeToMeal,
    clearMeal,
    markMealAsEatOut,
    markMealAsSkipped,
    getDayMeals
  } = useMealPlan();

  const { recipes } = useRecipes();
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [currentMeal, setCurrentMeal] = useState(null);

  const handleMealClick = (dayOfWeek, mealType, meal) => {
    setSelectedDay(dayOfWeek);
    setSelectedMealType(mealType);
    setCurrentMeal(meal);
    setDialogOpen(true);
  };

  const handleMealStatusChange = (dayOfWeek, mealType, currentStatus) => {
    // No longer needed - status cycling removed
    console.log('Status change clicked - this should not happen anymore');
  };

  const handleAddMeal = () => {
    // For now, just open the dialog for Monday breakfast as an example
    setSelectedDay('monday');
    setSelectedMealType('breakfast');
    setCurrentMeal(null);
    setDialogOpen(true);
  };

  const handleSelectRecipe = (dayOfWeek, mealType, recipe) => {
    assignRecipeToMeal(dayOfWeek, mealType, recipe);
  };

  const handleMarkEatOut = (dayOfWeek, mealType) => {
    markMealAsEatOut(dayOfWeek, mealType);
  };

  const handleMarkSkipped = (dayOfWeek, mealType) => {
    markMealAsSkipped(dayOfWeek, mealType);
  };

  const handleClearMeal = (dayOfWeek, mealType) => {
    clearMeal(dayOfWeek, mealType);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDay(null);
    setSelectedMealType(null);
    setCurrentMeal(null);
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
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Meal Planner
      </Typography>

      <WeekCalendar
        mealPlan={currentMealPlan}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        onMealClick={handleMealClick}
        onMealStatusChange={handleMealStatusChange}
      />

      {/* Meal Selection Dialog */}
      <MealSelectionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSelectRecipe={handleSelectRecipe}
        onMarkEatOut={handleMarkEatOut}
        onMarkSkipped={handleMarkSkipped}
        onClearMeal={handleClearMeal}
        recipes={recipes}
        dayOfWeek={selectedDay}
        mealType={selectedMealType}
        currentMeal={currentMeal}
      />

      {/* Floating Add Button */}
      <Fab 
        color="primary" 
        aria-label="add meal"
        onClick={handleAddMeal}
        sx={{ 
          position: 'fixed', 
          bottom: 80, // Above bottom navigation
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default MealPlanner;
