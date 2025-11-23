import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeAPI } from '../api';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      const response = await recipeAPI.getAll();
      setRecipes(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки рецептов:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить этот рецепт?')) {
      try {
        await recipeAPI.delete(id);
        loadRecipes();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка рецептов...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="page-title">Каталог рецептов</h2>
        <button className="btn btn-primary" onClick={() => navigate('/recipe/new')}>
          + Добавить рецепт
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="card">
          <p>Пока нет рецептов. Добавьте первый рецепт!</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              {recipe.image && (
                <img src={recipe.image} alt={recipe.name} className="recipe-image" />
              )}
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.name}</h3>
                <p className="recipe-description">{recipe.description}</p>
                
                {recipe.ingredients && recipe.ingredients.length > 0 && (
                  <div>
                    <strong>Ингредиенты:</strong>
                    <ul className="ingredient-list">
                      {recipe.ingredients.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          {item.ingredient.name}: {item.amount} {item.ingredient.unit}
                        </li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li>... и еще {recipe.ingredients.length - 3}</li>
                      )}
                    </ul>
                  </div>
                )}
                
                <div className="actions">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(recipe.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
