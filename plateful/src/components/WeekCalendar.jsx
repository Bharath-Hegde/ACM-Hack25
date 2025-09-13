import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  IconButton, 
  Chip,
  Button,
  Grid
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
  getMealStatusIcon 
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

  const getMealStatusChip = (meal) => {
    if (!meal || !meal.recipe) {
      return (
        <Chip
          label="Empty"
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
      );
    }

    return (
      <Chip
        label={meal.status}
        size="small"
        color={getMealStatusColor(meal.status)}
        icon={<span>{getMealStatusIcon(meal.status)}</span>}
        sx={{ fontSize: '0.7rem', height: 20 }}
      />
    );
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

      {/* Week Calendar Grid */}
      <Grid container spacing={1}>
        {weekDates.map((date, index) => {
          const dayOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
          const dayMeals = mealPlan?.meals?.[dayOfWeek] || {};
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <Grid item xs={12} sm={6} md={4} lg={1.7} key={dayOfWeek}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: isToday ? '2px solid' : '1px solid',
                  borderColor: isToday ? 'primary.main' : 'divider',
                  backgroundColor: isToday ? 'primary.50' : 'background.paper'
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
                      const hasRecipe = meal && meal.recipe;

                      return (
                        <Box 
                          key={mealType}
                          sx={{ 
                            p: 1, 
                            border: '1px solid',
                            borderColor: hasRecipe ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            backgroundColor: hasRecipe ? 'primary.50' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: hasRecipe ? 'primary.100' : 'action.hover'
                            }
                          }}
                          onClick={() => onMealClick(dayOfWeek, mealType, meal)}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                              {formatMealType(mealType)}
                            </Typography>
                            {hasRecipe && (
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMealStatusChange(dayOfWeek, mealType, meal.status);
                                }}
                                sx={{ p: 0.5 }}
                              >
                                {meal.status === 'planned' ? <Restaurant /> : 
                                 meal.status === 'cooked' ? <CheckCircle /> :
                                 meal.status === 'eaten_out' ? <RestaurantMenu /> : <Close />}
                              </IconButton>
                            )}
                          </Box>

                          {hasRecipe ? (
                            <Box>
                              <Typography variant="caption" noWrap sx={{ display: 'block', mb: 0.5 }}>
                                {meal.recipe.name}
                              </Typography>
                              {getMealStatusChip(meal)}
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Tap to add meal
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WeekCalendar;
