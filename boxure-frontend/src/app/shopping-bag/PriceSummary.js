import React from 'react';

const PriceSummary = ({ items = [], currency = '$' }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 5 : 0; // Example flat shipping rate
  const taxRate = 0.08; // Example 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="price-summary">
    <h3 className="scroll-m-20 text-2xl text-muted-foreground tracking-tight">
      Price Summary
    </h3>
    <hr className="my-4 border-t border-gray-300" />
    <div className="summary-row flex justify-between">
      <span className="scroll-m-20 text-l tracking-tight">
        Subtotal:
      </span>
      <span className="leading-7 [&:not(:first-child)]:mt-6 text-right">
        {currency}{subtotal.toFixed(2)}
      </span>
    </div>
    <div className="summary-row flex justify-between">
      <span className="scroll-m-20 text-l tracking-tight">
        Shipping:
      </span>
      <span className="leading-7 [&:not(:first-child)]:mt-6 text-right">
        {currency}{shipping.toFixed(2)}
      </span>
    </div>
    <div className="summary-row flex justify-between">
      <span className="scroll-m-20 text-l tracking-tight">
        Tax:
      </span>
      <span className="leading-7 [&:not(:first-child)]:mt-6 text-right">
          {currency}{tax.toFixed(2)}
        </span>
      </div>
      <hr className="my-4 border-t border-gray-300" />
      <div className="summary-row flex justify-between total">
        <span className="scroll-m-20 text-l tracking-tight">
          Total:
        </span>
        <span className="leading-7 [&:not(:first-child)]:mt-6 text-right">
          {currency}{total.toFixed(2)}
        </span>
      </div>
    </div>
   );
  };

export default PriceSummary;