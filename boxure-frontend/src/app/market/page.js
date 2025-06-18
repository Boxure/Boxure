"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

function Market() {
  const router = useRouter();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  const handleHome = (e) => {
    router.push("/home");
  };

  return (
    <div className="Market">
      <h1>Welcome to the Market Place!</h1>
      <button onClick={handleHome}>Home</button>
      <div>
        {items.map(item => (
          <div key={item.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            marginTop: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;
