from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from datetime import datetime
from database import Base
from pydantic import BaseModel
from typing import List, Optional

# --- SQLAlchemy DB Models ---
class GuidelineDB(Base):
    __tablename__ = "guidelines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    version = Column(String)
    organization = Column(String)
    published_date = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String)

class DriftRecordDB(Base):
    __tablename__ = "drift_records"

    id = Column(Integer, primary_key=True, index=True)
    baseline_id = Column(Integer)
    updated_id = Column(Integer)
    change_type = Column(String)  # 'threshold_update', 'dosage_change', 'emerging_disease'
    risk_level = Column(String)   # 'Critical', 'Moderate', 'Minor'
    description = Column(Text)
    similarity_score = Column(Float)

# --- Pydantic API Schemas ---
class GuidelineUploadResponse(BaseModel):
    message: str
    guideline_id: int
    title: str

class DriftChangeSchema(BaseModel):
    change_type: str
    risk_level: str
    description: str
    similarity_score: float

class ComparisonResponse(BaseModel):
    baseline_version: str
    updated_version: str
    changes: List[DriftChangeSchema]
    summary: str
