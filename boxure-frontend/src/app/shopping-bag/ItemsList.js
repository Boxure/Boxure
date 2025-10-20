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
              <TableCell>${item.price}</TableCell>
              <TableCell>
                <input
                  type="number"
                  min="1"
                  // if availableQuantity exists, expose it as max
                  max={item.availableQuantity ? item.availableQuantity : undefined}
                  // ensure the input always shows a sensible default (1), but allow empty string while editing
                  value={item.quantity === '' ? '' : (typeof item.quantity === 'number' ? item.quantity : 1)}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    // Allow empty string temporarily (when user clears input)
                    if (inputValue === '') {
                      onQuantityChange(item.id, '');
                      return;
                    }

                    const raw = Number(inputValue);
                    // Ignore invalid numbers
                    if (isNaN(raw) || raw < 1) {
                      return;
                    }

                    const max = typeof item.availableQuantity === 'number' ? item.availableQuantity : null;

                    // Clamp to max only if max exists and raw exceeds it
                    if (max !== null && raw > max) {
                      onQuantityChange(item.id, max);
                    } else {
                      onQuantityChange(item.id, raw);
                    }
                  }}
                  onBlur={(e) => {
                    // When user leaves the input, ensure it has a valid value
                    if (e.target.value === '' || Number(e.target.value) < 1) {
                      onQuantityChange(item.id, 1);
                    }
                  }}
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
