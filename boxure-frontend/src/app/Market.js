"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Market() {
    const navigate = useNavigate();
    const handleHome = (e) => {
        navigate('/home');
      }
  return (
    <div className="Market">
      <h1>Welcome to the Market Place!</h1>
      <button onClick={handleHome}>Home</button>
    </div>
  )
}

export default Market;