"use client";
// The home page of the application, displaying a welcome message and navigation options

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
      fetch('http://localhost:5000/api/users/me', {credentials: "include"})
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => setLoggedIn(!!data.user))
        .catch(() => setLoggedIn(false));
  }, []);

  const router = useRouter();

  const handleMarket = () => {
    router.push("/market");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };
  return (
    <div>
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-5xl font-bold mb-4">Welcome to Boxure! </h1>
        <p className="text-xl mb-6">A place to sell and buy blind box pulls.</p>
        <div className="flex space-x-4">
          {loggedIn ? (
            <>
              <Button onClick={handleMarket}>Market</Button>
            </>
          ) : (
            <>
              <Button onClick={handleLogin}>Login</Button>
              <Button onClick={handleRegister}>Register</Button>
            </>
          )}
        </div>
      </div>
    </div>

  );
}


export default Home;
