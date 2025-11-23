import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const recipeAPI = {
  getAll: () => api.get('/recipes/'),
  getOne: (id) => api.get(`/recipes/${id}/`),
  create: (data) => api.post('/recipes/', data),
  update: (id, data) => api.put(`/recipes/${id}/`, data),
  delete: (id) => api.delete(`/recipes/${id}/`),
};

export const ingredientAPI = {
  getAll: () => api.get('/ingredients/'),
  create: (data) => api.post('/ingredients/', data),
  update: (id, data) => api.put(`/ingredients/${id}/`, data),
  delete: (id) => api.delete(`/ingredients/${id}/`),
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory/'),
  update: (data) => api.post('/inventory/update_inventory/', data),
};

export const mealPlanAPI = {
  getAll: (dateFrom, dateTo) => {
    const params = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    return api.get('/meal-plans/', { params });
  },
  create: (data) => api.post('/meal-plans/', data),
  delete: (id) => api.delete(`/meal-plans/${id}/`),
};

export const shoppingListAPI = {
  getAll: () => api.get('/shopping-list/'),
  generate: (dateFrom, dateTo) => 
    api.post('/shopping-list/generate_from_meal_plan/', {
      date_from: dateFrom,
      date_to: dateTo,
    }),
  markPurchased: (id) => api.post(`/shopping-list/${id}/mark_purchased/`),
  suggestRecipes: () => api.get('/shopping-list/suggest_recipes/'),
};

export default api;
