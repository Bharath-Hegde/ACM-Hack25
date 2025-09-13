import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box, Rating } from '@mui/material';
import { AccessTime, People, Restaurant } from '@mui/icons-material';
import { getTotalTime, getDifficultyColor, formatTime } from '../utils/recipeSchema';

const RecipeCard = ({ recipe, onViewDetails, onAddToMealPlan }) => {
  const totalTime = getTotalTime(recipe);
  const difficultyColor = getDifficultyColor(recipe.difficulty);

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={recipe.imageUrl}
        alt={recipe.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {recipe.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {recipe.description}
        </Typography>

        {/* Recipe info */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatTime(totalTime)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {recipe.servings}
            </Typography>
          </Box>
        </Box>

        {/* Difficulty and tags */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={recipe.difficulty}
            size="small"
            color={difficultyColor === 'green' ? 'success' : difficultyColor === 'orange' ? 'warning' : 'error'}
            variant="outlined"
          />
          
          {recipe.tags.slice(0, 2).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>

        {/* Nutrition info */}
        {recipe.nutrition && (
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {recipe.nutrition.calories} cal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {recipe.nutrition.protein}g protein
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          onClick={() => onViewDetails(recipe)}
          variant="outlined"
          fullWidth
        >
          View Recipe
        </Button>
        <Button 
          size="small" 
          onClick={() => onAddToMealPlan(recipe)}
          variant="contained"
          startIcon={<Restaurant />}
          fullWidth
        >
          Add to Plan
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
