"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import React from "react";

export default function Cancel() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-semibold border-b pb-2 mb-6 text-center">Payment Canceled 😞</h2>
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          <div className="w-full lg:w-2/3">
            <p>Your payment was not completed. No charges have been made.</p>
            <p>If you intended to complete the purchase, please return to your cart and try again.</p>
          </div>
          <div className="w-full lg:w-1/3">
            <button
              className="mt-6 w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
              type="link"
              href="/"
            >
              Continue Shopping
            </button>

            {" | "}
            <button
              className="mt-6 w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
              type="link"
              href="/"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
