'use client';

import React, { useState } from 'react';
import ItemsList from './ItemsList';
import Navbar from '@/components/Navbar';
import PriceSummary from './PriceSummary';

const ShoppingBagPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Kirby Box', price: 19.99, quantity: 2, image: 'https://us.toybeta.com/cdn/shop/files/baobaobox_1.jpg?v=1716630769' },
    { id: 2, name: 'Labubu', price: 49.99, quantity: 1 }, // will use default
    { id: 3, name: 'Snoopy Summer Edition', price: 89.99, quantity: 1, image: 'https://us.toybeta.com/cdn/shop/files/baobaobox_1.jpg?v=1716630769' }
  ]);


  const handleQuantityChange = (id, quantity) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  // Delete items from redis cart
  const handleRemove = async (itemId) => {
      if (!userId) {
        alert('User not logged in.');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}/remove`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ itemId: itemId })
        });

        if (response.ok) {
          // If the server successfully removes the item, update the local state
          setItems(prev => prev.filter(item => item.id !== itemId));
        } else {
          alert('Failed to remove item(s) from cart.');
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-semibold border-b pb-2 mb-6">Shopping Bag</h2>
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          <div className="w-full lg:w-2/3">
            <ItemsList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
            />
          </div>
          <div className="w-full lg:w-1/3">
            <PriceSummary items={items} />
            <button
              className="mt-6 w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
              onClick={() => {
                alert('Proceeding to purchase...');
              }}
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingBagPage;
