import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export function Cart({ items, onRemove, onUpdateQuantity }: CartProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="p-4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-500 mt-2"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}