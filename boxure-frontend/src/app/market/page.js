"use client";
import React from "react";
import { useRouter } from "navigation";

function Market() {
  const router = useRouter();

  const handleHome = (e) => {
    router.push("/home");
  };

  return (
    <div className="Market">
      <h1>Welcome to the Market Place!</h1>
      <button onClick={handleHome}>Home</button>
    </div>
  );
}

export default Market;
