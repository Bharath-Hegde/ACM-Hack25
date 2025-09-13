import { Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useGroceryList } from '../context/GroceryListContext';
import GroceryListComponent from '../components/GroceryList';
import AddItemDialog from '../components/AddItemDialog';
import EditItemDialog from '../components/EditItemDialog';
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
    updateItem
  } = useGroceryList();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Grocery List
      </Typography>
      
      <GroceryListComponent
        items={currentList?.items || []}
        groupedItems={groupedItems}
        stats={stats}
        onTogglePurchased={togglePurchased}
        onDeleteItem={deleteItem}
        onEditItem={handleEditItem}
        onAddItem={handleAddItem}
      />

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
    </Box>
  );
};

export default GroceryList;
