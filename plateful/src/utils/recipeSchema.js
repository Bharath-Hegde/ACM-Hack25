// Recipe data schema and validation
export const recipeSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  imageUrl: 'string',
  prepTime: 'number', // in minutes
  cookTime: 'number', // in minutes
  servings: 'number',
  difficulty: 'string', // 'easy', 'medium', 'hard'
  ingredients: [
    {
      name: 'string',
      amount: 'number',
      unit: 'string', // 'cups', 'tbsp', 'tsp', 'oz', 'lbs', 'pieces', etc.
      category: 'string' // 'vegetables', 'dairy', 'grains', 'protein', 'spices', etc.
    }
  ],
  instructions: ['string'],
  nutrition: {
    calories: 'number',
    protein: 'number', // in grams
    carbs: 'number', // in grams
    fat: 'number', // in grams
    fiber: 'number' // in grams
  },
  tags: ['string'], // 'vegetarian', 'vegan', 'gluten-free', 'high-protein', 'low-carb', etc.
  createdAt: 'timestamp',
  updatedAt: 'timestamp'
};

// Sample recipe data for testing
export const sampleRecipes = [
  {
    id: '1',
    name: 'Classic Spaghetti Carbonara',
    description: 'Creamy Italian pasta with eggs, cheese, and pancetta',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Spaghetti', amount: 400, unit: 'g', category: 'grains' },
      { name: 'Pancetta', amount: 150, unit: 'g', category: 'protein' },
      { name: 'Eggs', amount: 4, unit: 'pieces', category: 'dairy' },
      { name: 'Parmesan Cheese', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Black Pepper', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Salt', amount: 1, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Boil water in a large pot and cook spaghetti according to package directions',
      'Cut pancetta into small cubes and cook in a large pan until crispy',
      'Beat eggs in a bowl and mix with grated parmesan cheese',
      'Drain pasta, reserving 1 cup of pasta water',
      'Add hot pasta to the pan with pancetta',
      'Remove from heat and quickly mix in egg mixture, adding pasta water as needed',
      'Season with salt and black pepper, serve immediately'
    ],
    nutrition: {
      calories: 520,
      protein: 28,
      carbs: 45,
      fat: 24,
      fiber: 2
    },
    tags: ['italian', 'comfort-food', 'high-protein'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Mediterranean Quinoa Bowl',
    description: 'Healthy grain bowl with fresh vegetables and herbs',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    difficulty: 'easy',
    ingredients: [
      { name: 'Quinoa', amount: 1, unit: 'cup', category: 'grains' },
      { name: 'Cherry Tomatoes', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Cucumber', amount: 1, unit: 'piece', category: 'vegetables' },
      { name: 'Red Onion', amount: 0.5, unit: 'piece', category: 'vegetables' },
      { name: 'Feta Cheese', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Olive Oil', amount: 3, unit: 'tbsp', category: 'fats' },
      { name: 'Lemon Juice', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Fresh Basil', amount: 0.25, unit: 'cup', category: 'spices' }
    ],
    instructions: [
      'Cook quinoa according to package directions and let cool',
      'Dice cherry tomatoes and cucumber into small pieces',
      'Thinly slice red onion',
      'Crumble feta cheese',
      'Mix olive oil and lemon juice for dressing',
      'Combine all ingredients in a large bowl',
      'Toss with dressing and fresh basil, serve chilled'
    ],
    nutrition: {
      calories: 380,
      protein: 16,
      carbs: 42,
      fat: 18,
      fiber: 6
    },
    tags: ['vegetarian', 'healthy', 'mediterranean', 'gluten-free'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Chicken Teriyaki Stir Fry',
    description: 'Quick and flavorful Asian-inspired chicken with vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    prepTime: 20,
    cookTime: 15,
    servings: 3,
    difficulty: 'easy',
    ingredients: [
      { name: 'Chicken Breast', amount: 500, unit: 'g', category: 'protein' },
      { name: 'Broccoli', amount: 300, unit: 'g', category: 'vegetables' },
      { name: 'Bell Peppers', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Carrots', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Soy Sauce', amount: 3, unit: 'tbsp', category: 'spices' },
      { name: 'Honey', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Garlic', amount: 3, unit: 'cloves', category: 'spices' },
      { name: 'Ginger', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Sesame Oil', amount: 1, unit: 'tbsp', category: 'fats' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Chop broccoli, bell peppers, and carrots',
      'Mince garlic and ginger',
      'Mix soy sauce, honey, garlic, and ginger for teriyaki sauce',
      'Heat sesame oil in a large pan or wok',
      'Cook chicken until golden brown, about 5-7 minutes',
      'Add vegetables and cook until tender-crisp',
      'Pour teriyaki sauce over everything and cook for 2 more minutes',
      'Serve over rice or noodles'
    ],
    nutrition: {
      calories: 320,
      protein: 35,
      carbs: 18,
      fat: 12,
      fiber: 4
    },
    tags: ['asian', 'high-protein', 'quick-meal', 'gluten-free'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions
export const getTotalTime = (recipe) => {
  return recipe.prepTime + recipe.cookTime;
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: 'green',
    medium: 'orange', 
    hard: 'red'
  };
  return colors[difficulty] || 'gray';
};

export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
