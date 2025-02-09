import { ChatMessage, ChatAttachment } from '../types';

/**
 * @api {post} /api/chat Send a chat message with optional attachments
 * @apiName SendChatMessage
 * @apiGroup Chat
 * 
 * @apiDescription Single endpoint to handle sending messages with or without attachments
 * 
 * @apiParam {Object} data Request data
 * @apiParam {String} data.content Message content (optional if attachments present)
 * @apiParam {File[]} data.attachments File attachments (optional)
 * 
 * @apiSuccess {Object} response Message response object
 * @apiSuccess {String} response.id Message ID
 * @apiSuccess {String} response.content Message content
 * @apiSuccess {String} response.senderId Sender's ID
 * @apiSuccess {String} response.timestamp Message timestamp
 * @apiSuccess {Object[]} [response.attachments] Array of attachment objects
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "msg123",
 *       "content": "Hello, I need help",
 *       "senderId": "user123",
 *       "timestamp": "2025-03-20T10:30:00Z",
 *       "attachments": [
 *         {
 *           "id": "att123",
 *           "fileName": "document.pdf",
 *           "fileUrl": "https://example.com/files/document.pdf",
 *           "fileType": "application/pdf",
 *           "fileSize": 1024
 *         }
 *       ]
 *     }
 */
export async function sendChatMessage(
  content?: string,
  attachments?: File[]
): Promise<ChatMessage> {
  const formData = new FormData();
  
  if (content) {
    formData.append('content', content);
  }
  
  if (attachments?.length) {
    attachments.forEach(file => {
      formData.append('attachments', file);
    });
  }

  const response = await fetch('http://127.0.0.1:8000/api/chat', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}