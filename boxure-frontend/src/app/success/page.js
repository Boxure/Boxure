"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link"; // Import Link for navigation
import { useSearchParams } from "next/navigation";
import React from "next/router";
import { useEffect, useState } from "react";

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no session_id is present, it means the user likely navigated directly or something went wrong
    if (!sessionId) {
      setError("No session ID found. Please return to the homepage or try again.");
      setLoading(false);
      return; // Stop further execution
    }

    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/checkout/session-details?session_id=${sessionId}`)
      .then((res) => {
        if (!res.ok) {
          // Attempt to read error message from server if available
          return res.json().then((errData) => {
            throw new Error(errData.error || "Failed to fetch session details");
          });
        }
        return res.json();
      })
      .then((data) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message || "An unexpected error occurred while verifying your payment.");
        setLoading(false);
      });
  }, [sessionId]); // Depend on session_id so it refetches if ID changes (though unlikely for this page)

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Verifying your payment...</h2>
        <p>Please do not close this page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", border: "1px solid red", color: "red" }}>
        <h2>Payment Verification Error</h2>
        <p>{error}</p>
        <p>
          There was an issue verifying your payment. Please contact support if you believe this is an error, or try
          again.
        </p>
        <Link href="/">Go to Homepage</Link>
      </div>
    );
  }

  // If session is null but no error and not loading, something unexpected happened
  if (!session) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Oops! Something went wrong.</h2>
        <p>We couldn&#39;t retrieve your order details. This might be due to an invalid or expired session ID.</p>
        <Link href="/">Go to Homepage</Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-semibold border-b pb-2 mb-6 text-center">Payment Successful! 🎉</h2>
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          <div className="w-full">
            <p>Thank you for your purchase, **{session.customer_details?.name || "Valued Customer"}**!</p>
            <p>Your order has been placed. You will receive a confirmation email shortly.</p>
            <p>Order Total: **${(session.amount_total / 100).toFixed(2)}**</p>

            {/* Optional: Display more details for the user, perhaps a simple order summary */}
            {/* <div style={{ border: '1px solid #ccc', padding: '15px', margin: '20px auto', maxWidth: '600px', textAlign: 'left' }}>
        <h3>Order Summary</h3>
        <p>Session ID: <code>{session.id}</code></p>
        <p>Customer Email: {session.customer_details?.email}</p>
        <p>Payment Status: {session.payment_status}</p>
      </div> */}
          </div>
          <div className="w-full lg:w-1/3">
            <button
              className="mt-6 w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
              type="link"
              href="/"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
