"use client";

//The marketplace page to display all the items available for purchase
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const QUESTION_MARK_IMG = "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"; // public domain

function Market() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/users/me', {credentials: "include"})
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setLoggedIn(!!data.user))
      .catch(() => setLoggedIn(false));
  }, []);

  const handleHome = () => {
    router.push("/home");
  };

  const handleAddBox = () => {
    router.push("/add-box");
  };

  return (
    <div className="Market">
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Market Place!</h1>
        {/* If the user is logged in, show the button to add a box else show a message to log in */}
        {loggedIn ? (
          <Button onClick={handleAddBox}>Add Your Own Box</Button>
        ) : (
          <h2 className="text-lg font-semibold">You must be logged in to add a box.</h2>
        )}
        <div className="grid grid-cols-5 gap-6 mt-8">
          {/* Display the market items */}
          {items.map(item => (
            <div className="cursor-pointer border border-gray-300 rounded-lg p-3 shadow-sm 
              flex flex-col items-center justify-center w-full aspect-square bg-white"
              key={item.id}
              onClick={() => router.push(`/market/${item.id}`)}
            >
              <img
                className="w-3/5 h-3/5 object-cover mb-3 rounded bg-gray-100"
                src={item.image_url || QUESTION_MARK_IMG}
                alt={item.name}
                onError={e => { e.target.src = QUESTION_MARK_IMG; }}
              />
              <h2 className="text-lg text-center m-0 text-black">{item.name}</h2>
              <p className="text-sm text-center m-0 text-black">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Market;
