from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.database import Base

class Guideline(Base):
    __tablename__ = "guidelines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    organization = Column(String)
    disease_category = Column(String)
    
    versions = relationship("GuidelineVersion", back_populates="guideline")

class GuidelineVersion(Base):
    __tablename__ = "guideline_versions"

    id = Column(Integer, primary_key=True, index=True)
    guideline_id = Column(Integer, ForeignKey("guidelines.id"))
    version_label = Column(String)
    release_date = Column(DateTime)
    raw_text = Column(Text)
    
    guideline = relationship("Guideline", back_populates="versions")
    diffs_as_old = relationship("DiffRecord", foreign_keys="[DiffRecord.old_version_id]")
    diffs_as_new = relationship("DiffRecord", foreign_keys="[DiffRecord.new_version_id]")

class DiffRecord(Base):
    __tablename__ = "diff_records"

    id = Column(Integer, primary_key=True, index=True)
    old_version_id = Column(Integer, ForeignKey("guideline_versions.id"))
    new_version_id = Column(Integer, ForeignKey("guideline_versions.id"))
    change_type = Column(String)  # threshold, dosage, screening, emerging
    risk_level = Column(String)   # Critical, Moderate, Minor
    explanation = Column(Text)
    old_text_snippet = Column(Text)
    new_text_snippet = Column(Text)
