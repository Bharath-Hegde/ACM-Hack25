import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useState, useEffect } from 'react';
import { GROCERY_CATEGORIES, UNITS } from '../utils/groceryListSchema';

const EditItemDialog = ({ open, onClose, onSubmit, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'produce',
    quantity: 1,
    unit: 'pieces',
    notes: '',
    purchased: false
  });

  const [errors, setErrors] = useState({});

  // Update form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'produce',
        quantity: item.quantity || 1,
        unit: item.unit || 'pieces',
        notes: item.notes || '',
        purchased: item.purchased || false
      });
    }
  }, [item]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCheckboxChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleQuantityChange = (event) => {
    const value = parseFloat(event.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      quantity: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(item.id, formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'produce',
      quantity: 1,
      unit: 'pieces',
      notes: '',
      purchased: false
    });
    setErrors({});
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Item</DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g., Organic Spinach"
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleChange('category')}
                  label="Category"
                >
                  {GROCERY_CATEGORIES.map(category => (
                    <MenuItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleQuantityChange}
                error={!!errors.quantity}
                helperText={errors.quantity}
                inputProps={{ min: 0.1, step: 0.1 }}
              />
            </Grid>
            
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={handleChange('unit')}
                  label="Unit"
                >
                  {UNITS.map(unit => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (Optional)"
                value={formData.notes}
                onChange={handleChange('notes')}
                placeholder="e.g., Organic preferred, Fresh only"
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.purchased}
                    onChange={handleCheckboxChange('purchased')}
                    color="success"
                  />
                }
                label="Mark as purchased"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemDialog;
