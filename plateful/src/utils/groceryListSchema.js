// Grocery list data schema and utilities
export const groceryListSchema = {
  id: 'string',
  name: 'string',
  items: [
    {
      id: 'string',
      name: 'string',
      category: 'string',
      quantity: 'number',
      unit: 'string',
      purchased: 'boolean',
      notes: 'string',
      source: 'string', // 'meal_plan' | 'manual' | 'recipe'
      sourceId: 'string', // ID of the meal plan or recipe
      createdAt: 'timestamp',
      updatedAt: 'timestamp'
    }
  ],
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Grocery item categories
export const GROCERY_CATEGORIES = [
  'produce',
  'meat',
  'dairy',
  'pantry',
  'frozen',
  'bakery',
  'beverages',
  'snacks',
  'condiments',
  'other'
];

// Common units
export const UNITS = [
  'pieces',
  'lbs',
  'kg',
  'oz',
  'g',
  'cups',
  'tbsp',
  'tsp',
  'ml',
  'l',
  'cans',
  'boxes',
  'bags'
];

// Category display names
export const CATEGORY_DISPLAY_NAMES = {
  produce: '🥬 Produce',
  meat: '🥩 Meat & Seafood',
  dairy: '🥛 Dairy & Eggs',
  pantry: '🥫 Pantry',
  frozen: '❄️ Frozen',
  bakery: '🍞 Bakery',
  beverages: '🥤 Beverages',
  snacks: '🍿 Snacks',
  condiments: '🧂 Condiments',
  other: '📦 Other'
};

// Category colors for UI
export const CATEGORY_COLORS = {
  produce: '#4caf50',
  meat: '#f44336',
  dairy: '#ffeb3b',
  pantry: '#ff9800',
  frozen: '#2196f3',
  bakery: '#8d6e63',
  beverages: '#9c27b0',
  snacks: '#ff5722',
  condiments: '#795548',
  other: '#607d8b'
};

// Helper functions
export const formatCategory = (category) => {
  return CATEGORY_DISPLAY_NAMES[category] || category;
};

export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#607d8b';
};

export const formatQuantity = (quantity, unit) => {
  if (quantity === 1 && unit === 'pieces') {
    return '1';
  }
  return `${quantity} ${unit}`;
};

export const categorizeIngredient = (ingredientName) => {
  const name = ingredientName.toLowerCase();
  
  // Produce
  if (name.includes('onion') || name.includes('garlic') || name.includes('tomato') || 
      name.includes('lettuce') || name.includes('spinach') || name.includes('carrot') ||
      name.includes('pepper') || name.includes('cucumber') || name.includes('avocado') ||
      name.includes('lemon') || name.includes('lime') || name.includes('herb') ||
      name.includes('basil') || name.includes('parsley') || name.includes('cilantro')) {
    return 'produce';
  }
  
  // Meat
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork') ||
      name.includes('fish') || name.includes('salmon') || name.includes('shrimp') ||
      name.includes('turkey') || name.includes('lamb') || name.includes('bacon')) {
    return 'meat';
  }
  
  // Dairy
  if (name.includes('milk') || name.includes('cheese') || name.includes('butter') ||
      name.includes('yogurt') || name.includes('cream') || name.includes('egg')) {
    return 'dairy';
  }
  
  // Pantry
  if (name.includes('rice') || name.includes('pasta') || name.includes('flour') ||
      name.includes('sugar') || name.includes('oil') || name.includes('vinegar') ||
      name.includes('salt') || name.includes('pepper') || name.includes('spice') ||
      name.includes('grain') || name.includes('bean') || name.includes('lentil')) {
    return 'pantry';
  }
  
  // Frozen
  if (name.includes('frozen') || name.includes('ice cream')) {
    return 'frozen';
  }
  
  // Bakery
  if (name.includes('bread') || name.includes('roll') || name.includes('bagel') ||
      name.includes('croissant') || name.includes('muffin')) {
    return 'bakery';
  }
  
  // Beverages
  if (name.includes('juice') || name.includes('soda') || name.includes('water') ||
      name.includes('coffee') || name.includes('tea') || name.includes('wine') ||
      name.includes('beer')) {
    return 'beverages';
  }
  
  // Snacks
  if (name.includes('chip') || name.includes('crack') || name.includes('nut') ||
      name.includes('popcorn') || name.includes('cookie') || name.includes('candy')) {
    return 'snacks';
  }
  
  // Condiments
  if (name.includes('sauce') || name.includes('ketchup') || name.includes('mustard') ||
      name.includes('mayo') || name.includes('dressing') || name.includes('syrup')) {
    return 'condiments';
  }
  
  return 'other';
};

export const parseIngredientQuantity = (ingredient) => {
  // Simple parsing - in a real app, you'd use a more sophisticated parser
  const parts = ingredient.trim().split(' ');
  
  if (parts.length === 1) {
    return { quantity: 1, unit: 'pieces', name: parts[0] };
  }
  
  const quantity = parseFloat(parts[0]);
  if (isNaN(quantity)) {
    return { quantity: 1, unit: 'pieces', name: ingredient };
  }
  
  const unit = parts[1] || 'pieces';
  const name = parts.slice(2).join(' ') || parts[0];
  
  return { quantity, unit, name };
};

export const generateGroceryListFromMealPlan = (mealPlan, recipes = []) => {
  const items = [];
  const itemMap = new Map(); // To aggregate duplicate items
  
  // Create a map of recipe ID to full recipe details
  const recipeMap = new Map();
  recipes.forEach(recipe => {
    recipeMap.set(recipe.id, recipe);
  });
  
  // Process each day's meals
  Object.values(mealPlan.meals).forEach(dayMeals => {
    Object.values(dayMeals).forEach(meal => {
      if (meal.recipe && meal.recipe.id) {
        // Get full recipe details
        const fullRecipe = recipeMap.get(meal.recipe.id);
        if (fullRecipe && fullRecipe.ingredients) {
          fullRecipe.ingredients.forEach(ingredient => {
            // Handle both string and object ingredient formats
            let quantity, unit, name;
            
            if (typeof ingredient === 'string') {
              // Parse string format: "2 cups flour"
              const parsed = parseIngredientQuantity(ingredient);
              quantity = parsed.quantity;
              unit = parsed.unit;
              name = parsed.name;
            } else if (typeof ingredient === 'object' && ingredient.name) {
              // Handle object format: { name: "flour", amount: 2, unit: "cups" }
              quantity = ingredient.amount || 1;
              unit = ingredient.unit || 'pieces';
              name = ingredient.name;
            } else {
              return; // Skip invalid ingredients
            }
            
            const category = categorizeIngredient(name);
            const itemKey = `${name.toLowerCase()}_${unit}`;
            
            if (itemMap.has(itemKey)) {
              // Aggregate quantities
              const existingItem = itemMap.get(itemKey);
              existingItem.quantity += quantity;
            } else {
              // Create new item
              const newItem = {
                id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
                category,
                quantity,
                unit,
                purchased: false,
                notes: `From ${fullRecipe.name}`,
                source: 'meal_plan',
                sourceId: mealPlan.id,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              itemMap.set(itemKey, newItem);
            }
          });
        }
      }
    });
  });
  
  return Array.from(itemMap.values());
};

export const groupItemsByCategory = (items) => {
  const grouped = {};
  
  GROCERY_CATEGORIES.forEach(category => {
    grouped[category] = items.filter(item => item.category === category);
  });
  
  return grouped;
};

export const calculateShoppingProgress = (items) => {
  const total = items.length;
  const purchased = items.filter(item => item.purchased).length;
  return total > 0 ? Math.round((purchased / total) * 100) : 0;
};

export const getShoppingStats = (items) => {
  const total = items.length;
  const purchased = items.filter(item => item.purchased).length;
  const remaining = total - purchased;
  
  return {
    total,
    purchased,
    remaining,
    progress: calculateShoppingProgress(items)
  };
};

// Sample grocery list for testing
export const sampleGroceryList = {
  id: 'grocery_1',
  name: 'Weekly Groceries',
  items: [
    // PRODUCE
    {
      id: 'item_1',
      name: 'Spinach',
      category: 'produce',
      quantity: 2,
      unit: 'bags',
      purchased: false,
      notes: 'Fresh baby spinach',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_2',
      name: 'Tomatoes',
      category: 'produce',
      quantity: 6,
      unit: 'pieces',
      purchased: true,
      notes: 'Roma tomatoes',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_3',
      name: 'Onions',
      category: 'produce',
      quantity: 3,
      unit: 'pieces',
      purchased: false,
      notes: 'Yellow onions',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_4',
      name: 'Avocados',
      category: 'produce',
      quantity: 4,
      unit: 'pieces',
      purchased: false,
      notes: 'Hass avocados',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_5',
      name: 'Bell Peppers',
      category: 'produce',
      quantity: 3,
      unit: 'pieces',
      purchased: false,
      notes: 'Red, yellow, green mix',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // MEAT
    {
      id: 'item_6',
      name: 'Chicken Breast',
      category: 'meat',
      quantity: 2,
      unit: 'lbs',
      purchased: false,
      notes: 'Organic preferred',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_7',
      name: 'Ground Turkey',
      category: 'meat',
      quantity: 1,
      unit: 'lbs',
      purchased: true,
      notes: 'Lean ground turkey',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_8',
      name: 'Salmon Fillet',
      category: 'meat',
      quantity: 1,
      unit: 'lbs',
      purchased: false,
      notes: 'Wild-caught salmon',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // DAIRY
    {
      id: 'item_9',
      name: 'Milk',
      category: 'dairy',
      quantity: 1,
      unit: 'gallons',
      purchased: false,
      notes: '2% milk',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_10',
      name: 'Greek Yogurt',
      category: 'dairy',
      quantity: 2,
      unit: 'containers',
      purchased: true,
      notes: 'Plain Greek yogurt',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_11',
      name: 'Cheddar Cheese',
      category: 'dairy',
      quantity: 1,
      unit: 'blocks',
      purchased: false,
      notes: 'Sharp cheddar',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_12',
      name: 'Eggs',
      category: 'dairy',
      quantity: 1,
      unit: 'dozen',
      purchased: false,
      notes: 'Large eggs',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // PANTRY
    {
      id: 'item_13',
      name: 'Quinoa',
      category: 'pantry',
      quantity: 1,
      unit: 'cups',
      purchased: true,
      notes: 'Organic quinoa',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_14',
      name: 'Brown Rice',
      category: 'pantry',
      quantity: 2,
      unit: 'cups',
      purchased: false,
      notes: 'Long grain brown rice',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_15',
      name: 'Olive Oil',
      category: 'pantry',
      quantity: 1,
      unit: 'bottles',
      purchased: false,
      notes: 'Extra virgin olive oil',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_16',
      name: 'Black Beans',
      category: 'pantry',
      quantity: 2,
      unit: 'cans',
      purchased: false,
      notes: 'Low sodium black beans',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_17',
      name: 'Pasta',
      category: 'pantry',
      quantity: 1,
      unit: 'boxes',
      purchased: true,
      notes: 'Whole wheat pasta',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // FROZEN
    {
      id: 'item_18',
      name: 'Frozen Berries',
      category: 'frozen',
      quantity: 1,
      unit: 'bags',
      purchased: false,
      notes: 'Mixed berries',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_19',
      name: 'Frozen Vegetables',
      category: 'frozen',
      quantity: 2,
      unit: 'bags',
      purchased: false,
      notes: 'Mixed frozen vegetables',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // BAKERY
    {
      id: 'item_20',
      name: 'Whole Wheat Bread',
      category: 'bakery',
      quantity: 1,
      unit: 'loaves',
      purchased: false,
      notes: 'Fresh whole wheat bread',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // BEVERAGES
    {
      id: 'item_21',
      name: 'Orange Juice',
      category: 'beverages',
      quantity: 1,
      unit: 'bottles',
      purchased: true,
      notes: 'Fresh squeezed orange juice',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_22',
      name: 'Green Tea',
      category: 'beverages',
      quantity: 1,
      unit: 'boxes',
      purchased: false,
      notes: 'Organic green tea bags',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // SNACKS
    {
      id: 'item_23',
      name: 'Almonds',
      category: 'snacks',
      quantity: 1,
      unit: 'bags',
      purchased: false,
      notes: 'Raw almonds',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_24',
      name: 'Dark Chocolate',
      category: 'snacks',
      quantity: 1,
      unit: 'bars',
      purchased: true,
      notes: '70% dark chocolate',
      source: 'manual',
      sourceId: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    
    // CONDIMENTS
    {
      id: 'item_25',
      name: 'Balsamic Vinegar',
      category: 'condiments',
      quantity: 1,
      unit: 'bottles',
      purchased: false,
      notes: 'Aged balsamic vinegar',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'item_26',
      name: 'Soy Sauce',
      category: 'condiments',
      quantity: 1,
      unit: 'bottles',
      purchased: false,
      notes: 'Low sodium soy sauce',
      source: 'meal_plan',
      sourceId: 'mealplan_1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};
