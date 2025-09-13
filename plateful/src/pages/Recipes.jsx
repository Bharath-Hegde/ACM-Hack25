import { Typography, Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import RecipeList from '../components/RecipeList';

const Recipes = () => {
  const navigate = useNavigate();
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
    navigate(`/recipes/${recipe.id}`);
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Recipes
        </Typography>
        <Fab 
          color="primary" 
          aria-label="add recipe"
          onClick={handleAddRecipe}
          size="medium"
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
