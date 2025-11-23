import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeAPI, ingredientAPI } from '../api';

function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cooking_steps: '',
    image: '',
    ingredients_data: [],
  });

  useEffect(() => {
    loadIngredients();
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadIngredients = async () => {
    try {
      const response = await ingredientAPI.getAll();
      setIngredients(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки ингредиентов:', error);
    }
  };

  const loadRecipe = async () => {
    try {
      const response = await recipeAPI.getOne(id);
      const recipe = response.data;
      setFormData({
        name: recipe.name,
        description: recipe.description,
        cooking_steps: recipe.cooking_steps,
        image: recipe.image || '',
        ingredients_data: recipe.ingredients.map(item => ({
          ingredient_id: item.ingredient.id,
          amount: item.amount,
        })),
      });
    } catch (error) {
      console.error('Ошибка загрузки рецепта:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await recipeAPI.update(id, formData);
      } else {
        await recipeAPI.create(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Ошибка сохранения рецепта:', error);
      alert('Ошибка при сохранении рецепта');
    }
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients_data: [...formData.ingredients_data, { ingredient_id: '', amount: '' }],
    });
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients_data];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients_data: newIngredients });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients_data.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients_data: newIngredients });
  };

  return (
    <div>
      <h2 className="page-title">{id ? 'Редактировать рецепт' : 'Новый рецепт'}</h2>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Название рецепта*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Шаги приготовления*</label>
          <textarea
            value={formData.cooking_steps}
            onChange={(e) => setFormData({ ...formData, cooking_steps: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>URL изображения</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Ингредиенты</label>
          {formData.ingredients_data.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={item.ingredient_id}
                onChange={(e) => updateIngredient(index, 'ingredient_id', e.target.value)}
                style={{ flex: '2 1 200px', minWidth: '200px' }}
                required
              >
                <option value="">Выберите ингредиент</option>
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>
                    {ing.name} ({ing.unit})
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={item.amount}
                onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                placeholder="Количество"
                style={{ flex: '1 1 100px', minWidth: '100px' }}
                required
              />
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => removeIngredient(index)}
                style={{ flex: '0 1 auto' }}
              >
                Удалить
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addIngredient}>
            + Добавить ингредиент
          </button>
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-success">
            {id ? 'Сохранить' : 'Создать'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
