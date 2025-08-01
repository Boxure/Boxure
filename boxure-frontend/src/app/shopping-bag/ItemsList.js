'use client';
import React from 'react';
// Import shadcn table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ItemsList = ({ items, onQuantityChange, onRemove }) => {
  if (!items.length) {
    return (
      <section className="empty-bag pt-8">
        <h2>Your bag is empty</h2>
      </section>
    );
  }

  return (
    <section className="bag-items">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <img
                  src={item.image || 'https://us.toybeta.com/cdn/shop/files/baobaobox_1.jpg?v=1716630769'}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onQuantityChange(item.id, e.target.value)}
                  className="w-16 border rounded px-2 py-1"
                />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default ItemsList;
