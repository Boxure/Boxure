"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import ItemsList from "./ItemsList";
import PriceSummary from "./PriceSummary";

const ShoppingBagPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Kirby Box",
      price: 19.99,
      quantity: 2,
      image: "https://us.toybeta.com/cdn/shop/files/baobaobox_1.jpg?v=1716630769",
    },
    { id: 2, name: "Labubu", price: 49.99, quantity: 1 }, // will use default
    {
      id: 3,
      name: "Snoopy Summer Edition",
      price: 89.99,
      quantity: 1,
      image: "https://us.toybeta.com/cdn/shop/files/baobaobox_1.jpg?v=1716630769",
    },
  ]);

  const handleQuantityChange = (id, quantity) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    const items = [
      { productId: 10, quantity: 1 },
      { productId: 11, quantity: 1 },
    ];
    const response = await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/checkout/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const responseData = await response.json();

    if (response.ok) {
      // Redirect to Stripe Checkout
      window.location.href = responseData.url; // Use window.location.href for redirection
    } else {
      // Handle validation errors or other server errors
      console.error("Checkout failed:", responseData.error);
      alert("Checkout failed: " + responseData.error); // Show error to user
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-semibold border-b pb-2 mb-6">Shopping Bag</h2>
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          <div className="w-full lg:w-2/3">
            <ItemsList items={items} onQuantityChange={handleQuantityChange} onRemove={handleRemove} />
          </div>
          <div className="w-full lg:w-1/3">
            <PriceSummary items={items} />
            <button
              className="mt-6 w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
              type="submit"
              onClick={handleCheckout}
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
