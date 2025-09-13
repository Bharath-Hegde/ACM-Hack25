import { Card, CardMedia, CardContent, CardActions, Typography, Button, Chip, Box, Rating } from '@mui/material';
import { AccessTime, People, Restaurant } from '@mui/icons-material';
import { getTotalTime, getDifficultyColor, formatTime } from '../utils/recipeSchema';

const RecipeCard = ({ recipe, onViewDetails, onAddToMealPlan }) => {
  const totalTime = getTotalTime(recipe);
  const difficultyColor = getDifficultyColor(recipe.difficulty);

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      {recipe.imageUrl && recipe.imageUrl != "" &&
        (<CardMedia
          component="img"
          height="140"
          image={recipe.imageUrl}
          alt={recipe.name}
          sx={{ objectFit: 'cover' }}
        />)
      }
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="subtitle1" component="h2" noWrap>
          {recipe.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.75rem'
          }}
        >
          {recipe.description}
        </Typography>

        {/* Recipe info */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {formatTime(totalTime)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {recipe.servings}
            </Typography>
          </Box>
        </Box>

        {/* Difficulty and tags */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={recipe.difficulty}
            size="small"
            color={difficultyColor === 'green' ? 'success' : difficultyColor === 'orange' ? 'warning' : 'error'}
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
          
          {recipe.tags.slice(0, 1).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              color="primary"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          ))}
        </Box>

        {/* Nutrition info */}
        {recipe.nutrition && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {recipe.nutrition.calories} cal
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {recipe.nutrition.protein}g protein
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 1, pt: 0, flexDirection: 'column', gap: 1 }}>
        <Button 
          size="small" 
          onClick={() => onViewDetails(recipe)}
          variant="outlined"
          fullWidth
          sx={{ fontSize: '0.75rem', py: 0.5 }}
        >
          View
        </Button>
        <Button 
          size="small" 
          onClick={() => onAddToMealPlan(recipe)}
          variant="contained"
          startIcon={<Restaurant />}
          fullWidth
          sx={{ fontSize: '0.75rem', py: 0.5 }}
        >
          Add to Plan
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
