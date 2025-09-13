import { Link, useLocation } from 'react-router-dom';
import { Box, Paper, BottomNavigation, BottomNavigationAction, Typography } from '@mui/material';
import { Restaurant, CalendarToday, ShoppingCart } from '@mui/icons-material';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/recipes', label: 'Recipes', icon: <Restaurant /> },
    { path: '/meal-planner', label: 'Plan', icon: <CalendarToday /> },
    { path: '/grocery-list', label: 'Grocery', icon: <ShoppingCart /> },
  ];

  const getCurrentTab = () => {
    const currentPath = location.pathname;
    if (currentPath === '/') return 0; // Default to recipes
    return navItems.findIndex(item => item.path === currentPath);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      width: '100%',
      maxWidth: '100%'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'white',
        textAlign: 'center',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          🍽️ Plateful
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        width: '100%',
        maxWidth: '100%',
        pb: 7, // Space for bottom navigation
        boxSizing: 'border-box'
      }}>
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          borderTop: '1px solid #e0e0e0'
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={getCurrentTab()}
          showLabels
          sx={{
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              marginTop: '4px',
            }
          }}
        >
          {navItems.map((item, index) => (
            <BottomNavigationAction
              key={item.path}
              component={Link}
              to={item.path}
              label={item.label}
              icon={item.icon}
              sx={{
                color: getCurrentTab() === index ? 'primary.main' : 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                }
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;
