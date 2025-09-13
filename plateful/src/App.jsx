import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecipeProvider } from './context/RecipeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import MealPlanner from './pages/MealPlanner';
import GroceryList from './pages/GroceryList';
import './App.css'

function App() {
  return (
    <RecipeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/grocery-list" element={<GroceryList />} />
          </Routes>
        </Layout>
      </Router>
    </RecipeProvider>
  );
}

export default App;