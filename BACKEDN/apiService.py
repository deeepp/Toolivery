from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import ollama
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF for PDF processing
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory storage for shopping items
shopping_list = []

# Directory to store uploaded files temporarily
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# System prompt to guide LLaMA
SYSTEM_PROMPT = """\
You are a specialized assistant that extracts shopping items from a user’s message or a document.
The user might request multiple items in free-text or an attached file (e.g., a PDF list).
 
YOUR GOAL:
1. Identify and parse each requested item.
2. Extract the following fields:
   - prodName: The product’s name (string).
   - prodQty: The quantity (integer). If unspecified, assume 1.
   - prodDim: Dimensions or size (string). If not given, leave blank.
   - prodSeller: The store or seller (string). If unspecified, leave blank.

OUTPUT FORMAT:
Return ONLY valid JSON — an array of objects. Example:
[
  { "prodName": "nails", "prodQty": 2, "prodDim": "", "prodSeller": "" },
  { "prodName": "hammer", "prodQty": 1, "prodDim": "", "prodSeller": "" }
]

Do not include any additional text or explanation outside the JSON.
"""

class ChatMessageResponse(BaseModel):
    id: str
    content: Optional[str] = None
    senderId: str
    timestamp: str
    attachments: Optional[List[dict]] = []

@app.post("/api/chat")
async def chat(
    content: Optional[str] = Form(None),
    attachments: List[UploadFile] = File(None)
):
    """
    Handles chat messages, with or without attachments (like PDFs).
    Uses LLaMA to extract shopping items from the message or document.
    """
    global shopping_list
    extracted_text = ""
    print("Got an request")

    # Process file attachments (if any)
    file_data = []
    if attachments:
        for file in attachments:
            file_path = f"{UPLOAD_DIR}/{file.filename}"
            with open(file_path, "wb") as f:
                f.write(await file.read())  # Save the file locally
            file_data.append({
                "id": file.filename,
                "fileName": file.filename,
                "fileUrl": f"/uploads/{file.filename}",
                "fileType": file.content_type,
                "fileSize": os.path.getsize(file_path),
            })

            # If it's a PDF, extract text
            if file.content_type == "application/pdf":
                extracted_text += extract_text_from_pdf(file_path) + "\n"

    # Create LLaMA input with extracted text (if any)
    llama_input = content if content else ""
    if extracted_text:
        llama_input += f"\nExtracted from document:\n{extracted_text}"

    # Send request to LLaMA model
    parsed_items = []
    if llama_input.strip():
        response = ollama.chat(
            model="llama3-groq-tool-use:8b",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": llama_input}
            ]
        )

        raw_response = response["message"]["content"]

        # Try parsing JSON response from LLaMA
        try:
            parsed_items = json.loads(raw_response)
        except json.JSONDecodeError:
            parsed_items = []

    # Store extracted items
    shopping_list.extend(parsed_items)

    return {
        "id": "msg123",
        "content": content,
        "senderId": "user123",
        "timestamp": "2025-03-20T10:30:00Z",
        "attachments": file_data,
        "parsedItems": parsed_items
    }

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text from a given PDF file."""
    doc = fitz.open(file_path)
    text = "\n".join([page.get_text("text") for page in doc])
    return text

@app.get("/api/cart/add")
async def add_to_cart():
    """
    Returns all stored items in the cart and clears the list.
    """
    global shopping_list
    cart_items = shopping_list.copy()
    shopping_list.clear()  # Clear after returning
    return {"items": cart_items}