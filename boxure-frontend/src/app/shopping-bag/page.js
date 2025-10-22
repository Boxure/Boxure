"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ItemsList from "./ItemsList";
import PriceSummary from "./PriceSummary";

const ShoppingBagPage = () => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); // Store user ID in state
      }
      setLoading(false);
    };
    getUserId();
  }, []);

  useEffect(() => {
    // Fetch items from redis cart database
    const fetchCart = async () => {
      if (!userId) {
        alert("User not logged in.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          // Normalize items coming from Redis: keep any available/stock quantity
          // in `availableQuantity` and set the cart `quantity` to the stored
          // cart value if present, otherwise default to 1 to avoid showing
          // the product's total/stock quantity as the cart quantity.
          const normalized = data.map(it => ({
            ...it,
            // keep the product/stock quantity separate
            availableQuantity: it.quantity ?? it.availableQuantity ?? null,
            // use a cart-specific quantity if present, otherwise default to 1
            quantity: Number(it.cartQuantity ?? 1) || 1,
          }));
          console.debug('fetched cart items:', data, 'normalized:', normalized);
          setItems(normalized); // update items state with normalized data
        } else {
          alert("Failed to fetch cart.");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const handleQuantityChange = (id, quantity) => {
    // Allow empty string to pass through for editing, otherwise convert to number
    const qty = quantity === '' ? '' : (Number(quantity) || 1);
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // Delete items from redis cart
  const handleRemove = async (itemId) => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId: itemId }),
      });

      if (response.ok) {
        // If the server successfully removes the item, update the local state
        setItems((prev) => prev.filter((item) => item.id !== itemId));
      } else {
        alert("Failed to remove item(s) from cart.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
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

  return loading ? (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl">Loading...</h1>
    </div>
  ) : userId ? (
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
  ) : (
    <>
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Please log in to view your shopping bag.</h1>
        <div className="flex space-x-4">
          <Link href="/market">
            <Button>Market</Button>
          </Link>
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ShoppingBagPage;
