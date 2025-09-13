import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import { MealPlanProvider } from './context/MealPlanContext';
import Layout from './components/Layout';
import Recipes from './pages/Recipes';
import MealPlanner from './pages/MealPlanner';
import GroceryList from './pages/GroceryList';
import './App.css'

function App() {
  return (
    <RecipeProvider>
      <MealPlanProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/recipes" replace />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/meal-planner" element={<MealPlanner />} />
              <Route path="/grocery-list" element={<GroceryList />} />
            </Routes>
          </Layout>
        </Router>
      </MealPlanProvider>
    </RecipeProvider>
  );
}

export default App;