import { Typography, Box, Fab, Button } from '@mui/material';
import { Add, SmartToy } from '@mui/icons-material';
import { useState } from 'react';
import { useMealPlan } from '../context/MealPlanContext';
import { useRecipes } from '../context/RecipeContext';
import { generateMealPlan, isApiKeyAvailable } from '../services/claudeService';
import WeekCalendar from '../components/WeekCalendar';
import MealSelectionDialog from '../components/MealSelectionDialog';
import AIMealPlanningDialog from '../components/AIMealPlanningDialog';

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
    markMealAsSkip,
    autoPopulateMealPlan,
    getDayMeals
  } = useMealPlan();

  const { recipes } = useRecipes();
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [currentMeal, setCurrentMeal] = useState(null);
  
  // AI Meal Planning state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);

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

  const handleMarkSkip = (dayOfWeek, mealType) => {
    markMealAsSkip(dayOfWeek, mealType);
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

  const handleAIGenerateMealPlan = async (preferences) => {
    setIsGeneratingMealPlan(true);
    try {
      console.log('🚀 Starting AI meal plan generation...');
      console.log('👤 User preferences:', preferences);
      console.log('📚 Available recipes count:', recipes.length);
      console.log('📅 Selected week:', selectedWeek);
      
      // Check if API key is available
      if (!isApiKeyAvailable()) {
        console.log('❌ API key not found in .env file');
        throw new Error('Claude API key not found. Please add VITE_CLAUDE_API_KEY to your .env file');
      } else {
        console.log('✅ API key loaded from .env file');
      }
      
      // Generate meal plan using Claude API
      console.log('🤖 Calling Claude API...');
      const aiMealPlan = await generateMealPlan(preferences, recipes);
      
      // Auto-populate the current meal plan with AI suggestions
      console.log('📝 Auto-populating meal plan...');
      await autoPopulateMealPlan(aiMealPlan);
      
      // Close the dialog
      setAiDialogOpen(false);
      
      console.log('🎉 Meal plan generated and populated successfully!');
    } catch (error) {
      console.error('❌ Error generating meal plan:', error);
      alert(`Error generating meal plan: ${error.message}`);
    } finally {
      setIsGeneratingMealPlan(false);
    }
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
        <Button
          variant="contained"
          startIcon={<SmartToy />}
          onClick={() => setAiDialogOpen(true)}
          sx={{ 
            backgroundColor: 'secondary.main',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            }
          }}
        >
          AI Meal Planning
        </Button>
      </Box>

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
        onMarkSkip={handleMarkSkip}
        onClearMeal={handleClearMeal}
        recipes={recipes}
        dayOfWeek={selectedDay}
        mealType={selectedMealType}
        currentMeal={currentMeal}
      />

      {/* AI Meal Planning Dialog */}
      <AIMealPlanningDialog
        open={aiDialogOpen}
        onClose={() => setAiDialogOpen(false)}
        onGenerateMealPlan={handleAIGenerateMealPlan}
        recipes={recipes}
        isLoading={isGeneratingMealPlan}
        selectedWeek={selectedWeek}
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
