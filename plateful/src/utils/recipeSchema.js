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
    imageUrl: '',
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
  },
  {
    id: '4',
    name: 'Classic Beef Tacos',
    description: 'Traditional Mexican tacos with seasoned ground beef and fresh toppings',
    imageUrl: '',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { name: 'Ground Beef', amount: 500, unit: 'g', category: 'protein' },
      { name: 'Taco Shells', amount: 8, unit: 'pieces', category: 'grains' },
      { name: 'Lettuce', amount: 2, unit: 'cups', category: 'vegetables' },
      { name: 'Tomatoes', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Cheddar Cheese', amount: 150, unit: 'g', category: 'dairy' },
      { name: 'Sour Cream', amount: 0.5, unit: 'cup', category: 'dairy' },
      { name: 'Taco Seasoning', amount: 1, unit: 'packet', category: 'spices' },
      { name: 'Onion', amount: 1, unit: 'piece', category: 'vegetables' }
    ],
    instructions: [
      'Brown ground beef in a large skillet over medium heat',
      'Add taco seasoning and follow packet instructions',
      'Chop lettuce and dice tomatoes',
      'Grate cheddar cheese',
      'Dice onion',
      'Warm taco shells according to package directions',
      'Fill shells with beef, lettuce, tomatoes, cheese, and onion',
      'Top with sour cream and serve immediately'
    ],
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 32,
      fat: 24,
      fiber: 3
    },
    tags: ['mexican', 'family-friendly', 'quick-meal'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Creamy Mushroom Risotto',
    description: 'Rich and creamy Italian rice dish with wild mushrooms',
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Arborio Rice', amount: 1.5, unit: 'cups', category: 'grains' },
      { name: 'Mixed Mushrooms', amount: 300, unit: 'g', category: 'vegetables' },
      { name: 'Vegetable Broth', amount: 4, unit: 'cups', category: 'spices' },
      { name: 'White Wine', amount: 0.5, unit: 'cup', category: 'spices' },
      { name: 'Parmesan Cheese', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Butter', amount: 3, unit: 'tbsp', category: 'dairy' },
      { name: 'Onion', amount: 1, unit: 'piece', category: 'vegetables' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'spices' },
      { name: 'Fresh Thyme', amount: 2, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Heat vegetable broth in a saucepan and keep warm',
      'Sauté mushrooms in butter until golden, set aside',
      'Sauté diced onion and garlic until translucent',
      'Add rice and stir for 2 minutes until lightly toasted',
      'Add wine and stir until absorbed',
      'Add warm broth one ladle at a time, stirring constantly',
      'Continue until rice is creamy and al dente, about 20 minutes',
      'Stir in mushrooms, parmesan, and fresh thyme',
      'Season with salt and pepper, serve immediately'
    ],
    nutrition: {
      calories: 380,
      protein: 12,
      carbs: 58,
      fat: 12,
      fiber: 2
    },
    tags: ['italian', 'vegetarian', 'comfort-food', 'gluten-free'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta cheese and olives',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { name: 'Cucumber', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Tomatoes', amount: 4, unit: 'pieces', category: 'vegetables' },
      { name: 'Red Onion', amount: 0.5, unit: 'piece', category: 'vegetables' },
      { name: 'Green Bell Pepper', amount: 1, unit: 'piece', category: 'vegetables' },
      { name: 'Kalamata Olives', amount: 0.5, unit: 'cup', category: 'vegetables' },
      { name: 'Feta Cheese', amount: 200, unit: 'g', category: 'dairy' },
      { name: 'Olive Oil', amount: 0.25, unit: 'cup', category: 'fats' },
      { name: 'Red Wine Vinegar', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Oregano', amount: 1, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Cut cucumber into thick slices',
      'Cut tomatoes into wedges',
      'Thinly slice red onion',
      'Cut bell pepper into strips',
      'Crumble feta cheese',
      'Whisk together olive oil, vinegar, and oregano',
      'Combine all vegetables in a large bowl',
      'Add olives and feta cheese',
      'Drizzle with dressing and toss gently',
      'Serve immediately'
    ],
    nutrition: {
      calories: 220,
      protein: 8,
      carbs: 12,
      fat: 16,
      fiber: 3
    },
    tags: ['vegetarian', 'mediterranean', 'healthy', 'gluten-free', 'low-carb'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Honey Garlic Salmon',
    description: 'Pan-seared salmon with sweet and savory honey garlic glaze',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { name: 'Salmon Fillets', amount: 600, unit: 'g', category: 'protein' },
      { name: 'Honey', amount: 3, unit: 'tbsp', category: 'spices' },
      { name: 'Soy Sauce', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Garlic', amount: 4, unit: 'cloves', category: 'spices' },
      { name: 'Ginger', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Lemon Juice', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Sesame Oil', amount: 1, unit: 'tbsp', category: 'fats' },
      { name: 'Green Onions', amount: 2, unit: 'pieces', category: 'vegetables' }
    ],
    instructions: [
      'Pat salmon fillets dry and season with salt and pepper',
      'Mix honey, soy sauce, minced garlic, ginger, and lemon juice',
      'Heat sesame oil in a large skillet over medium-high heat',
      'Cook salmon skin-side up for 4-5 minutes',
      'Flip and cook for 3-4 minutes more',
      'Add honey garlic sauce and cook for 1-2 minutes',
      'Garnish with sliced green onions',
      'Serve with rice or vegetables'
    ],
    nutrition: {
      calories: 280,
      protein: 35,
      carbs: 12,
      fat: 10,
      fiber: 0
    },
    tags: ['seafood', 'healthy', 'high-protein', 'gluten-free', 'low-carb'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'Vegetable Stir Fry',
    description: 'Quick and colorful mix of fresh vegetables in a savory sauce',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { name: 'Broccoli', amount: 300, unit: 'g', category: 'vegetables' },
      { name: 'Carrots', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Bell Peppers', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Snow Peas', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Mushrooms', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Garlic', amount: 3, unit: 'cloves', category: 'spices' },
      { name: 'Ginger', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Soy Sauce', amount: 3, unit: 'tbsp', category: 'spices' },
      { name: 'Sesame Oil', amount: 1, unit: 'tbsp', category: 'fats' }
    ],
    instructions: [
      'Cut all vegetables into bite-sized pieces',
      'Mince garlic and ginger',
      'Heat sesame oil in a large wok or pan',
      'Add garlic and ginger, stir for 30 seconds',
      'Add harder vegetables (carrots, broccoli) first',
      'Cook for 3-4 minutes, stirring frequently',
      'Add remaining vegetables and cook for 2-3 minutes',
      'Add soy sauce and stir for 1 minute',
      'Serve immediately over rice or noodles'
    ],
    nutrition: {
      calories: 120,
      protein: 6,
      carbs: 18,
      fat: 4,
      fiber: 6
    },
    tags: ['vegetarian', 'vegan', 'healthy', 'low-calorie', 'gluten-free'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    name: 'Chicken Caesar Salad',
    description: 'Classic Caesar salad with grilled chicken and homemade croutons',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Chicken Breast', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Romaine Lettuce', amount: 1, unit: 'head', category: 'vegetables' },
      { name: 'Parmesan Cheese', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Bread', amount: 4, unit: 'slices', category: 'grains' },
      { name: 'Anchovies', amount: 4, unit: 'pieces', category: 'protein' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'spices' },
      { name: 'Lemon Juice', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Dijon Mustard', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Olive Oil', amount: 0.25, unit: 'cup', category: 'fats' }
    ],
    instructions: [
      'Season chicken with salt and pepper, grill until cooked through',
      'Let chicken rest, then slice into strips',
      'Cut bread into cubes and toast until golden',
      'Wash and chop romaine lettuce',
      'Make Caesar dressing: blend anchovies, garlic, lemon juice, mustard, and olive oil',
      'Toss lettuce with dressing',
      'Top with chicken, croutons, and grated parmesan',
      'Serve immediately'
    ],
    nutrition: {
      calories: 350,
      protein: 32,
      carbs: 18,
      fat: 18,
      fiber: 3
    },
    tags: ['high-protein', 'classic', 'gluten-free'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    name: 'Beef and Broccoli',
    description: 'Tender beef strips with broccoli in a savory brown sauce',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Beef Sirloin', amount: 500, unit: 'g', category: 'protein' },
      { name: 'Broccoli', amount: 400, unit: 'g', category: 'vegetables' },
      { name: 'Soy Sauce', amount: 3, unit: 'tbsp', category: 'spices' },
      { name: 'Oyster Sauce', amount: 2, unit: 'tbsp', category: 'spices' },
      { name: 'Brown Sugar', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Garlic', amount: 3, unit: 'cloves', category: 'spices' },
      { name: 'Ginger', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Cornstarch', amount: 2, unit: 'tsp', category: 'spices' },
      { name: 'Sesame Oil', amount: 1, unit: 'tbsp', category: 'fats' }
    ],
    instructions: [
      'Slice beef into thin strips against the grain',
      'Cut broccoli into florets',
      'Mix soy sauce, oyster sauce, brown sugar, and cornstarch',
      'Heat sesame oil in a large pan or wok',
      'Cook beef strips until browned, remove and set aside',
      'Add broccoli and cook until tender-crisp',
      'Add minced garlic and ginger, cook for 30 seconds',
      'Return beef to pan and add sauce mixture',
      'Cook until sauce thickens, about 2 minutes',
      'Serve over rice'
    ],
    nutrition: {
      calories: 280,
      protein: 28,
      carbs: 12,
      fat: 14,
      fiber: 3
    },
    tags: ['asian', 'high-protein', 'gluten-free'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
    imageUrl: '',
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { name: 'Pizza Dough', amount: 1, unit: 'ball', category: 'grains' },
      { name: 'Tomato Sauce', amount: 0.5, unit: 'cup', category: 'vegetables' },
      { name: 'Fresh Mozzarella', amount: 200, unit: 'g', category: 'dairy' },
      { name: 'Fresh Basil', amount: 0.5, unit: 'cup', category: 'spices' },
      { name: 'Olive Oil', amount: 2, unit: 'tbsp', category: 'fats' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'spices' },
      { name: 'Salt', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Black Pepper', amount: 0.5, unit: 'tsp', category: 'spices' }
    ],
    instructions: [
      'Preheat oven to 450°F (230°C)',
      'Roll out pizza dough on a floured surface',
      'Mix tomato sauce with minced garlic, salt, and pepper',
      'Spread sauce evenly over dough',
      'Tear mozzarella into pieces and distribute over sauce',
      'Drizzle with olive oil',
      'Bake for 12-15 minutes until crust is golden',
      'Remove from oven and top with fresh basil',
      'Slice and serve immediately'
    ],
    nutrition: {
      calories: 320,
      protein: 16,
      carbs: 42,
      fat: 10,
      fiber: 2
    },
    tags: ['italian', 'vegetarian', 'comfort-food'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '12',
    name: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade chocolate chip cookies',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    ingredients: [
      { name: 'All-Purpose Flour', amount: 2.25, unit: 'cups', category: 'grains' },
      { name: 'Butter', amount: 1, unit: 'cup', category: 'dairy' },
      { name: 'Brown Sugar', amount: 0.75, unit: 'cup', category: 'spices' },
      { name: 'White Sugar', amount: 0.5, unit: 'cup', category: 'spices' },
      { name: 'Eggs', amount: 2, unit: 'pieces', category: 'dairy' },
      { name: 'Vanilla Extract', amount: 2, unit: 'tsp', category: 'spices' },
      { name: 'Baking Soda', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Salt', amount: 1, unit: 'tsp', category: 'spices' },
      { name: 'Chocolate Chips', amount: 2, unit: 'cups', category: 'spices' }
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Cream together butter and both sugars',
      'Beat in eggs one at a time, then vanilla',
      'Mix flour, baking soda, and salt in separate bowl',
      'Gradually add dry ingredients to wet mixture',
      'Fold in chocolate chips',
      'Drop rounded tablespoons onto ungreased baking sheets',
      'Bake for 9-11 minutes until edges are golden',
      'Cool on baking sheet for 2 minutes before removing'
    ],
    nutrition: {
      calories: 180,
      protein: 2,
      carbs: 22,
      fat: 9,
      fiber: 1
    },
    tags: ['dessert', 'baking', 'sweet', 'family-friendly'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '13',
    name: 'Avocado Toast',
    description: 'Simple and healthy breakfast with mashed avocado on toast',
    imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    prepTime: 5,
    cookTime: 5,
    servings: 2,
    difficulty: 'easy',
    ingredients: [
      { name: 'Bread', amount: 4, unit: 'slices', category: 'grains' },
      { name: 'Avocado', amount: 2, unit: 'pieces', category: 'vegetables' },
      { name: 'Lemon Juice', amount: 1, unit: 'tbsp', category: 'spices' },
      { name: 'Salt', amount: 0.5, unit: 'tsp', category: 'spices' },
      { name: 'Black Pepper', amount: 0.25, unit: 'tsp', category: 'spices' },
      { name: 'Red Pepper Flakes', amount: 0.25, unit: 'tsp', category: 'spices' },
      { name: 'Olive Oil', amount: 1, unit: 'tbsp', category: 'fats' }
    ],
    instructions: [
      'Toast bread slices until golden',
      'Cut avocados in half and remove pits',
      'Scoop avocado flesh into a bowl',
      'Mash with lemon juice, salt, and pepper',
      'Spread mashed avocado on toast',
      'Drizzle with olive oil',
      'Sprinkle with red pepper flakes',
      'Serve immediately'
    ],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 28,
      fat: 18,
      fiber: 8
    },
    tags: ['breakfast', 'healthy', 'vegetarian', 'quick-meal', 'gluten-free'],
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
