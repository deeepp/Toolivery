export interface Tool {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}

export interface CartItem extends Tool {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface Order {
  id: string;
  userId: string;
  tools: { toolId: string; quantity: number }[];
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered';
  deliveryAddress: string;
  totalAmount: number;
  createdAt: Date;
}