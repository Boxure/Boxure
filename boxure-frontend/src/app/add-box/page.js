"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddBox() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image_url: ""
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to add item');
      const data = await response.json();
      alert('Item added successfully!');
      // Optionally, reset the form:
      setForm({ name: "", description: "", price: "", quantity: "", image_url: "" });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleMarket = () => {
    router.push("/market");
  };

  return (
    <div className="App">
      <Navbar className="bg-white shadow-md w-full p-4" />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Add Box</CardTitle>
            <CardDescription>
              Enter the details below to add a new box item.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="text"
                  value={form.image_url}
                  onChange={handleChange}
                />
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" onClick={handleSubmit} className="w-full">
              Add Item
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 