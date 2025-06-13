"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const handleMarket = (e) => {
        navigate('/market');
      }
  return (
    <div className="Home">
      <h1>Welcome to the Home Page!</h1>
      <button onClick={handleMarket}>Market</button>
    </div>
  )
}

export default Home;