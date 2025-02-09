import { CartItem } from '../types';

const API_CONFIG = {
  baseUrl: 'http://127.0.0.1:8000', // Replace with actual API URL
};

/**
 * @api {post} /api/cart/add Add items to cart from chat
 * @apiName AddToCartFromChat
 * @apiGroup Cart
 * 
 * @apiSuccess {Object[]} items Array of items added to cart
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "items": [
 *         {
 *           "prodName": "2x4 Wooden Stud",
 *           "prodQty": 10,
 *           "prodDim": "2 in x 4 in x 8 ft",
 *           "prodSeller": "Lowe's"
 *         }
 *       ]
 *     }
 */
export async function addToCartFromChat(): Promise<{
  items: Array<{
    prodName: string;
    prodQty: number;
    prodDim: string;
    prodSeller: string;
  }>;
}> {
  const response = await fetch('http://127.0.0.1:8000/api/cart/add', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to add items to cart');
  }

  return response.json();
}