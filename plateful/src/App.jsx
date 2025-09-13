import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import { MealPlanProvider } from './context/MealPlanContext';
import { GroceryListProvider } from './context/GroceryListContext';
import Layout from './components/Layout';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import MealPlanner from './pages/MealPlanner';
import GroceryList from './pages/GroceryList';
import './App.css'

function App() {
  return (
    <RecipeProvider>
      <MealPlanProvider>
        <GroceryListProvider>
          <Router>
            <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/recipes" replace />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:recipeId" element={<RecipeDetail />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/grocery-list" element={<GroceryList />} />
            </Routes>
            </Layout>
          </Router>
        </GroceryListProvider>
      </MealPlanProvider>
    </RecipeProvider>
  );
}

export default App;