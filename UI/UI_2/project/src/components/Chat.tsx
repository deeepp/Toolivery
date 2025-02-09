import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, X, Loader2, ShoppingBag } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../api/chat';
import { addToCartFromChat } from '../api/cart';


interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, attachments?: File[]) => void;
}

export function Chat({ messages, onSendMessage }: ChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      console.log("Fetching cart items...");
  
      const result = await addToCartFromChat(); // Call API
  
      console.log("Received cart data:", result);
  
      if (result.items.length > 0) {
        // Format response for the chat message
        const itemsList = result.items.map(item => `${item.prodQty}x ${item.prodName}`).join(', ');
        const message = `Added to cart: ${itemsList}`;
        
        onSendMessage(message);
  
        // 🔹 Update App.tsx cartItems state
        //setCartItems(prev => [...prev, ...result.items]); 
      } else {
        onSendMessage("No items to add to the cart.");
      }
    } catch (error) {
      console.error('Failed to add items to cart:', error);
      onSendMessage("Sorry, I couldn't add the items to your cart.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      try {
        setIsUploading(true);
        
        // Send message and attachments in a single request
        await sendChatMessage(newMessage, attachments);
        
        // Update UI
        onSendMessage(newMessage, attachments);
        setNewMessage('');
        setAttachments([]);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Support</h2>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ShoppingBag size={16} />
          )}
          <span className="text-sm">Add to Cart</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{message.content}</p>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm underline"
                    >
                      📎 {attachment.fileName}
                    </a>
                  ))}
                </div>
              )}
              <span className="text-xs opacity-75 block mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="bg-gray-100 rounded px-2 py-1 flex items-center gap-1">
                <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUploading}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isUploading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading || (!newMessage.trim() && attachments.length === 0)}
          >
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}