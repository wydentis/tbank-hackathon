import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import MealPlan from './components/MealPlan';
import Inventory from './components/Inventory';
import ShoppingList from './components/ShoppingList';
import RecipeSuggestions from './components/RecipeSuggestions';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>🍽️ Планировщик питания</h1>
          <ul className="nav-links">
            <li><Link to="/">Рецепты</Link></li>
            <li><Link to="/meal-plan">План питания</Link></li>
            <li><Link to="/inventory">Запасы</Link></li>
            <li><Link to="/shopping-list">Список покупок</Link></li>
            <li><Link to="/suggestions">Подбор рецептов</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipe/new" element={<RecipeForm />} />
            <Route path="/recipe/edit/:id" element={<RecipeForm />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/suggestions" element={<RecipeSuggestions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
