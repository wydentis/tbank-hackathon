import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import MealPlan from './components/MealPlan';
import Inventory from './components/Inventory';
import ShoppingList from './components/ShoppingList';
import RecipeSuggestions from './components/RecipeSuggestions';
import Login from './components/Login';
import { authAPI } from './api';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('access_token');
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <nav className="navbar">
            <h1>🍽️ Планировщик питания</h1>
            <ul className="nav-links">
              <li><Link to="/">Рецепты</Link></li>
              <li><Link to="/meal-plan">План питания</Link></li>
              <li><Link to="/inventory">Запасы</Link></li>
              <li><Link to="/shopping-list">Список покупок</Link></li>
              <li><Link to="/suggestions">Подбор рецептов</Link></li>
              <li><button onClick={handleLogout} className="logout-btn">Выйти</button></li>
            </ul>
          </nav>
        )}

        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><RecipeList /></PrivateRoute>} />
            <Route path="/recipe/new" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
            <Route path="/recipe/edit/:id" element={<PrivateRoute><RecipeForm /></PrivateRoute>} />
            <Route path="/meal-plan" element={<PrivateRoute><MealPlan /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/shopping-list" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />
            <Route path="/suggestions" element={<PrivateRoute><RecipeSuggestions /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
