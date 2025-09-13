import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Restaurant, 
  RestaurantMenu, 
  Close,
  CheckCircle,
  SkipNext
} from '@mui/icons-material';
import { MEAL_STATUSES } from '../utils/mealPlanSchema';

const MealSelectionDialog = ({ 
  open, 
  onClose, 
  onSelectRecipe, 
  onMarkEatOut, 
  onMarkSkipped,
  onClearMeal,
  recipes = [], 
  dayOfWeek, 
  mealType, 
  currentMeal = null 
}) => {
  const handleRecipeSelect = (recipe) => {
    onSelectRecipe(dayOfWeek, mealType, recipe);
    onClose();
  };

  const handleEatOut = () => {
    onMarkEatOut(dayOfWeek, mealType);
    onClose();
  };

  const handleSkip = () => {
    onMarkSkipped(dayOfWeek, mealType);
    onClose();
  };

  const handleClear = () => {
    onClearMeal(dayOfWeek, mealType);
    onClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      [MEAL_STATUSES.PLANNED]: 'default',
      [MEAL_STATUSES.COOKED]: 'success',
      [MEAL_STATUSES.EATEN_OUT]: 'warning',
      [MEAL_STATUSES.SKIPPED]: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      [MEAL_STATUSES.PLANNED]: <Restaurant />,
      [MEAL_STATUSES.COOKED]: <CheckCircle />,
      [MEAL_STATUSES.EATEN_OUT]: <RestaurantMenu />,
      [MEAL_STATUSES.SKIPPED]: <SkipNext />
    };
    return icons[status] || <Restaurant />;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {dayOfWeek ? dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1) : ''} - {mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : ''}
          </Typography>
          <Button onClick={onClose} size="small">
            <Close />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {currentMeal && (currentMeal.recipe || currentMeal.status) ? (
          // Current meal exists - show clear option
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Current Meal:
            </Typography>
            <Card sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                {currentMeal.recipe ? (
                  <>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100 }}
                      image={currentMeal.recipe.imageUrl}
                      alt={currentMeal.recipe.name}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {currentMeal.recipe.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Recipe selected
                      </Typography>
                    </CardContent>
                  </>
                ) : (
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {currentMeal.status === MEAL_STATUSES.EATEN_OUT ? '🍽️ Eat Out' : '❌ Skipped'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentMeal.notes}
                    </Typography>
                  </CardContent>
                )}
              </Box>
            </Card>

            <Divider sx={{ my: 2 }} />
          </Box>
        ) : null}

        {/* Quick Actions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Quick Actions:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {currentMeal && (currentMeal.recipe || currentMeal.status) && (
              <Button
                variant="outlined"
                startIcon={<Close />}
                onClick={handleClear}
                size="small"
                sx={{ 
                  color: 'grey.600',
                  borderColor: 'grey.400',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    borderColor: 'grey.500'
                  }
                }}
              >
                Clear This Meal
              </Button>
            )}
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestaurantMenu />}
              onClick={handleEatOut}
              size="small"
            >
              Eat Out
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<SkipNext />}
              onClick={handleSkip}
              size="small"
            >
              Skip This Meal
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recipe Selection */}
        <Typography variant="subtitle1" gutterBottom>
          {currentMeal && (currentMeal.recipe || currentMeal.status) ? 'Swap with another recipe:' : 'Select a Recipe:'}
        </Typography>
        
        {recipes.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No recipes available. Add some recipes first!
          </Typography>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: 2,
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {recipes.map((recipe) => (
              <Card 
                key={recipe.id} 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { 
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out'
                  }
                }}
                onClick={() => handleRecipeSelect(recipe)}
              >
                <CardMedia
                  component="img"
                  height="120"
                  image={recipe.imageUrl}
                  alt={recipe.name}
                />
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" noWrap>
                    {recipe.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {recipe.prepTime} min • {recipe.servings} servings
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealSelectionDialog;
