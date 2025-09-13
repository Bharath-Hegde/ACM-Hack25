import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Checkbox, 
  IconButton, 
  Chip,
  LinearProgress,
  Divider,
  Fab
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Edit,
  ShoppingCart,
  CheckCircle
} from '@mui/icons-material';
import { 
  formatCategory, 
  getCategoryColor, 
  formatQuantity 
} from '../utils/groceryListSchema';

const GroceryList = ({ 
  items, 
  groupedItems, 
  stats, 
  onTogglePurchased, 
  onDeleteItem, 
  onEditItem,
  onAddItem 
}) => {
  // Debug logging
  console.log('GroceryList props:', { items, groupedItems, stats });
  console.log('Grouped items keys:', Object.keys(groupedItems || {}));
  console.log('Grouped items values:', Object.values(groupedItems || {}));
  
  const handleTogglePurchased = (itemId) => {
    onTogglePurchased(itemId);
  };

  const handleDeleteItem = (itemId) => {
    onDeleteItem(itemId);
  };

  const handleEditItem = (itemId) => {
    onEditItem(itemId);
  };

  const handleAddItem = () => {
    onAddItem();
  };

  return (
    <Box>
      {/* Stats Header */}
      <Card sx={{ mb: 2, backgroundColor: 'primary.50' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Shopping Progress
            </Typography>
            <Chip 
              label={`${stats?.purchased || 0}/${stats?.total || 0}`}
              color="primary"
              size="small"
            />
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={stats?.progress || 0} 
            sx={{ mb: 1, height: 8, borderRadius: 4 }}
          />
          
          <Typography variant="body2" color="text.secondary">
            {stats?.remaining || 0} items remaining
          </Typography>
        </CardContent>
      </Card>

      {/* Grocery Items by Category */}
      {Object.entries(groupedItems || {}).map(([category, categoryItems]) => {
        if (!categoryItems || !Array.isArray(categoryItems) || categoryItems.length === 0) return null;
        
        const purchasedCount = categoryItems.filter(item => item && typeof item === 'object' && item.purchased).length;
        const totalCount = categoryItems.length;
        
        return (
          <Card key={category} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
              {/* Category Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {formatCategory(category)}
                  </Typography>
                  <Chip 
                    label={`${purchasedCount}/${totalCount}`}
                    size="small"
                    sx={{ 
                      backgroundColor: getCategoryColor(category),
                      color: 'white',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0}
                  sx={{ 
                    width: 60, 
                    height: 4, 
                    borderRadius: 2,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getCategoryColor(category)
                    }
                  }}
                />
              </Box>

              {/* Items in Category */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categoryItems.map((item) => {
                  if (!item || typeof item !== 'object') return null;
                  
                  return (
                    <Box 
                      key={item.id}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 1.5,
                        border: '1px solid',
                        borderColor: item.purchased ? 'success.main' : 'divider',
                      borderRadius: 1,
                      backgroundColor: item.purchased ? 'success.50' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={item.purchased}
                      onChange={() => handleTogglePurchased(item.id)}
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    
                    {/* Item Info */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'black' }}>
                          {formatQuantity(item.quantity, item.unit)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: item.purchased ? 'normal' : 'bold',
                            textDecoration: item.purchased ? 'line-through' : 'none',
                            color: item.purchased ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {item.name}
                        </Typography>
                      </Box>
                      
                      {/* Recipe Tags */}
                      {item.sourceRecipes && item.sourceRecipes.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {item.sourceRecipes.map((recipeName, index) => (
                            <Chip
                              key={index}
                              label={recipeName}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.65rem',
                                height: '20px',
                                '& .MuiChip-label': {
                                  px: 0.5
                                }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      {/* Notes */}
                      {item.notes && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {item.notes}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditItem(item.id)}
                        sx={{ opacity: 0.7 }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteItem(item.id)}
                        sx={{ opacity: 0.7 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        );
      })}

      {/* Empty State */}
      {(stats?.total || 0) === 0 && (
        <Card sx={{ textAlign: 'center', p: 4 }}>
          <CardContent>
            <ShoppingCart sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No items in your grocery list
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate from your meal plan or add items manually
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Add Item FAB */}
      <Fab 
        color="primary" 
        aria-label="add item"
        onClick={handleAddItem}
        sx={{ 
          position: 'fixed', 
          bottom: 80, // Above bottom navigation
          right: 16,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default GroceryList;
