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
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={6}>
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
            />
          </Grid>

          {/* Sort */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
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
          </Grid>

          {/* Filter Tags */}
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by tags</InputLabel>
              <Select
                multiple
                value={filterTags}
                onChange={(e) => onFilterChange(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Filter by tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
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
          </Grid>
        </Grid>
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
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
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
