"""
AI Services FastAPI app — inference endpoints
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from recommendation.engine import engine
from vision.image_similarity import image_search
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SareeAI — AI Inference Service", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"status": "healthy", "service": "sareeai-ai"}


@app.post("/recommend")
def recommend(preferences: dict, top_k: int = 10):
    results = engine.recommend(preferences, top_k=top_k)
    return {"success": True, "data": results}


@app.post("/image-search")
async def image_search_endpoint(file: UploadFile = File(...), top_k: int = 10):
    if file.content_type not in ("image/jpeg", "image/png"):
        raise HTTPException(status_code=400, detail="Only JPEG/PNG accepted")
    contents = await file.read()
    results = image_search.search_by_image(contents, top_k=top_k)
    return {"success": True, "data": [{"product_id": pid, "score": score} for pid, score in results]}
