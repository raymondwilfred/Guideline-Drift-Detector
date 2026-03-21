from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Guideline, GuidelineVersion, DiffRecord

router = APIRouter()

@router.get("/guidelines")
def list_guidelines(db: Session = Depends(get_db)):
    guidelines = db.query(Guideline).all()
    result = []
    for g in guidelines:
        versions = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == g.id).order_by(GuidelineVersion.release_date.desc()).all()
        result.append({
            "id": g.id, 
            "title": g.title, 
            "organization": g.organization,
            "disease_category": g.disease_category,
            "latest_version": versions[0].version_label if versions else "N/A"
        })
    return result

@router.get("/guidelines/{guideline_id}/diffs")
def get_diffs(guideline_id: int, db: Session = Depends(get_db)):
    versions = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == guideline_id).order_by(GuidelineVersion.release_date.desc()).all()
    if len(versions) < 2:
        return []
        
    new_v = versions[0]
    old_v = versions[1]
    
    diffs = db.query(DiffRecord).filter(
        DiffRecord.new_version_id == new_v.id,
        DiffRecord.old_version_id == old_v.id
    ).all()
    
    return [
        {
            "id": d.id,
            "change_type": d.change_type,
            "risk_level": d.risk_level,
            "explanation": d.explanation,
            "old_text_snippet": d.old_text_snippet,
            "new_text_snippet": d.new_text_snippet
        }
        for d in diffs
    ]

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_guidelines = db.query(Guideline).count()
    total_diffs = db.query(DiffRecord).count()
    critical_changes = db.query(DiffRecord).filter(DiffRecord.risk_level == "Critical").count()
    return {
        "total_guidelines": total_guidelines,
        "total_diffs": total_diffs,
        "critical_changes": critical_changes
    }
