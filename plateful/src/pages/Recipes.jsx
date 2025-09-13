import { Typography, Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRecipes } from '../context/RecipeContext';
import RecipeList from '../components/RecipeList';

const Recipes = () => {
  const {
    recipes,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterTags,
    setFilterTags,
    sortBy,
    setSortBy,
    getFilteredRecipes
  } = useRecipes();

  const filteredRecipes = getFilteredRecipes();

  const handleViewDetails = (recipe) => {
    console.log('View recipe details:', recipe);
    // TODO: Open recipe detail modal/page
  };

  const handleAddToMealPlan = (recipe) => {
    console.log('Add to meal plan:', recipe);
    // TODO: Add to meal plan functionality
  };

  const handleAddRecipe = () => {
    console.log('Add new recipe');
    // TODO: Open add recipe modal/page
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Recipes
        </Typography>
        <Fab 
          color="primary" 
          aria-label="add recipe"
          onClick={handleAddRecipe}
          sx={{ ml: 2 }}
        >
          <Add />
        </Fab>
      </Box>

      <RecipeList
        recipes={filteredRecipes}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterTags={filterTags}
        onFilterChange={setFilterTags}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onViewDetails={handleViewDetails}
        onAddToMealPlan={handleAddToMealPlan}
      />
    </Box>
  );
};

export default Recipes;
