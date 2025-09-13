import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton, 
  Chip,
  Button
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Restaurant,
  CheckCircle,
  RestaurantMenu,
  Close
} from '@mui/icons-material';
import { 
  getWeekDates, 
  formatDayName, 
  formatMealType, 
  getMealStatusColor, 
  getMealStatusIcon,
  MEAL_STATUSES
} from '../utils/mealPlanSchema';

const WeekCalendar = ({ 
  mealPlan, 
  selectedWeek, 
  onWeekChange, 
  onMealClick, 
  onMealStatusChange 
}) => {
  const weekDates = getWeekDates(selectedWeek);
  const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

  const handlePreviousWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(selectedWeek.getDate() - 7);
    onWeekChange(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(selectedWeek.getDate() + 7);
    onWeekChange(newWeek);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMealDisplay = (meal) => {
    if (!meal || (!meal.recipe && !meal.status)) {
      return (
        <Typography variant="caption" color="text.secondary">
          Tap to add meal
        </Typography>
      );
    }

    if (meal.recipe) {
      return (
        <Box>
          <Typography variant="caption" noWrap sx={{ display: 'block', mb: 0.5 }}>
            {meal.recipe.name}
          </Typography>
          <Chip
            label="Recipe"
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        </Box>
      );
    }

    if (meal.status) {
      return (
        <Box>
          <Typography variant="caption" noWrap sx={{ display: 'block', mb: 0.5 }}>
            {meal.status === MEAL_STATUSES.EATEN_OUT ? '🍽️ Eat Out' : '❌ Skipped'}
          </Typography>
          <Chip
            label={meal.status === MEAL_STATUSES.EATEN_OUT ? 'Eat Out' : 'Skipped'}
            size="small"
            color={getMealStatusColor(meal.status)}
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        </Box>
      );
    }

    return null;
  };

  return (
    <Box>
      {/* Week Navigation */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <IconButton onClick={handlePreviousWeek} size="small">
          <ChevronLeft />
        </IconButton>
        
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {formatDate(selectedWeek)} - {formatDate(weekDates[6])}
        </Typography>
        
        <IconButton onClick={handleNextWeek} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Week Calendar - One tile per row */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {weekDates.map((date, index) => {
          const dayOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
          const dayMeals = mealPlan?.meals?.[dayOfWeek] || {};
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <Box key={dayOfWeek} sx={{ width: '100%' }}>
              <Card 
                sx={{ 
                  minHeight: 200,
                  width: '100%',
                  maxWidth: '100%',
                  border: isToday ? '2px solid' : '1px solid',
                  borderColor: isToday ? 'primary.main' : 'divider',
                  backgroundColor: isToday ? 'primary.50' : 'background.paper',
                  boxSizing: 'border-box'
                }}
              >
                <CardContent sx={{ p: 1.5 }}>
                  {/* Day Header */}
                  <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {formatDayName(dayOfWeek)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(date)}
                    </Typography>
                  </Box>

                  {/* Meals for this day */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {MEAL_TYPES.map(mealType => {
                      const meal = dayMeals[mealType];
                      const hasContent = meal && (meal.recipe || meal.status);

                      return (
                        <Box 
                          key={mealType}
                          sx={{ 
                            p: 1, 
                            border: '1px solid',
                            borderColor: hasContent ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            backgroundColor: hasContent ? 'primary.50' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: hasContent ? 'primary.100' : 'action.hover'
                            }
                          }}
                          onClick={() => onMealClick(dayOfWeek, mealType, meal)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              {formatMealType(mealType)}
                            </Typography>
                          </Box>

                          {getMealDisplay(meal)}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeekCalendar;
