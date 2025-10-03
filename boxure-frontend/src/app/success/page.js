"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import React from "next/router";
import { Suspense, useEffect, useState } from "react";

function ConfirmationDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleHome = () => {
    router.push("/home");
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-4xl font-extrabold text-center mb-2">Verifying your payment...</h2>
        <p className="text-lg mb-6 text-center">Please do not close this page.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-4xl font-extrabold text-center mb-2">Payment Verification Error</h2>
        <p className="text-lg mb-6 text-center">
          {error}
          <br />
          There was an issue verifying your payment. Please contact support if you believe this is an error, or try
          again.
        </p>
        <div>
          <Button variant="outline" onClick={handleHome}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // If session is null but no error and not loading, something unexpected happened
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-4xl font-extrabold text-center mb-2">Oops! Something went wrong.</h2>
        <p className="text-lg mb-6 text-center">
          We couldn&#39;t retrieve your order details. This might be due to an invalid or expired session ID.
        </p>
        <div>
          <Button variant="outline" onClick={handleHome}>
            Continue Shopping
          </Button>{" "}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar className="bg-white shadow-md w-full p-4" />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-4xl font-extrabold text-center mb-2">Payment Successful! 🎉</h2>
        <p className="text-lg mb-6 text-center">
          Thank you for your purchase, {session.customer_details?.name || "Valued Customer"}!<br />
          Your order has been placed. You will receive a confirmation email shortly.
          <br />
          <br />
          Order Total: ${(session.amount_total / 100).toFixed(2)}
          <br />
          Customer Email: {session.customer_details?.email}
          <br />
          Payment Status: {session.payment_status}
          <br />
        </p>
        <div>
          <Button variant="outline" onClick={handleHome}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading confirmation details...</div>}>
      <ConfirmationDetails />
    </Suspense>
  );
}
