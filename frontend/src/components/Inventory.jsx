import React, { useState, useEffect } from 'react';
import { inventoryAPI, ingredientAPI } from '../api';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    loadInventory();
    loadIngredients();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      setInventory(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки запасов:', error);
    }
  };

  const loadIngredients = async () => {
    try {
      const response = await ingredientAPI.getAll();
      setIngredients(response.data.results || response.data);
    } catch (error) {
      console.error('Ошибка загрузки ингредиентов:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await inventoryAPI.update({
        ingredient_id: selectedIngredient,
        quantity: parseFloat(quantity),
      });
      setShowModal(false);
      setSelectedIngredient('');
      setQuantity('');
      loadInventory();
    } catch (error) {
      console.error('Ошибка обновления запасов:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="page-title">Учёт запасов</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Обновить запасы
        </button>
      </div>

      {inventory.length === 0 ? (
        <div className="card">
          <p>Запасы пусты. Добавьте продукты!</p>
        </div>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item) => (
            <div key={item.id} className="inventory-item">
              <div className="inventory-name">{item.ingredient.name}</div>
              <div className="inventory-quantity">
                {item.quantity} {item.ingredient.unit}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.5rem' }}>
                Обновлено: {new Date(item.updated_at).toLocaleDateString('ru-RU')}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Обновить запасы</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Ингредиент*</label>
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  required
                >
                  <option value="">Выберите ингредиент</option>
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Количество*</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="actions">
                <button type="submit" className="btn btn-success">
                  Обновить
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

export default Inventory;
