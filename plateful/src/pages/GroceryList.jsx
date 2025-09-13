import { Typography, Box, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Tooltip } from '@mui/material';
import { ShoppingCart, Add } from '@mui/icons-material';
import { useGroceryList } from '../context/GroceryListContext';
import { useMealPlan } from '../context/MealPlanContext';
import { useRecipes } from '../context/RecipeContext';
import GroceryListComponent from '../components/GroceryList';
import AddItemDialog from '../components/AddItemDialog';
import EditItemDialog from '../components/EditItemDialog';
import WeekSelectionDialog from '../components/WeekSelectionDialog';
import { useState } from 'react';

const GroceryList = () => {
  const {
    currentList,
    groupedItems,
    stats,
    loading,
    error,
    togglePurchased,
    deleteItem,
    addItem,
    updateItem,
    generateFromMealPlan
  } = useGroceryList();

  const { currentMealPlan, loadMealPlan } = useMealPlan();
  const { recipes } = useRecipes();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [weekSelectionOpen, setWeekSelectionOpen] = useState(false);
  const [regenerateConfirmOpen, setRegenerateConfirmOpen] = useState(false);

  const handleAddItem = () => {
    setAddDialogOpen(true);
  };

  const handleEditItem = (itemId) => {
    const item = currentList?.items.find(item => item.id === itemId);
    if (item) {
      setEditingItem(item);
      setEditDialogOpen(true);
    }
  };

  const handleAddItemSubmit = (itemData) => {
    addItem(itemData);
    setAddDialogOpen(false);
  };

  const handleEditItemSubmit = (itemId, updates) => {
    updateItem(itemId, updates);
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleCloseDialogs = () => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleGenerateFromMealPlan = async (weekStart) => {
    try {
      // Load the meal plan for the selected week first
      const mealPlan = await loadMealPlan(weekStart);
      if (mealPlan) {
        generateFromMealPlan(mealPlan, recipes);
      }
    } catch (error) {
      console.error('Error loading meal plan for grocery generation:', error);
    }
  };

  const handleOpenWeekSelection = () => {
    setWeekSelectionOpen(true);
  };

  const handleCloseWeekSelection = () => {
    setWeekSelectionOpen(false);
  };

  const handleRegenerateClick = () => {
    setRegenerateConfirmOpen(true);
  };

  const handleRegenerateConfirm = () => {
    setRegenerateConfirmOpen(false);
    setWeekSelectionOpen(true);
  };

  const handleRegenerateCancel = () => {
    setRegenerateConfirmOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          Error loading grocery list: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Grocery List
        </Typography>
        
        {/* Regenerate button - only show when there are items */}
        {(stats?.total || 0) > 0 && (
          <Tooltip title="Replace current list with items from your meal plan">
            <Button
              variant="outlined"
              onClick={handleRegenerateClick}
              startIcon={<ShoppingCart />}
              size="small"
              color="primary"
            >
              Regenerate from Meal Plan
            </Button>
          </Tooltip>
        )}
      </Box>
      
      {/* Show week selection when grocery list is empty */}
      {(stats?.total || 0) === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your grocery list is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate a grocery list from your meal plan or add items manually
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleOpenWeekSelection}
              startIcon={<ShoppingCart />}
              size="large"
            >
              Generate from Meal Plan
            </Button>
            <Button
              variant="outlined"
              onClick={handleAddItem}
              startIcon={<Add />}
              size="large"
            >
              Add Items Manually
            </Button>
          </Box>
        </Box>
      ) : (
        <GroceryListComponent
          items={currentList?.items || []}
          groupedItems={groupedItems}
          stats={stats}
          onTogglePurchased={togglePurchased}
          onDeleteItem={deleteItem}
          onEditItem={handleEditItem}
          onAddItem={handleAddItem}
        />
      )}

      {/* Add Item Dialog */}
      <AddItemDialog
        open={addDialogOpen}
        onClose={handleCloseDialogs}
        onSubmit={handleAddItemSubmit}
      />

      {/* Edit Item Dialog */}
      <EditItemDialog
        open={editDialogOpen}
        onClose={handleCloseDialogs}
        onSubmit={handleEditItemSubmit}
        item={editingItem}
      />

      {/* Week Selection Dialog */}
      <WeekSelectionDialog
        open={weekSelectionOpen}
        onClose={handleCloseWeekSelection}
        onGenerate={handleGenerateFromMealPlan}
      />

      {/* Regenerate Confirmation Dialog */}
      <Dialog
        open={regenerateConfirmOpen}
        onClose={handleRegenerateCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Regenerate Grocery List?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will replace your current grocery list with a new one generated from your meal plan. 
            Any manually added items will be lost. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegenerateCancel}>
            Cancel
          </Button>
          <Button onClick={handleRegenerateConfirm} variant="contained" color="primary">
            Regenerate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroceryList;
