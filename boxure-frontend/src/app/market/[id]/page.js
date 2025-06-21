"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ItemDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/items/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setItem(data))
      .catch(() => setItem(undefined));
  }, [id]);

  if (item === null) return <div>Loading...</div>;
  if (item === undefined) return <div>Item not found.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <img
        src={item.image_url || "https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg"}
        alt={item.name}
        style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", marginBottom: 16, borderRadius: 4 }}
      />
      <h1 style={{ color: "#000" }}>{item.name}</h1>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <p><strong>Quantity:</strong> {item.quantity}</p>
      <button onClick={() => router.push("/market")}>Back to Market</button>
    </div>
  );
}
