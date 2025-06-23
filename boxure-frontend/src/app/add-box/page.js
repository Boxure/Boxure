"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
    <><div>
          <button onClick={handleMarket}>Market</button>
      </div><div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '320px' }}>
                  <h1>Add Box</h1>
                  <label>
                      Name:
                      <input type="text" name="name" value={form.name} onChange={handleChange} required />
                  </label>
                  <label>
                      Description:
                      <textarea name="description" value={form.description} onChange={handleChange} />
                  </label>
                  <label>
                      Price:
                      <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
                  </label>
                  <label>
                      Quantity:
                      <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
                  </label>
                  <label>
                      Image URL:
                      <input type="text" name="image_url" value={form.image_url} onChange={handleChange} />
                  </label>
                  <button type="submit">Add Item</button>
              </form>
          </div></>
  );
} 