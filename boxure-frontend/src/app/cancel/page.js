"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Cancel() {
  const router = useRouter();

  const handleHome = () => {
    router.push("/home");
  };

  const handleShopping = () => {
    router.push("/shopping-bag");
  };

  return (
    <>
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-2">Payment Canceled 😞</h1>
        <p className="text-lg mb-6 text-center">
          Your payment was not completed. No charges have been made.
          <br />
          If you intended to complete the purchase, please return to your cart and try again.
          <br />
        </p>
        <div className="pr-14 text-center">
          <Button variant="outline" onClick={handleHome}>
            Continue Shopping
          </Button>

          {" | "}
          <Button variant="outline" onClick={handleShopping}>
            View Cart
          </Button>
        </div>
      </div>
    </>
  );
}
