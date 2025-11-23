import React, { useState } from 'react';
import { shoppingListAPI } from '../api';

function RecipeSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await shoppingListAPI.suggestRecipes();
      setSuggestions(response.data);
    } catch (error) {
      console.error('Ошибка загрузки рекомендаций:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="page-title">Подбор рецептов</h2>
      
      <div className="card">
        <p style={{ marginBottom: '1rem' }}>
          Приложение подберет рецепты, которые можно приготовить из имеющихся продуктов
        </p>
        <button className="btn btn-primary" onClick={loadSuggestions}>
          🔍 Найти подходящие рецепты
        </button>
      </div>

      {loading && <div className="loading">Поиск подходящих рецептов...</div>}

      {!loading && suggestions.length === 0 && (
        <div className="card">
          <p>Нажмите кнопку, чтобы найти рецепты, которые можно приготовить из имеющихся продуктов.</p>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1.5rem' }}>
            Найдено рецептов: {suggestions.length}
          </h3>
          <div className="recipe-grid">
            {suggestions.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                )}
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  
                  <div>
                    <strong>Ингредиенты:</strong>
                    <ul className="ingredient-list">
                      {recipe.ingredients.map((item, index) => (
                        <li key={index}>
                          {item.ingredient.name}: {item.amount} {item.ingredient.unit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
                    <strong>Шаги приготовления:</strong>
                    <p style={{ whiteSpace: 'pre-line', marginTop: '0.5rem' }}>
                      {recipe.cooking_steps}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSuggestions;
