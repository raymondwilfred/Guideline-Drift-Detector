import os
import sys
from datetime import datetime

# Add root project path to handle imports if run directly
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from data_pipeline.pdf_parser import extract_text_from_pdf
from data_pipeline.data_cleaner import clean_guideline_text
from data_pipeline.guideline_structurer import structure_guideline

from backend.database import SessionLocal, engine, Base
from backend.models import Guideline, GuidelineVersion, DiffRecord
from ai_engine.main import analyze_guideline_drift

Base.metadata.create_all(bind=engine)

def ingest_document(file_path: str, organization: str, title: str, version_label: str, disease_category: str):
    print(f"Ingesting {file_path}...")
    raw_text = extract_text_from_pdf(file_path)
    if not raw_text.strip():
        # Fallback to OCR could go here
        print(f"No text extracted from {file_path}")
        return

    clean_txt = clean_guideline_text(raw_text)
    structured_data = structure_guideline(clean_txt)
    final_text = structured_data["raw_text"]
    
    db = SessionLocal()
    try:
        # Check if guideline exists
        guideline = db.query(Guideline).filter(Guideline.title == title).first()
        if not guideline:
            guideline = Guideline(title=title, organization=organization, disease_category=disease_category)
            db.add(guideline)
            db.commit()
            db.refresh(guideline)
            
        # Get latest version for drift analysis
        latest_version = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == guideline.id).order_by(GuidelineVersion.release_date.desc()).first()
        
        # Add new version
        new_version = GuidelineVersion(
            guideline_id=guideline.id,
            version_label=version_label,
            release_date=datetime.now(),
            raw_text=final_text
        )
        db.add(new_version)
        db.commit()
        db.refresh(new_version)
        
        # Perform drift analysis
        if latest_version:
            print("Detecting semantic drift...")
            drifts = analyze_guideline_drift(latest_version.raw_text, final_text)
            for d in drifts:
                record = DiffRecord(
                    old_version_id=latest_version.id,
                    new_version_id=new_version.id,
                    change_type=d["change_type"],
                    risk_level=d["risk_level"],
                    explanation=d["explanation"],
                    old_text_snippet=d["old_text_snippet"],
                    new_text_snippet=d["new_text_snippet"]
                )
                db.add(record)
            db.commit()
            print(f"Added {len(drifts)} drift records.")
            
    finally:
        db.close()
        
if __name__ == "__main__":
    print("Ingestion script ready.")
    # Example usage:
    # ingest_document("data/raw/guideline_v1.pdf", "WHO", "Diabetes Care", "v1.0", "Endocrinology")
