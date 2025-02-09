import React, { useState } from 'react';
import { Tool, ChatMessage, CartItem } from './types';
import { ToolCard } from './components/ToolCard';
import { Chat } from './components/Chat';
import { Cart } from './components/Cart';
import { Construction, MessageSquare, ShoppingCart as CartIcon, Search, Filter } from 'lucide-react';

// Mock data remains the same as before
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Professional Power Drill',
    description: 'Heavy-duty power drill with variable speed control',
    price: 199.99,
    category: 'Power Tools',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
    available: true,
  },
  {
    id: '2',
    name: 'Concrete Mixer',
    description: 'Electric concrete mixer with 63L capacity',
    price: 599.99,
    category: 'Heavy Equipment',
    imageUrl: 'https://vpsorder.com/wp-content/uploads/2023/09/E4F69145-4556-276F-FC20-E77EBFAF34C1.jpg',
    available: true,
  },
  {
    id: '3',
    name: 'Safety Helmet',
    description: 'OSHA-approved construction safety helmet',
    price: 29.99,
    category: 'Safety Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=3375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    available: true,
  },
  {
    id: '4',
    name: 'Industrial Generator',
    description: '7500W portable generator for construction sites',
    price: 899.99,
    category: 'Power Equipment',
    imageUrl: 'https://images.unsplash.com/photo-1414389754010-8cf70521937b?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    available: true,
  },
  {
    id: '5',
    name: 'Laser Level',
    description: 'Professional laser level with self-leveling',
    price: 149.99,
    category: 'Measuring Tools',
    imageUrl: 'https://media.gettyimages.com/id/1318511849/photo/laser-level-in-the-roof-structure.jpg?s=2048x2048&w=gi&k=20&c=q6VMGCC_KK_b7l22fosYntKduqr7iY1NCEH2BNFOHNI=',
    available: true,
  },
];

const categories = Array.from(new Set(mockTools.map(tool => tool.category)));

function App() {
  const [showChat, setShowChat] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'system',
      receiverId: 'user',
      content: 'Welcome to Toolivery! How can we help you today?',
      timestamp: new Date(),
      isRead: false,
    },
  ]);

  const handleAddToCart = (tool: Tool) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === tool.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === tool.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...tool, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleSendMessage = (content: string, attachments?: File[]) => {
    /**
     * @api {post} /api/chat/messages Send a new message
     * @apiName SendMessage
     * @apiGroup Chat
     * 
     * @apiParam {String} content Message content
     * @apiParam {String} userId User's ID
     * @apiParam {File[]} [attachments] Optional file attachments
     * 
     * @apiSuccess {Object} message Created message object with attachments
     * 
     * @apiParamExample {multipart/form-data} Request-Example:
     *     {
     *       "content": "Hello, I need help with my order",
     *       "userId": "user123",
     *       "attachments": [File1, File2]
     *     }
     * 
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "msg123",
     *       "content": "Hello, I need help with my order",
     *       "senderId": "user123",
     *       "timestamp": "2025-03-20T10:30:00Z",
     *       "attachments": [
     *         {
     *           "id": "att123",
     *           "fileName": "order.pdf",
     *           "fileUrl": "https://example.com/files/order.pdf",
     *           "fileType": "application/pdf",
     *           "fileSize": 1024
     *         }
     *       ]
     *     }
     */
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      receiverId: 'system',
      content,
      timestamp: new Date(),
      isRead: false,
    };
    setMessages([...messages, newMessage]);

    // Simulate automated response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'system',
        receiverId: 'user',
        content: 'Thank you for your message. Our support team will get back to you shortly.',
        timestamp: new Date(),
        isRead: false,
      };
      setMessages((prev) => [...prev, response]);
    }, 300000);
  };

  const filteredTools = mockTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCartItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Construction size={32} />
              <h1 className="text-2xl font-bold">Toolivery</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-2 hover:bg-blue-700 rounded-full"
              >
                <MessageSquare size={24} />
              </button>
              <button
                onClick={() => setShowCart(!showCart)}
                className="p-2 hover:bg-blue-700 rounded-full relative"
              >
                <CartIcon size={24} />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {showChat && (
          <div className="fixed bottom-4 right-4 w-96 z-20">
            <Chat messages={messages} onSendMessage={handleSendMessage} />
          </div>
        )}

        {showCart && (
          <div className="fixed top-24 right-4 w-96 bg-white rounded-lg shadow-lg z-20">
            <Cart
              items={cartItems}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;