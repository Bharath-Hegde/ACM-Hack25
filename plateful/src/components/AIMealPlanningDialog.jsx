import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Close,
  SmartToy,
  Restaurant,
  CheckCircle
} from '@mui/icons-material';
import { useState } from 'react';

const AIMealPlanningDialog = ({ 
  open, 
  onClose, 
  onGenerateMealPlan,
  recipes = [],
  isLoading = false,
  selectedWeek = null
}) => {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    eatOutFrequency: '2', // times per week
    preferredCuisines: [],
    mealComplexity: 'medium',
    specialRequests: ''
  });

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 
    'keto', 'paleo', 'low-carb', 'high-protein'
  ];

  const cuisineOptions = [
    'italian', 'asian', 'mexican', 'mediterranean', 
    'american', 'indian', 'thai', 'chinese'
  ];

  const complexityOptions = [
    { value: 'easy', label: 'Quick & Easy (under 30 min)' },
    { value: 'medium', label: 'Moderate (30-60 min)' },
    { value: 'hard', label: 'Complex (60+ min)' }
  ];

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    // Show confirmation dialog before overwriting
    const confirmed = window.confirm(
      'This will overwrite your existing meal plan for this week. Are you sure you want to continue?'
    );
    
    if (confirmed) {
      onGenerateMealPlan(preferences);
    }
  };

  const handleClose = () => {
    setPreferences({
      dietaryRestrictions: [],
      eatOutFrequency: '2',
      preferredCuisines: [],
      mealComplexity: 'medium',
      specialRequests: ''
    });
    onClose();
  };

  const getAvailableTags = () => {
    const allTags = recipes.reduce((acc, recipe) => {
      recipe.tags.forEach(tag => {
        if (!acc.includes(tag)) acc.push(tag);
      });
      return acc;
    }, []);
    return allTags;
  };

  const availableTags = getAvailableTags();

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy color="primary" />
          <Typography variant="h6">
            AI Meal Planning Assistant
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tell me about your preferences and I'll create a personalized meal plan for the week!
        </Typography>

        {/* Week Selection Info */}
        {selectedWeek && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">
              📅 Planning for: {selectedWeek.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - {new Date(selectedWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              ⚠️ This will overwrite any existing meal plan for this week.
            </Typography>
          </Alert>
        )}

        {/* Dietary Restrictions */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dietary Restrictions & Preferences
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {dietaryOptions.map((option) => (
              <Chip
                key={option}
                label={option}
                clickable
                color={preferences.dietaryRestrictions.includes(option) ? 'primary' : 'default'}
                onClick={() => {
                  const newRestrictions = preferences.dietaryRestrictions.includes(option)
                    ? preferences.dietaryRestrictions.filter(r => r !== option)
                    : [...preferences.dietaryRestrictions, option];
                  handlePreferenceChange('dietaryRestrictions', newRestrictions);
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Eat Out Frequency */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>How many times do you want to eat out this week?</InputLabel>
            <Select
              value={preferences.eatOutFrequency}
              label="How many times do you want to eat out this week?"
              onChange={(e) => handlePreferenceChange('eatOutFrequency', e.target.value)}
            >
              <MenuItem value="0">0 times (cook everything at home)</MenuItem>
              <MenuItem value="1">1 time</MenuItem>
              <MenuItem value="2">2 times</MenuItem>
              <MenuItem value="3">3 times</MenuItem>
              <MenuItem value="4">4 times</MenuItem>
              <MenuItem value="5">5 times</MenuItem>
              <MenuItem value="6">6 times</MenuItem>
              <MenuItem value="7">7 times (eat out every meal)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Preferred Cuisines */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preferred Cuisines
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {cuisineOptions.map((cuisine) => (
              <Chip
                key={cuisine}
                label={cuisine}
                clickable
                color={preferences.preferredCuisines.includes(cuisine) ? 'primary' : 'default'}
                onClick={() => {
                  const newCuisines = preferences.preferredCuisines.includes(cuisine)
                    ? preferences.preferredCuisines.filter(c => c !== cuisine)
                    : [...preferences.preferredCuisines, cuisine];
                  handlePreferenceChange('preferredCuisines', newCuisines);
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Meal Complexity */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Preferred Meal Complexity</InputLabel>
            <Select
              value={preferences.mealComplexity}
              label="Preferred Meal Complexity"
              onChange={(e) => handlePreferenceChange('mealComplexity', e.target.value)}
            >
              {complexityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Special Requests */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Requests or Notes"
            placeholder="e.g., I love spicy food, avoid mushrooms, prefer lighter meals for lunch..."
            value={preferences.specialRequests}
            onChange={(e) => handlePreferenceChange('specialRequests', e.target.value)}
          />
        </Box>

        {/* Available Recipe Tags Preview */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Available Recipe Tags in Your Collection
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {availableTags.slice(0, 15).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
              />
            ))}
            {availableTags.length > 15 && (
              <Chip
                label={`+${availableTags.length - 15} more`}
                size="small"
                variant="outlined"
                color="secondary"
              />
            )}
          </Box>
        </Box>

        {isLoading && (
          <Card sx={{ mt: 2, p: 2, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              AI is analyzing your preferences and creating your meal plan...
            </Typography>
          </Card>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate} 
          variant="contained" 
          startIcon={<Restaurant />}
          disabled={isLoading}
        >
          Generate My Meal Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AIMealPlanningDialog;
