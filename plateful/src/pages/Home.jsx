import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { Restaurant, CalendarToday, ShoppingCart, TrendingUp } from '@mui/icons-material';

const Home = () => {
  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Welcome to Plateful
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Smart meal planning, effortless grocery shopping, healthier you.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Restaurant color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Recipe Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse, add, and manage your favorite recipes with detailed nutrition information.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Meal Planning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plan your weekly meals with our intuitive calendar interface.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <ShoppingCart color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Grocery Lists
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Auto-generate organized grocery lists from your meal plans.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <TrendingUp color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Nutrition Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor your nutrition goals and track your healthy eating habits.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
