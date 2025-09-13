import { Typography, Box } from '@mui/material';
import { useMealPlan } from '../context/MealPlanContext';
import MealInsightsWidget from '../components/MealInsightsWidget';

const Insights = () => {
  const { currentMealPlan, loading, error } = useMealPlan();

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>Loading insights...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        📊 Insights
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track your meal patterns and cooking habits over time.
      </Typography>

      <MealInsightsWidget />
    </Box>
  );
};

export default Insights;
