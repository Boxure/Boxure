"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const QUESTION_MARK_IMG = "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"; // public domain

function Market() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/user/me', { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data.user) {
          setLoggedIn(true);
          setUsername(data.user.username); // store username
        } else {
          setLoggedIn(false);
          setUsername("");
        }
      })
      .catch(() => {
        setLoggedIn(false);
        setUsername("");
      });
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-2">
        Welcome{loggedIn && username ? `, ${username}` : ""} to the{" "}
        <span className="text-indigo-600">Marketplace</span>!
      </h1>
      <p className="text-gray-500 text-lg mb-6">
        Discover unique boxes or share your own creations.
      </p>
        <div ><Button variant="outline" onClick={handleHome}>Home</Button></div>
        {loggedIn ? (
          
          <Button onClick={handleAddBox}>Add Your Own Box</Button>
          
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
    </div>
  );
}

export default Market;
