"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Log out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
        return;
      }

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    }
  };

  return (
    <div>
      <h2>Are you sure you want to log out?</h2>
      <button onClick={handleLogout}>Yes</button>
      <button onClick={() => router.back()}>Cancel</button>
    </div>
  );
}