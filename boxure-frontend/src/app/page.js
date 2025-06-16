"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl">Loading...</h1>
    </div>
  );
} 