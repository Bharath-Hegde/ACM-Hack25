import { Typography, Box, Fab, Button } from '@mui/material';
import { Add, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { sampleRecipes } from '../utils/recipeSchema';
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
    window.scrollTo(0, 0);
  };

  const handleAddToMealPlan = (recipe) => {
    console.log('Add to meal plan:', recipe);
    // TODO: Add to meal plan functionality
  };

  const handleAddRecipe = () => {
    setAddDialogOpen(true);
  };

  const handlePopulateSampleRecipes = async () => {
    try {
      // Clear existing recipes first
      const recipesSnapshot = await getDocs(collection(db, 'recipes'));
      const deletePromises = recipesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Add sample recipes
      const addedRecipes = [];
      for (const recipe of sampleRecipes) {
        // Remove the hardcoded ID before uploading to Firebase
        const { id, ...recipeWithoutId } = recipe;
        const docRef = await addDoc(collection(db, 'recipes'), recipeWithoutId);
        addedRecipes.push({ id: docRef.id, ...recipeWithoutId });
      }
      
      console.log('Sample recipes populated:', addedRecipes.length);
      // Reload recipes - this will now be handled by the context's loadRecipes
      // which will prevent concurrent calls
      loadRecipes();
    } catch (error) {
      console.error('Error populating sample recipes:', error);
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Recipes
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handlePopulateSampleRecipes}
          size="small"
          sx={{ mr: 1 }}
        >
          Add Sample Recipes
        </Button>
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
