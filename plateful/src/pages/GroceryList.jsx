import { Typography, Box } from '@mui/material';

const GroceryList = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Grocery List
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Smart grocery list generation coming soon...
      </Typography>
    </Box>
  );
};

export default GroceryList;
