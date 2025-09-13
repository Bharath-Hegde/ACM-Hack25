import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { CalendarToday, Restaurant, ShoppingCart } from '@mui/icons-material';
import { useMealPlan } from '../context/MealPlanContext';
import { getWeekStartDate, getWeekDates, formatDayName, DAYS_OF_WEEK, MEAL_TYPES } from '../utils/mealPlanSchema';

const WeekSelectionDialog = ({ open, onClose, onGenerate }) => {
  const { currentMealPlan, loadMealPlan, loading } = useMealPlan();
  const [selectedWeek, setSelectedWeek] = useState(getWeekStartDate());
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [weekStats, setWeekStats] = useState(new Map()); // Store stats for all weeks
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Generate list of available weeks (current week + next 3 weeks)
  useEffect(() => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay() + 1 + (i * 7)); // Start from Monday
      weeks.push(weekStart);
    }
    
    setAvailableWeeks(weeks);
  }, []);

  // Load stats for all available weeks when dialog opens
  useEffect(() => {
    if (open && availableWeeks.length > 0) {
      const loadAllWeeksStats = async () => {
        setIsLoadingStats(true);
        const statsMap = new Map();
        
        // Load stats for all available weeks
        for (const weekStart of availableWeeks) {
          const weekStartString = weekStart.toISOString().split('T')[0];
          
          try {
            const mealPlan = await loadMealPlan(weekStart);
            if (mealPlan) {
              const stats = calculateMealPlanStats(mealPlan);
              statsMap.set(weekStartString, stats);
            } else {
              // Set default stats for this week if no meal plan
              statsMap.set(weekStartString, { totalMeals: 21, plannedMeals: 0, recipes: 0 });
            }
          } catch (error) {
            console.error(`Error loading meal plan for week ${weekStartString}:`, error);
            // Set default stats for this week
            statsMap.set(weekStartString, { totalMeals: 21, plannedMeals: 0, recipes: 0 });
          }
        }
        
        setWeekStats(statsMap);
        setIsLoadingStats(false);
      };
      
      loadAllWeeksStats();
    }
  }, [open, availableWeeks]); // Removed currentMealPlan to prevent infinite loop

  const handleWeekSelect = (weekStart) => {
    setSelectedWeek(weekStart);
    // Stats are already loaded when dialog opens, no need to reload
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Pass the selected week to the generation function
      // The generation function will handle loading the meal plan
      await onGenerate(selectedWeek);
      setIsGenerating(false);
      onClose();
    } catch (error) {
      console.error('Error generating grocery list:', error);
      setIsGenerating(false);
    }
  };

  const formatWeekRange = (weekStart) => {
    const dates = getWeekDates(weekStart);
    const startDate = dates[0];
    const endDate = dates[6];
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const calculateMealPlanStats = (mealPlan) => {
    let totalMeals = 21; // Fixed total: 7 days * 3 meals
    let plannedMeals = 0;
    let recipes = 0;

    DAYS_OF_WEEK.forEach(day => {
      MEAL_TYPES.forEach(mealType => {
        const meal = mealPlan.meals[day]?.[mealType];
        if (meal && (meal.recipe || meal.status)) {
          plannedMeals++;
          if (meal.recipe) {
            recipes++;
          }
        }
      });
    });

    return { totalMeals, plannedMeals, recipes };
  };

  const getMealPlanStats = (weekStart) => {
    const weekStartString = weekStart.toISOString().split('T')[0];
    
    // Return stored stats if available, otherwise return default
    return weekStats.get(weekStartString) || { totalMeals: 21, plannedMeals: 0, recipes: 0 };
  };

  const isCurrentWeek = (weekStart) => {
    const today = new Date();
    const currentWeekStart = getWeekStartDate(today);
    return weekStart.toISOString().split('T')[0] === currentWeekStart.toISOString().split('T')[0];
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCart color="primary" />
          <Typography variant="h6" component="div">
            Generate Grocery List
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Select a week to generate your grocery list from the planned meals. 
          Ingredients will be automatically consolidated and organized by category.
        </Typography>

        {(loading || isLoadingStats) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {isLoadingStats ? 'Loading week stats...' : 'Loading meal plans...'}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {availableWeeks.map((weekStart) => {
            const stats = getMealPlanStats(weekStart);
            const isSelected = selectedWeek.toISOString().split('T')[0] === weekStart.toISOString().split('T')[0];
            const isCurrent = isCurrentWeek(weekStart);
            
            return (
              <Card 
                key={weekStart.toISOString()}
                sx={{ 
                  border: isSelected ? 2 : 1,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  cursor: 'pointer'
                }}
              >
                <CardActionArea onClick={() => handleWeekSelect(weekStart)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="h6">
                          {formatWeekRange(weekStart)}
                        </Typography>
                        {isCurrent && (
                          <Chip 
                            label="Current Week" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Restaurant fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {stats.plannedMeals}/{stats.totalMeals} meals planned
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${stats.recipes} recipes`}
                        size="small"
                        variant="outlined"
                        color={stats.recipes > 0 ? 'primary' : 'default'}
                      />
                      <Chip 
                        label={`${Math.round((stats.plannedMeals / stats.totalMeals) * 100)}% planned`}
                        size="small"
                        variant="outlined"
                        color={stats.plannedMeals > 0 ? 'success' : 'default'}
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>

        {selectedWeek && getMealPlanStats(selectedWeek).recipes === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No recipes planned for this week. You can still generate an empty grocery list and add items manually.
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate}
          variant="contained"
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={16} /> : <ShoppingCart />}
        >
          {isGenerating ? 'Generating...' : 'Generate List'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeekSelectionDialog;
