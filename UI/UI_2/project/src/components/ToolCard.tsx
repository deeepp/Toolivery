import React from 'react';
import { Tool } from '../types';
import { ShoppingCart } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onAddToCart: (tool: Tool) => void;
}

export function ToolCard({ tool, onAddToCart }: ToolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={tool.imageUrl}
        alt={tool.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{tool.name}</h3>
        <p className="text-gray-600 mt-1">{tool.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold">${tool.price}</span>
          <button
            onClick={() => onAddToCart(tool)}
            disabled={!tool.available}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              tool.available
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={20} />
            {tool.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}