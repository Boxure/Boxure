"use client";
import LoginModal from "@/components/LoginModal";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ItemDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [item, setItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [showLogInModal, setShowLogInModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setItem(data))
      .catch(() => setItem(undefined));
  }, [id]);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); // Store user ID in state
      }
    };
    getUserId();
  }, []);

  const closeModal = () => setShowLogInModal(false);

  const handleAddItem = (item) => {
    if (!userId) {
      setShowLogInModal(true);
      return;
    }
    addToCart(item);
  };

  const addToCart = async (item) => {
    const response = await fetch(`http://localhost:5000/api/cart/${userId}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
      credentials: "include",
    });
    if (response.ok) {
      alert("Item added to cart!");
    } else {
      alert("Failed to add item.");
    }
  };

  return item ? (
    <>
      <div className="App">
        <Navbar className="bg-white shadow-md w-full p-4" />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 24 }}>
            <img
              src={item.image_url || "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"}
              alt={item.name}
              style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", marginBottom: 16, borderRadius: 4 }}
            />
            <h1 style={{ color: "white" }}>{item.name}</h1>
            <p>
              <strong>Description:</strong> {item.description}
            </p>
            <p>
              <strong>Price:</strong> ${item.price}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <br />
            <div className="justify-self-center">
              <Button onClick={handleAddItem}>Add to Cart</Button>
            </div>
          </div>
          <div className="justify-self-center">
            <Button onClick={() => router.push("/market")}>Back to Market</Button>
          </div>
          <LoginModal isOpen={showLogInModal} onClose={closeModal} />
        </div>
      </div>
    </>
  ) : item === null ? (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl">Loading...</h1>
    </div>
  ) : (
    <>
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
        <h2 className="text-2xl mb-4">
          This item may have sold out unfortunately, please keep browsing our Marketplace to find another Item for you!
        </h2>
        <div className="flex space-x-4">
          <Link href="/market">
            <Button>Return to Marketplace</Button>
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
}
