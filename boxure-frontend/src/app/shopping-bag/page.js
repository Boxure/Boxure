'use client'

import React, { useState, useEffect } from 'react';
import ItemsList from './ItemsList';

const ShoppingBagPage = () => {
    const [items, setItems] = useState([{ id: 1, name: 'Kirby Box', price: 19.99, quantity: 2 },
    { id: 2, name: 'Labubu', price: 49.99, quantity: 1 },
    { id: 3, name: 'Snoopy Summer Edition', price: 89.99, quantity: 1 }]);

    const handleQuantityChange = (id, quantity) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const handleRemove = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.07; // Assuming a 7% tax rate
    const total = subtotal + tax;

    return (
        <main className="shopping-bag">
            <h1>Shopping Bag</h1>
            <ItemsList items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
        </main>
    )
}

export default ShoppingBagPage;
