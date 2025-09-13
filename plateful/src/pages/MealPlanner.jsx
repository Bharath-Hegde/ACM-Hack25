import { Typography, Box } from '@mui/material';

const MealPlanner = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Meal Planner
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Weekly meal planning coming soon...
      </Typography>
    </Box>
  );
};

export default MealPlanner;
