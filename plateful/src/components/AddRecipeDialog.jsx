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
  Chip,
  IconButton,
  Typography,
  Divider,
  Alert
} from '@mui/material';
import { Add, Delete, Close } from '@mui/icons-material';
import { useState } from 'react';

const AddRecipeDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'easy',
    ingredients: [{ name: '', amount: 1, unit: 'pieces', category: 'other' }],
    instructions: [''],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  const difficulties = ['easy', 'medium', 'hard'];
  const units = ['pieces', 'cups', 'tbsp', 'tsp', 'oz', 'lbs', 'g', 'kg', 'ml', 'l', 'cans', 'boxes', 'bags'];
  const categories = ['vegetables', 'dairy', 'grains', 'protein', 'spices', 'fats', 'beverages', 'other'];
  const commonTags = ['vegetarian', 'vegan', 'gluten-free', 'high-protein', 'low-carb', 'quick-meal', 'comfort-food', 'healthy', 'italian', 'asian', 'mexican', 'mediterranean'];

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

  const handleNestedChange = (parentField, childField) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }));
  };

  const handleIngredientChange = (index, field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => 
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    }));
  };

  const handleInstructionChange = (index) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) => 
        i === index ? value : instruction
      )
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 1, unit: 'pieces', category: 'other' }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      setFormData(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index)
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Recipe name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.prepTime <= 0) {
      newErrors.prepTime = 'Prep time must be greater than 0';
    }
    
    if (formData.cookTime <= 0) {
      newErrors.cookTime = 'Cook time must be greater than 0';
    }
    
    if (formData.servings <= 0) {
      newErrors.servings = 'Servings must be greater than 0';
    }
    
    // Validate ingredients
    const emptyIngredients = formData.ingredients.some(ing => !ing.name.trim());
    if (emptyIngredients) {
      newErrors.ingredients = 'All ingredients must have a name';
    }
    
    // Validate instructions
    const emptyInstructions = formData.instructions.some(inst => !inst.trim());
    if (emptyInstructions) {
      newErrors.instructions = 'All instructions must have content';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Clean up empty ingredients and instructions
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.name.trim()),
        instructions: formData.instructions.filter(inst => inst.trim())
      };
      
      onSubmit(cleanedData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'easy',
      ingredients: [{ name: '', amount: 1, unit: 'pieces', category: 'other' }],
      instructions: [''],
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      tags: []
    });
    setErrors({});
    setNewTag('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add New Recipe
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Recipe Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g., Classic Spaghetti Carbonara"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Brief description of the recipe"
                multiline
                rows={2}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (Optional)"
                value={formData.imageUrl}
                onChange={handleChange('imageUrl')}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            
            {/* Time and Servings */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prep Time (minutes)"
                type="number"
                value={formData.prepTime}
                onChange={handleChange('prepTime')}
                error={!!errors.prepTime}
                helperText={errors.prepTime}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cook Time (minutes)"
                type="number"
                value={formData.cookTime}
                onChange={handleChange('cookTime')}
                error={!!errors.cookTime}
                helperText={errors.cookTime}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Servings"
                type="number"
                value={formData.servings}
                onChange={handleChange('servings')}
                error={!!errors.servings}
                helperText={errors.servings}
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={handleChange('difficulty')}
                  label="Difficulty"
                >
                  {difficulties.map(diff => (
                    <MenuItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Tags */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} variant="outlined" size="small">
                  Add Tag
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Common tags: {commonTags.join(', ')}
              </Typography>
            </Grid>
            
            <Divider sx={{ my: 2, width: '100%' }} />
            
            {/* Ingredients */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Ingredients
                </Typography>
                <Button onClick={addIngredient} startIcon={<Add />} size="small">
                  Add Ingredient
                </Button>
              </Box>
              {errors.ingredients && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.ingredients}
                </Alert>
              )}
            </Grid>
            
            {formData.ingredients.map((ingredient, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    label="Ingredient Name"
                    value={ingredient.name}
                    onChange={handleIngredientChange(index, 'name')}
                    sx={{ flexGrow: 1 }}
                    placeholder="e.g., Olive Oil"
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={ingredient.amount}
                    onChange={handleIngredientChange(index, 'amount')}
                    sx={{ width: 100 }}
                    inputProps={{ min: 0.1, step: 0.1 }}
                  />
                  <FormControl sx={{ width: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={ingredient.unit}
                      onChange={handleIngredientChange(index, 'unit')}
                      label="Unit"
                    >
                      {units.map(unit => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ width: 120 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={ingredient.category}
                      onChange={handleIngredientChange(index, 'category')}
                      label="Category"
                    >
                      {categories.map(category => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton 
                    onClick={() => removeIngredient(index)}
                    disabled={formData.ingredients.length === 1}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            
            <Divider sx={{ my: 2, width: '100%' }} />
            
            {/* Instructions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Instructions
                </Typography>
                <Button onClick={addInstruction} startIcon={<Add />} size="small">
                  Add Step
                </Button>
              </Box>
              {errors.instructions && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.instructions}
                </Alert>
              )}
            </Grid>
            
            {formData.instructions.map((instruction, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ mt: 2, minWidth: '24px', fontWeight: 'bold' }}>
                    {index + 1}.
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={instruction}
                    onChange={handleInstructionChange(index)}
                    placeholder="Enter cooking instruction..."
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton 
                    onClick={() => removeInstruction(index)}
                    disabled={formData.instructions.length === 1}
                    color="error"
                    sx={{ mt: 1 }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Grid>
            ))}
            
            <Divider sx={{ my: 2, width: '100%' }} />
            
            {/* Nutrition Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Nutrition Information (Optional)
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={2.4}>
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={formData.nutrition.calories}
                onChange={handleNestedChange('nutrition', 'calories')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={2.4}>
              <TextField
                fullWidth
                label="Protein (g)"
                type="number"
                value={formData.nutrition.protein}
                onChange={handleNestedChange('nutrition', 'protein')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={2.4}>
              <TextField
                fullWidth
                label="Carbs (g)"
                type="number"
                value={formData.nutrition.carbs}
                onChange={handleNestedChange('nutrition', 'carbs')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={2.4}>
              <TextField
                fullWidth
                label="Fat (g)"
                type="number"
                value={formData.nutrition.fat}
                onChange={handleNestedChange('nutrition', 'fat')}
                inputProps={{ min: 0 }}
              />
            </Grid>
            
            <Grid item xs={6} sm={2.4}>
              <TextField
                fullWidth
                label="Fiber (g)"
                type="number"
                value={formData.nutrition.fiber}
                onChange={handleNestedChange('nutrition', 'fiber')}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" size="large">
          Add Recipe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecipeDialog;
