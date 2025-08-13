from fastapi import FastAPI, Request
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

MODEL_NAME = "microsoft/DialoGPT-medium"  # <-- Define constant here

app = FastAPI()

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)

class ChatRequest(BaseModel):
    message: str
    history: list[str] = []

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # Prepare input
    input_text = " ".join(req.history[-10:]) + " " + req.message
    input_ids = tokenizer.encode(input_text + tokenizer.eos_token, return_tensors='pt')
    # Generate response
    with torch.no_grad():
        output = model.generate(
            input_ids,
            max_length=1000,
            pad_token_id=tokenizer.eos_token_id,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7,
        )
    response = tokenizer.decode(output[:, input_ids.shape[-1]:][0], skip_special_tokens=True)
    return {"response": response.strip()}

@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL_NAME}  