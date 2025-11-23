import React, { useState, useEffect } from 'react';
import { shoppingListAPI } from '../api';

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDateFrom(today);
    setDateTo(nextWeek);
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      const response = await shoppingListAPI.getAll();
      setShoppingList(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки списка покупок:', error);
    }
  };

  const handleGenerate = async () => {
    try {
      await shoppingListAPI.generate(dateFrom, dateTo);
      loadShoppingList();
    } catch (error) {
      console.error('Ошибка генерации списка:', error);
    }
  };

  const handleMarkPurchased = async (id) => {
    try {
      await shoppingListAPI.markPurchased(id);
      loadShoppingList();
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  return (
    <div>
      <h2 className="page-title">Генерация списка покупок</h2>
      
      <div className="card">
        <p style={{ marginBottom: '1rem' }}>
          Выберите период для генерации списка покупок на основе плана питания
        </p>
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
        <button className="btn btn-primary" onClick={handleGenerate}>
          🛒 Сгенерировать список покупок
        </button>
      </div>

      {shoppingList.length === 0 ? (
        <div className="card">
          <p>Список покупок пуст. Сгенерируйте список на основе плана питания.</p>
        </div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Список покупок</h3>
          <ul className="shopping-list">
            {shoppingList.map((item) => (
              <li 
                key={item.id} 
                className={`shopping-item ${item.purchased ? 'purchased' : ''}`}
              >
                <div>
                  <strong>{item.ingredient.name}</strong>
                  <div style={{ color: '#7f8c8d' }}>
                    {item.quantity} {item.ingredient.unit}
                  </div>
                </div>
                {!item.purchased && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleMarkPurchased(item.id)}
                  >
                    ✓ Куплено
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShoppingList;
