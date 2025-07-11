'use client';
import React from 'react';

const ItemsList = ({ items, onQuantityChange, onRemove }) => {
  if (!items.length) {
    return (
      <section className="empty-bag">
        <h2>Your bag is empty</h2>
      </section>
    );
  }

  return (
    <section className="bag-items">
      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <div className="item-details">
            <h2>{item.name}</h2>
            <p>Price: {item.price.toFixed(2)}</p>
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onQuantityChange(item.id, e.target.value)}
              />
            </label>
            <button onClick={() => onRemove(item.id)}>Remove</button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ItemsList;
