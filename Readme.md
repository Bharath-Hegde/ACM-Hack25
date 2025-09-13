# App Description

# **Plateful**

Smart meal planning, effortless grocery shopping, healthier you.

---

## **Problem Statement**

Many people struggle to plan balanced meals, shop efficiently, and track their nutrition. Common pain points include:

1. **Time-consuming meal planning** – deciding what to cook each week can be stressful.
2. **Inefficient grocery shopping** – forgetting ingredients or buying excess.
3. **Difficulty tracking nutrition goals** – calories, macros, and dietary balance are hard to monitor.
4. **Inconsistent home-cooked meals** – eating out is convenient but often unhealthy.

Our app solves these problems by combining meal planning, grocery automation, and nutrition tracking into one seamless experience.

---

## **Solution Overview**

**Plateful** helps users:

- Plan meals for the week (manually or via smart suggestions).
- Automatically generate organized grocery lists.
- Track home-cooked meals vs eating out.
- Monitor basic nutrition goals and progress.

All features are designed to save time, reduce food waste, and encourage healthier habits.

---

## **Features and Problem-Solution Mapping**

### **1. Recipes**

**Purpose:** Provides a foundation for meal planning and nutrition tracking.

**Features:**

- Preloaded recipes with ingredients and optional nutrition info.
- Users can add custom recipes.
- ~~Save favorite recipes for easy reuse.~~
- Search/filter by dietary preferences (e.g., vegan, high protein).

**Problem Solved:** Reduces decision fatigue by providing meal options; custom recipes allow personalization.

**UI/UX:**

- Grid or list of recipe cards with image, name, and basic nutrition info.
- ~~“Add to week” button to quickly include in meal plan.~~
- Recipe detail page with ingredients, instructions, and nutrition.

---

### **2. Meal Planner**

**Purpose:** Simplifies weekly meal planning while helping meet nutrition goals.

**Features:**

- Weekly calendar view (Mon–Sun) showing breakfast, lunch, dinner slots.
- Manual assignment of recipes or meals.
- Optional AI suggestions based on user preferences and nutrition goals.
- Check-in for meals eaten at home vs eating out.

**Problem Solved:** Reduces the mental load of planning meals; tracking home-cooked meals encourages healthier habits.

**UI/UX:**

- Calendar view with drag-and-drop assignment OR scroll through recipes and select what you want
- Color-coded meals: green for home-cooked, red for eating out.
- Pop-up AI suggestion modal for unplanned meals.

---

### **3. Grocery List**

**Purpose:** Transforms meal plans into actionable shopping lists.

**Features:**

- Auto-populate grocery list from weekly meal plan recipes.
- Organize by commodity (vegetables, dairy, grains, etc.).
- Mark items as “already have” to avoid duplicates.
- Smart consolidation of quantities across recipes.

**Problem Solved:** Saves time, prevents missed items, reduces food waste.

**UI/UX:**

- Scrollable list grouped by category.
- Checkbox for marking items as bought.
- Swipe to delete or edit quantities.
- Optional: button to export/print list.

---

### **Habit Tracking**

**Purpose:** Visualizes meal patterns and reinforces healthy habits.

**Features:**

- Calendar shows days with home-cooked vs eating out meals.
- Tracks nutrition goal adherence.
- Optional streak counter for consecutive home-cooked days.

**Problem Solved:** Provides motivation and accountability; makes patterns visible.

**UI/UX:**

- Calendar view with icons for meal type and adherence.
- Tap a day to see details of meals and grocery usage.
- Streak badge or progress meter displayed prominently.

---

### **[optional] Nutrition Tracking**

**Purpose:** Helps users monitor adherence to nutrition goals.

**Features:**

- View calories/macros for individual recipes.
- Weekly summary showing total planned vs consumed nutrition.
- Highlight days meeting or missing nutrition targets.

**Problem Solved:** Encourages healthier eating and progress toward personal nutrition goals.

**UI/UX:**

- Nutrition summary bar at top of calendar or dashboard.
- Color-coded progress bars for calories, protein, carbs, fats.
- Alerts or suggestions for unbalanced days.

---

### **[Optional] AI Meal Suggestions**

**Purpose:** Reduces decision fatigue and helps meet nutrition goals.

**Features:**

- Suggest meals based on saved recipes and user preferences.
- Filter suggestions based on dietary goals (high protein, low carb).
- Adjust grocery list accordingly if suggestion accepted.

**Problem Solved:** Saves planning time and nudges users toward healthier choices.

**UI/UX:**

- Modal popup or sidebar with 2–3 meal suggestions.
- “Add to week” button updates meal plan & grocery list instantly.

---

## **User Flow (UI/UX Journey)**

1. **Dashboard / Home:** Weekly summary of planned meals, nutrition progress, and grocery list status.
2. **Meal Planning:** User drags recipes onto calendar; optionally receives AI suggestions
    - User marks meals eaten at home or out; dashboard updates streaks and nutrition metrics.
3. **Grocery List Generation:** Automatically generated from the meal plan; user can check off items.
4. **Recipe Management:** User adds, edits, or favorites recipes for reuse.
5. **Insights:** Visual summary of week—calories, macros, meals cooked at home, streaks