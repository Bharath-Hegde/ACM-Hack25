import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography,
  Chip,
  OutlinedInput,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import RecipeCard from './RecipeCard';

const RecipeList = ({ 
  recipes, 
  loading, 
  error, 
  searchTerm, 
  onSearchChange, 
  filterTags, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  onViewDetails, 
  onAddToMealPlan 
}) => {
  const availableTags = [
    'vegetarian', 'vegan', 'gluten-free', 'high-protein', 'low-carb',
    'italian', 'asian', 'mediterranean', 'comfort-food', 'healthy',
    'quick-meal', 'easy', 'medium', 'hard'
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'prepTime', label: 'Prep Time' },
    { value: 'cookTime', label: 'Cook Time' },
    { value: 'createdAt', label: 'Recently Added' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading recipes: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Box sx={{ mb: 2 }}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search recipes, ingredients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
          }}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Sort and Filter Row */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortBy}
              label="Sort by"
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              multiple
              value={filterTags}
              onChange={(e) => onFilterChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput label="Filter" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.slice(0, 1).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                  {selected.length > 1 && (
                    <Chip label={`+${selected.length - 1}`} size="small" />
                  )}
                </Box>
              )}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
      </Typography>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recipes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {recipes.map((recipe) => (
            <Grid item xs={6} sm={4} key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                onViewDetails={onViewDetails}
                onAddToMealPlan={onAddToMealPlan}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecipeList;
