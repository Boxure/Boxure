"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

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
    fetch('http://localhost:5000/api/me', {credentials: "include"})
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
      <h1>Welcome to the Market Place!</h1>
      <button onClick={handleHome}>Home</button>
      {loggedIn ? (
        <button onClick={handleAddBox}>Add Your Own Box</button>
      ) : (
        <p>You must be logged in to add a box.</p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "24px",
          marginTop: "32px"
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => router.push(`/market/${item.id}`)}
            style={{
              cursor: "pointer",
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              aspectRatio: '1 / 1',
              width: '100%',
              justifyContent: 'center',
              background: '#fff'
            }}
          >
            <img
              src={item.image_url || QUESTION_MARK_IMG}
              alt={item.name}
              style={{
                width: '60%',
                height: '60%',
                objectFit: 'cover',
                marginBottom: '12px',
                borderRadius: '4px',
                background: '#f0f0f0'
              }}
              onError={e => { e.target.src = QUESTION_MARK_IMG; }}
            />
            <h2 style={{ fontSize: '1.1rem', textAlign: 'center', margin: 0, color: '#000' }}>{item.name}</h2>
            <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: 0, color: '#000' }}>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Market;
