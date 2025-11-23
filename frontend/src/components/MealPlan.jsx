import React, { useState, useEffect } from 'react';
import { mealPlanAPI, recipeAPI } from '../api';

function MealPlan() {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    recipe_id: '',
    date: '',
    meal_type: 'breakfast',
    portions: 1,
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDateFrom(today);
    setDateTo(nextWeek);
    loadRecipes();
  }, []);

  useEffect(() => {
    if (dateFrom && dateTo) {
      loadMealPlans();
    }
  }, [dateFrom, dateTo]);

  const loadMealPlans = async () => {
    try {
      const response = await mealPlanAPI.getAll(dateFrom, dateTo);
      setMealPlans(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки плана питания:', error);
    }
  };

  const loadRecipes = async () => {
    try {
      const response = await recipeAPI.getAll();
      setRecipes(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки рецептов:', error);
    }
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    try {
      await mealPlanAPI.create(newMeal);
      setShowModal(false);
      setNewMeal({
        recipe_id: '',
        date: '',
        meal_type: 'breakfast',
        portions: 1,
      });
      loadMealPlans();
    } catch (error) {
      console.error('Ошибка добавления блюда:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить это блюдо из плана?')) {
      try {
        await mealPlanAPI.delete(id);
        loadMealPlans();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: '🌅 Завтрак',
      lunch: '🌞 Обед',
      dinner: '🌙 Ужин',
      snack: '🍎 Перекус',
    };
    return labels[type] || type;
  };

  const groupByDate = () => {
    const grouped = {};
    mealPlans.forEach((meal) => {
      if (!grouped[meal.date]) {
        grouped[meal.date] = {};
      }
      if (!grouped[meal.date][meal.meal_type]) {
        grouped[meal.date][meal.meal_type] = [];
      }
      grouped[meal.date][meal.meal_type].push(meal);
    });
    return grouped;
  };

  const groupedMeals = groupByDate();

  return (
    <div>
      <h2 className="page-title">Планирование меню</h2>
      
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>С даты</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>По дату</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Добавить блюдо в план
        </button>
      </div>

      <div className="meal-plan-calendar">
        {Object.keys(groupedMeals).sort().map((date) => (
          <div key={date} className="day-plan">
            <h3 className="day-header">
              {new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
              groupedMeals[date][mealType] && (
                <div key={mealType} className="meal-slot">
                  <div className="meal-type">{getMealTypeLabel(mealType)}</div>
                  {groupedMeals[date][mealType].map((meal) => (
                    <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 auto', minWidth: '150px' }}>
                        <strong>{meal.recipe.name}</strong> ({meal.portions} порц.)
                      </div>
                      <button 
                        className="btn btn-danger"
                        style={{ flex: '0 0 auto' }}
                        onClick={() => handleDelete(meal.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  ))}
                </div>
              )
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Добавить блюдо в план</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddMeal}>
              <div className="form-group">
                <label>Рецепт*</label>
                <select
                  value={newMeal.recipe_id}
                  onChange={(e) => setNewMeal({ ...newMeal, recipe_id: e.target.value })}
                  required
                >
                  <option value="">Выберите рецепт</option>
                  {recipes.map((recipe) => (
                    <option key={recipe.id} value={recipe.id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Дата*</label>
                <input
                  type="date"
                  value={newMeal.date}
                  onChange={(e) => setNewMeal({ ...newMeal, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Приём пищи*</label>
                <select
                  value={newMeal.meal_type}
                  onChange={(e) => setNewMeal({ ...newMeal, meal_type: e.target.value })}
                  required
                >
                  <option value="breakfast">Завтрак</option>
                  <option value="lunch">Обед</option>
                  <option value="dinner">Ужин</option>
                  <option value="snack">Перекус</option>
                </select>
              </div>
              <div className="form-group">
                <label>Количество порций*</label>
                <input
                  type="number"
                  min="1"
                  value={newMeal.portions}
                  onChange={(e) => setNewMeal({ ...newMeal, portions: e.target.value })}
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-success">
                  Добавить
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlan;
