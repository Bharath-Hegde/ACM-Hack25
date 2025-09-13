import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Button, 
  Grid, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Paper,
  IconButton,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  ArrowBack, 
  AccessTime, 
  People, 
  Restaurant, 
  Share,
  Favorite,
  FavoriteBorder,
  Edit
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { getTotalTime, getDifficultyColor, formatTime } from '../utils/recipeSchema';
import { useState } from 'react';
import EditRecipeDialog from '../components/EditRecipeDialog';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { recipes, loading, error, updateRecipe } = useRecipes();
  const [isFavorite, setIsFavorite] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Find the recipe by ID
  const recipe = recipes.find(r => r.id === recipeId);

  const handleBack = () => {
    navigate('/recipes');
  };

  const handleAddToMealPlan = () => {
    console.log('Add to meal plan:', recipe);
    // TODO: Implement add to meal plan functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality
  };

  const handleEditRecipe = () => {
    setEditDialogOpen(true);
  };

  const handleEditRecipeSubmit = async (recipeId, recipeData) => {
    try {
      await updateRecipe(recipeId, recipeData);
      console.log('Recipe updated successfully!');
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      // TODO: Show error toast/notification
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading recipe...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Error loading recipe: {error}
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Recipes
        </Button>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning">
          Recipe not found
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Recipes
        </Button>
      </Box>
    );
  }

  const totalTime = getTotalTime(recipe);
  const difficultyColor = getDifficultyColor(recipe.difficulty);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      backgroundColor: 'background.default',
      p: { xs: 1, sm: 2 },
      boxSizing: 'border-box'
    }}>
      {/* Header with back button */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        width: '100%',
        maxWidth: '100%'
      }}>
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            flexGrow: 1,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            wordBreak: 'break-word'
          }}
        >
          {recipe.name}
        </Typography>
        <IconButton onClick={handleEditRecipe} sx={{ mr: 1 }}>
          <Edit />
        </IconButton>
        <IconButton onClick={handleToggleFavorite} sx={{ mr: 1 }}>
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
      </Box>

      {/* Recipe Image */}
      <Card sx={{ mb: 3, width: '100%', maxWidth: '100%' }}>
        <CardMedia
          component="img"
          height="250"
          image={recipe.imageUrl}
          alt={recipe.name}
          sx={{ 
            objectFit: 'cover',
            width: '100%',
            maxWidth: '100%'
          }}
        />
      </Card>

      {/* Recipe Description */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {recipe.description}
        </Typography>
      </Paper>

      {/* Recipe Info Cards */}
      <Grid container spacing={2} sx={{ mb: 3, width: '100%', maxWidth: '100%' }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1, width: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <AccessTime color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {formatTime(totalTime)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1, width: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <People color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {recipe.servings}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Servings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1, width: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Restaurant color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {recipe.prepTime}m
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prep Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 1, width: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {recipe.cookTime}m
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cook Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tags and Difficulty */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={recipe.difficulty}
            color={difficultyColor === 'green' ? 'success' : difficultyColor === 'orange' ? 'warning' : 'error'}
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
          {recipe.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      </Box>

      {/* Ingredients and Instructions - Using Flexbox instead of Grid */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        gap: 3, 
        width: '100%',
        maxWidth: '100%'
      }}>
        {/* Ingredients */}
        <Box sx={{ 
          flex: 1, 
          minWidth: 0, // Prevents flex item from shrinking below content size
          width: { xs: '100%', md: '50%' }
        }}>
          <Card sx={{ width: '100%', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Ingredients
              </Typography>
              <List dense>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                      secondary={ingredient.category}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Instructions */}
        <Box sx={{ 
          flex: 1, 
          minWidth: 0, // Prevents flex item from shrinking below content size
          width: { xs: '100%', md: '50%' }
        }}>
          <Card sx={{ width: '100%', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <ListItem key={index} sx={{ px: 0, alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 'bold', 
                              mr: 1, 
                              minWidth: '24px',
                              color: 'primary.main'
                            }}
                          >
                            {index + 1}.
                          </Typography>
                          <Typography variant="body2">
                            {instruction}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Nutrition Information */}
      {recipe.nutrition && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Nutrition Information
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Per serving
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {recipe.nutrition.calories}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Calories
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {recipe.nutrition.protein}g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Protein
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {recipe.nutrition.carbs}g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Carbs
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {recipe.nutrition.fat}g
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fat
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Restaurant />}
          onClick={handleAddToMealPlan}
          sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Add to Meal Plan
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={handleBack}
          sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Back to Recipes
        </Button>
      </Box>

      {/* Edit Recipe Dialog */}
      <EditRecipeDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditRecipeSubmit}
        recipe={recipe}
      />
    </Box>
  );
};

export default RecipeDetail;
