"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Log out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        alert("Error logging out. Please try again.");
        return;
      }

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Are you sure you want to log out?</h1>
        <div className="flex space-x-4">
          <Button onClick={handleLogout}>Yes</Button>
          <Button onClick={() => router.back()}>No, take me back</Button>
        </div>
      </div>
    </>
  );
}
