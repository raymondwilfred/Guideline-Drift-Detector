from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os

from database import get_db
from models import GuidelineUploadResponse, ComparisonResponse, GuidelineDB
from config import settings
from vector_search import detect_semantic_drift

router = APIRouter()

@router.post("/upload", response_model=GuidelineUploadResponse)
async def upload_guideline(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Uploads a PDF medical guideline to the system."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
        
    new_guideline = GuidelineDB(
        title=file.filename,
        version="v1.0",
        organization="WHO", # Default mock
        file_path=file_path
    )
    db.add(new_guideline)
    db.commit()
    db.refresh(new_guideline)
    
    return {
        "message": "File uploaded successfully.",
        "guideline_id": new_guideline.id,
        "title": new_guideline.title
    }

@router.post("/compare", response_model=ComparisonResponse)
async def compare_guidelines(
    baseline_id: int, 
    updated_id: int, 
    db: Session = Depends(get_db)
):
    """
    Compares two guidelines by their IDs and detects semantic drift.
    """
    baseline = db.query(GuidelineDB).filter(GuidelineDB.id == baseline_id).first()
    updated = db.query(GuidelineDB).filter(GuidelineDB.id == updated_id).first()
    
    if not baseline or not updated:
        raise HTTPException(status_code=404, detail="One or both guidelines not found.")
    
    # Process for semantic drift (using vector_search logic)
    changes = detect_semantic_drift(baseline.file_path, updated.file_path)
    
    return {
        "baseline_version": baseline.title,
        "updated_version": updated.title,
        "changes": changes,
        "summary": f"Detected {len(changes)} clinically meaningful change(s) between {baseline.title} and {updated.title}."
    }
