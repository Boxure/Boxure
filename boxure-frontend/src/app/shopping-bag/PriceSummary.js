import React from 'react';

const PriceSummary = ({ items = [], currency = '$' }) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5 : 0; // Example flat shipping rate
    const taxRate = 0.08; // Example 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;

    return (
        <div className="price-summary">
            <h3>Price Summary</h3>
            <div className="summary-row">
                <span>Subtotal:</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
                <span>Shipping:</span>
                <span>{currency}{shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
                <span>Tax:</span>
                <span>{currency}{tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total">
                <span>Total:</span>
                <span>{currency}{total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default PriceSummary;