# Plateful MVP Development Plan - 24 Hour Hackathon

## **Phase 1: Project Setup & Foundation (2-3 hours)**

### 1.1 Project Initialization
- [ ] **Task 1.1.1**: Create React app with Vite
  - Command: `npm create vite@latest plateful -- --template react`
  - Test: Verify app runs with `npm run dev`
- [ ] **Task 1.1.2**: Install dependencies
  - Install: `npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers firebase react-router-dom`
  - Test: Check `package.json` for all dependencies
- [ ] **Task 1.1.3**: Setup TailwindCSS
  - Install: `npm install -D tailwindcss postcss autoprefixer`
  - Initialize: `npx tailwindcss init -p`
  - Test: Add test class to App.jsx and verify styling works

### 1.2 Firebase Setup
- [ ] **Task 1.2.1**: Create Firebase project
  - Create project at https://console.firebase.google.com
  - Enable Firestore Database
  - Enable Authentication (Email/Password)
- [ ] **Task 1.2.2**: Configure Firebase in React app
  - Create `src/firebase/config.js`
  - Add Firebase config object
  - Test: Import and console.log Firebase app instance
- [ ] **Task 1.2.3**: Setup Firestore collections structure
  - Create collections: `recipes`, `mealPlans`, `users`
  - Test: Write test document to each collection

### 1.3 Basic App Structure
- [ ] **Task 1.3.1**: Create folder structure
  - Create folders: `components`, `pages`, `context`, `utils`, `hooks`
  - Test: Verify folder structure exists
- [ ] **Task 1.3.2**: Setup routing
  - Install react-router-dom
  - Create basic routes: `/`, `/recipes`, `/meal-planner`, `/grocery-list`
  - Test: Navigate between routes and verify URL changes
- [ ] **Task 1.3.3**: Create basic layout component
  - Create `components/Layout.jsx` with navigation
  - Test: Verify navigation renders and links work

---

## **Phase 2: Recipe Management System (4-5 hours)**

### 2.1 Recipe Data Model
- [ ] **Task 2.1.1**: Define recipe schema
  - Create `utils/recipeSchema.js` with recipe structure
  - Fields: id, name, description, ingredients[], instructions[], nutrition{}, imageUrl, tags[]
  - Test: Create sample recipe object and validate structure
- [ ] **Task 2.1.2**: Create recipe context
  - Create `context/RecipeContext.jsx` with CRUD operations
  - Test: Console.log context values in a component

### 2.2 Recipe List Component
- [ ] **Task 2.2.1**: Create RecipeCard component
  - Display: name, image, prep time, difficulty
  - Test: Render with sample data, verify styling
- [ ] **Task 2.2.2**: Create RecipeList component
  - Grid layout with RecipeCard components
  - Test: Display 3-5 sample recipes
- [ ] **Task 2.2.3**: Add search/filter functionality
  - Search by name, filter by tags (vegetarian, high-protein, etc.)
  - Test: Search for "pasta" and verify results filter

### 2.3 Recipe Detail Component
- [ ] **Task 2.3.1**: Create RecipeDetail component
  - Display: full recipe info, ingredients list, instructions
  - Test: Click recipe card, verify detail page loads with correct data
- [ ] **Task 2.3.2**: Add "Add to Meal Plan" button
  - Button should be functional (no backend yet)
  - Test: Click button, verify console.log or alert shows

### 2.4 Recipe Management
- [ ] **Task 2.4.1**: Create AddRecipe component
  - Form with all recipe fields
  - Test: Fill form, submit, verify form data logged to console
- [ ] **Task 2.4.2**: Connect to Firebase
  - Save recipes to Firestore
  - Test: Add recipe, verify it appears in Firebase console
- [ ] **Task 2.4.3**: Load recipes from Firebase
  - Fetch recipes on component mount
  - Test: Refresh page, verify recipes load from database

---

## **Phase 3: Meal Planning System (5-6 hours)**

### 3.1 Meal Plan Data Model
- [ ] **Task 3.1.1**: Define meal plan schema
  - Create `utils/mealPlanSchema.js`
  - Structure: { week: date, meals: { [day]: { breakfast, lunch, dinner } } }
  - Test: Create sample meal plan object
- [ ] **Task 3.1.2**: Create meal plan context
  - Create `context/MealPlanContext.jsx`
  - Test: Console.log context values

### 3.2 Weekly Calendar Component
- [ ] **Task 3.2.1**: Create WeekCalendar component
  - Display 7 days (Mon-Sun) with meal slots
  - Test: Render calendar with empty meal slots
- [ ] **Task 3.2.2**: Add drag-and-drop functionality
  - Use react-beautiful-dnd or similar
  - Test: Drag recipe card to meal slot, verify it appears
- [ ] **Task 3.2.3**: Add meal assignment UI
  - Click meal slot to open recipe selection modal
  - Test: Click meal slot, verify modal opens with recipe list

### 3.3 Meal Plan Management
- [ ] **Task 3.3.1**: Save meal plan to Firebase
  - Save weekly meal plan to Firestore
  - Test: Assign meals, save, verify data in Firebase console
- [ ] **Task 3.3.2**: Load existing meal plan
  - Fetch current week's meal plan on load
  - Test: Refresh page, verify meal assignments persist
- [ ] **Task 3.3.3**: Add meal status tracking
  - Track "cooked at home" vs "ate out"
  - Test: Mark meals as cooked/eaten out, verify status updates

---

## **Phase 4: Grocery List Generation (3-4 hours)**

### 4.1 Grocery List Logic
- [ ] **Task 4.1.1**: Create ingredient aggregation function
  - Function to combine ingredients from all planned meals
  - Test: Pass sample meal plan, verify ingredients are combined
- [ ] **Task 4.1.2**: Create grocery list context
  - Create `context/GroceryListContext.jsx`
  - Test: Console.log context values

### 4.2 Grocery List Component
- [ ] **Task 4.2.1**: Create GroceryList component
  - Display ingredients grouped by category (vegetables, dairy, etc.)
  - Test: Display sample grocery list with categories
- [ ] **Task 4.2.2**: Add check-off functionality
  - Checkbox for each grocery item
  - Test: Check items, verify they get crossed out
- [ ] **Task 4.2.3**: Add quantity management
  - Show quantities and allow editing
  - Test: Edit quantities, verify changes persist

### 4.3 Auto-generation
- [ ] **Task 4.3.1**: Auto-generate from meal plan
  - Generate grocery list when meal plan changes
  - Test: Add meal to plan, verify grocery list updates
- [ ] **Task 4.3.2**: Save grocery list to Firebase
  - Persist grocery list state
  - Test: Refresh page, verify grocery list persists

---

## **Phase 5: Dashboard & Analytics (2-3 hours)**

### 5.1 Dashboard Overview
- [ ] **Task 5.1.1**: Create Dashboard component
  - Show weekly summary, meal plan preview, grocery list status
  - Test: Display dashboard with sample data
- [ ] **Task 5.1.2**: Add habit tracking
  - Show streak of home-cooked meals
  - Test: Mark meals as cooked, verify streak updates
- [ ] **Task 5.1.3**: Add nutrition summary
  - Show basic nutrition totals for the week
  - Test: Add meals with nutrition data, verify totals calculate

### 5.2 Data Visualization
- [ ] **Task 5.2.1**: Create simple charts
  - Use Chart.js or similar for nutrition charts
  - Test: Display sample chart with meal data
- [ ] **Task 5.2.2**: Add weekly insights
  - Show patterns, suggestions, achievements
  - Test: Display insights based on meal plan data

---

## **Phase 6: Polish & Deployment (2-3 hours)**

### 6.1 UI/UX Polish
- [ ] **Task 6.1.1**: Responsive design
  - Ensure app works on mobile and desktop
  - Test: Resize browser, verify layout adapts
- [ ] **Task 6.1.2**: Loading states
  - Add loading spinners for async operations
  - Test: Verify loading states show during data fetching
- [ ] **Task 6.1.3**: Error handling
  - Add error boundaries and user-friendly error messages
  - Test: Simulate network error, verify error message shows

### 6.2 Performance & Testing
- [ ] **Task 6.2.1**: Basic testing
  - Test all major user flows manually
  - Test: Complete flow from adding recipe to generating grocery list
- [ ] **Task 6.2.2**: Code cleanup
  - Remove console.logs, unused imports
  - Test: Verify app still works after cleanup

### 6.3 Deployment
- [ ] **Task 6.3.1**: Build for production
  - Run `npm run build`
  - Test: Verify build completes without errors
- [ ] **Task 6.3.2**: Deploy to Firebase Hosting
  - Deploy using Firebase CLI
  - Test: Verify app is accessible via public URL
- [ ] **Task 6.3.3**: Final testing
  - Test all features on deployed app
  - Test: Complete user journey on live app

---

## **Optional Features (if time permits)**

### Bonus Features
- [ ] **Task B.1**: AI meal suggestions
  - Simple algorithm for meal recommendations
- [ ] **Task B.2**: Recipe import from URLs
  - Basic web scraping for recipe data
- [ ] **Task B.3**: Export grocery list
  - PDF or text export functionality
- [ ] **Task B.4**: Social features
  - Share meal plans or recipes

---

## **Testing Checklist for Each Phase**

### After Phase 1:
- [ ] App runs without errors
- [ ] Firebase connection works
- [ ] Basic routing functions

### After Phase 2:
- [ ] Can add recipes
- [ ] Can view recipe list
- [ ] Can search/filter recipes
- [ ] Data persists in Firebase

### After Phase 3:
- [ ] Can create meal plan
- [ ] Can assign recipes to meals
- [ ] Can track meal status
- [ ] Meal plan persists

### After Phase 4:
- [ ] Grocery list auto-generates
- [ ] Can check off items
- [ ] Can edit quantities
- [ ] List persists

### After Phase 5:
- [ ] Dashboard shows correct data
- [ ] Analytics update in real-time
- [ ] All features work together

### After Phase 6:
- [ ] App is deployed and accessible
- [ ] All features work on live app
- [ ] Performance is acceptable

---

## **Time Estimates**
- **Phase 1**: 2-3 hours
- **Phase 2**: 4-5 hours  
- **Phase 3**: 5-6 hours
- **Phase 4**: 3-4 hours
- **Phase 5**: 2-3 hours
- **Phase 6**: 2-3 hours
- **Total**: 18-24 hours

## **Critical Path**
1. Project setup → Recipe system → Meal planning → Grocery list → Dashboard → Deploy
2. Each phase builds on the previous one
3. Test thoroughly after each phase before moving on
4. Focus on core features first, add polish later

---

*Use this checklist to track progress and ensure each feature is working before moving to the next phase.*
