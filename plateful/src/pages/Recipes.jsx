import { Typography, Box, Fab } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';
import RecipeList from '../components/RecipeList';
import AddRecipeDialog from '../components/AddRecipeDialog';

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
    getFilteredRecipes,
    addRecipe
  } = useRecipes();

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredRecipes = getFilteredRecipes();

  const handleViewDetails = (recipe) => {
    navigate(`/recipes/${recipe.id}`);
  };

  const handleAddToMealPlan = (recipe) => {
    console.log('Add to meal plan:', recipe);
    // TODO: Add to meal plan functionality
  };

  const handleAddRecipe = () => {
    setAddDialogOpen(true);
  };

  const handleAddRecipeSubmit = async (recipeData) => {
    try {
      await addRecipe(recipeData);
      console.log('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      // TODO: Show error toast/notification
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Recipes
      </Typography>


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

      {/* Add Recipe Dialog */}
      <AddRecipeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddRecipeSubmit}
      />

      {/* Floating Add Button */}
      <Fab 
        color="primary" 
        aria-label="add recipe"
        onClick={handleAddRecipe}
        sx={{ 
          position: 'fixed', 
          bottom: 80, // Above bottom navigation
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Recipes;
