// Claude API service for AI meal planning
const PROXY_URL = 'http://localhost:3001/api/claude';

// Demo mode toggle (set to false to use real Claude API)
const DEMO_MODE = true;

// This will be set from environment variable or user input
let CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';

// For demo purposes - replace with your actual API key
// CLAUDE_API_KEY = 'sk-ant-api03-your-actual-key-here';

export const setClaudeApiKey = (apiKey) => {
  CLAUDE_API_KEY = apiKey;
};

export const generateMealPlan = async (preferences, availableRecipes) => {
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key not set. Please set your API key first.');
  }

  console.log('🤖 AI Meal Planning - Starting generation...');
  console.log('📋 User Preferences:', preferences);
  console.log('🍽️ Available Recipes Count:', availableRecipes.length);

  // Prepare recipe data for the AI
  const recipeData = availableRecipes.map(recipe => ({
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    difficulty: recipe.difficulty,
    tags: recipe.tags,
    nutrition: recipe.nutrition
  }));

  console.log('📝 Recipe Data for AI:', recipeData);

  // Create the prompt for Claude
  const prompt = createMealPlanPrompt(preferences, recipeData);
  
  console.log('📤 Full Prompt being sent to Claude:');
  console.log('='.repeat(80));
  console.log(prompt);
  console.log('='.repeat(80));

  try {
    let aiResponse;
    
    if (DEMO_MODE) {
      // For demo purposes, simulate Claude API response
      console.log('🎭 DEMO MODE: Simulating Claude API response...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock meal plan based on preferences
      const mockMealPlan = generateMockMealPlan(preferences, recipeData);
      aiResponse = JSON.stringify(mockMealPlan);
      
      console.log('🎭 Mock AI Response:', aiResponse);
    } else {
      // Real Claude API call through proxy
      console.log('🌐 Making real Claude API call through proxy...');
      
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          apiKey: CLAUDE_API_KEY
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      aiResponse = data.content[0].text;
    }

    console.log('📥 Raw AI Response from Claude:');
    console.log('='.repeat(80));
    console.log(aiResponse);
    console.log('='.repeat(80));

    // Parse the AI response to extract meal plan
    const parsedMealPlan = parseMealPlanResponse(aiResponse, availableRecipes);
    
    console.log('✅ Parsed Meal Plan:');
    console.log(parsedMealPlan);
    
    return parsedMealPlan;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
};

const createMealPlanPrompt = (preferences, recipes) => {
  const {
    dietaryRestrictions,
    eatOutFrequency,
    preferredCuisines,
    mealComplexity,
    specialRequests
  } = preferences;

  return `You are a meal planning assistant. I need you to create a weekly meal plan based on my preferences and available recipes.

**My Preferences:**
- Dietary restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'None'}
- Eat out frequency: ${eatOutFrequency} times per week
- Preferred cuisines: ${preferredCuisines.length > 0 ? preferredCuisines.join(', ') : 'Any'}
- Meal complexity preference: ${mealComplexity}
- Special requests: ${specialRequests || 'None'}

**Available Recipes:**
${recipes.map(recipe => 
  `- ${recipe.name} (${recipe.difficulty}, ${recipe.prepTime + recipe.cookTime} min total, tags: ${recipe.tags.join(', ')})`
).join('\n')}

**Instructions:**
1. Create a meal plan for 7 days (Monday through Sunday)
2. Each day should have breakfast, lunch, and dinner
3. Use ONLY the recipe IDs provided above
4. Based on eat out frequency, mark some meals as "EAT_OUT" instead of assigning recipes
5. Consider my dietary restrictions and preferences
6. Try to balance nutrition throughout the week
7. Avoid repeating the same recipe too often

**Response Format (JSON only, no other text):**
{
  "monday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT", 
    "dinner": "recipe_id_or_EAT_OUT"
  },
  "tuesday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT",
    "dinner": "recipe_id_or_EAT_OUT"
  },
  "wednesday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT",
    "dinner": "recipe_id_or_EAT_OUT"
  },
  "thursday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT",
    "dinner": "recipe_id_or_EAT_OUT"
  },
  "friday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT",
    "dinner": "recipe_id_or_EAT_OUT"
  },
  "saturday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT",
    "dinner": "recipe_id_or_EAT_OUT"
  },
  "sunday": {
    "breakfast": "recipe_id_or_EAT_OUT",
    "lunch": "recipe_id_or_EAT_OUT",
    "dinner": "recipe_id_or_EAT_OUT"
  }
}`;
};

const parseMealPlanResponse = (aiResponse, availableRecipes) => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const mealPlan = JSON.parse(jsonMatch[0]);
    
    // Validate and convert the meal plan to our format
    const convertedMealPlan = {};
    const recipeMap = new Map(availableRecipes.map(r => [r.id, r]));

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const mealTypes = ['breakfast', 'lunch', 'dinner'];

    for (const day of days) {
      if (!mealPlan[day]) continue;
      
      convertedMealPlan[day] = {};
      
      for (const mealType of mealTypes) {
        const mealValue = mealPlan[day][mealType];
        
        if (mealValue === 'EAT_OUT') {
          convertedMealPlan[day][mealType] = {
            recipe: null,
            status: 'eaten_out',
            notes: 'Eat out',
            plannedAt: new Date(),
            completedAt: new Date()
          };
        } else if (mealValue && recipeMap.has(mealValue)) {
          convertedMealPlan[day][mealType] = {
            recipe: recipeMap.get(mealValue),
            status: null,
            notes: '',
            plannedAt: new Date(),
            completedAt: null
          };
        } else {
          // Leave empty if invalid recipe ID
          convertedMealPlan[day][mealType] = {
            recipe: null,
            status: null,
            notes: '',
            plannedAt: null,
            completedAt: null
          };
        }
      }
    }

    return convertedMealPlan;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI meal plan response');
  }
};

// Check if API key is available
export const isApiKeyAvailable = () => {
  return !!CLAUDE_API_KEY;
};

// Mock meal plan generator for demo purposes
const generateMockMealPlan = (preferences, recipes) => {
  const { dietaryRestrictions, eatOutFrequency, preferredCuisines } = preferences;
  
  // Filter recipes based on dietary restrictions
  let filteredRecipes = recipes;
  if (dietaryRestrictions.includes('vegetarian')) {
    filteredRecipes = recipes.filter(recipe => 
      recipe.tags.includes('vegetarian') || 
      recipe.tags.includes('vegan')
    );
  }
  
  // Filter by preferred cuisines if specified
  if (preferredCuisines.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      preferredCuisines.some(cuisine => recipe.tags.includes(cuisine))
    );
  }
  
  console.log('🎭 Filtered recipes for mock:', filteredRecipes.length);
  
  const eatOutCount = parseInt(eatOutFrequency);
  const totalMeals = 21; // 7 days * 3 meals
  const eatOutMeals = Math.min(eatOutCount, totalMeals);
  const cookMeals = totalMeals - eatOutMeals;
  
  // Create meal plan
  const mealPlan = {};
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealTypes = ['breakfast', 'lunch', 'dinner'];
  
  let recipeIndex = 0;
  let eatOutUsed = 0;
  
  days.forEach(day => {
    mealPlan[day] = {};
    mealTypes.forEach(mealType => {
      // Decide if this meal should be "eat out"
      const shouldEatOut = eatOutUsed < eatOutMeals && Math.random() < (eatOutMeals - eatOutUsed) / (totalMeals - (days.indexOf(day) * 3 + mealTypes.indexOf(mealType)));
      
      if (shouldEatOut && eatOutUsed < eatOutMeals) {
        mealPlan[day][mealType] = 'EAT_OUT';
        eatOutUsed++;
      } else if (filteredRecipes.length > 0) {
        // Pick a recipe (cycle through available recipes)
        const recipe = filteredRecipes[recipeIndex % filteredRecipes.length];
        mealPlan[day][mealType] = recipe.id;
        recipeIndex++;
      } else {
        // Fallback to any recipe if no filtered recipes
        const recipe = recipes[recipeIndex % recipes.length];
        mealPlan[day][mealType] = recipe.id;
        recipeIndex++;
      }
    });
  });
  
  return mealPlan;
};