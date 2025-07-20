'use client'

import React, { useState, useEffect } from 'react';
import ItemsList from './ItemsList';
import Navbar from "@/components/Navbar";
import PriceSummary from './PriceSummary';  

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
      <>
        <Navbar />
        <div className="flex flex-col items-start min-h-screen bg-gray-100">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Shopping Bag</h2>
          <div className="flex w-full max-w-4xl mt-8">
            <div className="w-1/2">
              <ItemsList items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
            </div>
            <div className="w-1/2">
              <PriceSummary items={items} />
            </div>
            {/* You can add a summary or checkout section here on the right if needed */}
          </div>
        </div>
      </>
    )
}

export default ShoppingBagPage;
