"use client";
import React from "react";
import { useRouter } from "next/navigation";

function Home() {
  const router = useRouter();

  const handleMarket = () => {
    router.push("/market");
  };

  return (
    <div className="Home">
      <h1>Welcome to the Home Page!</h1>
      <button onClick={handleMarket}>Market</button>
    </div>
  );
}

export default Home;
