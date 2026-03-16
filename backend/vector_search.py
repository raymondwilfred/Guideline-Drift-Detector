import random
import logging
from typing import List

logger = logging.getLogger(__name__)

def mock_vector_search(baseline_text: str, updated_text: str) -> List[dict]:
    """Mocks vector similarity search and identifies semantic drift."""
    
    # Example categorized changes relevant to Medical Guidelines
    change_pool = [
        {
            "change_type": "threshold_update",
            "risk_level": "Critical",
            "description": "Blood pressure target lowered from 140/90 mmHg to 130/80 mmHg for high-risk patients.",
            "similarity_score": 0.82
        },
        {
            "change_type": "dosage_change",
            "risk_level": "Moderate",
            "description": "Recommended starting dose of Metformin increased to 1000mg per day.",
            "similarity_score": 0.77
        },
        {
            "change_type": "emerging_disease",
            "risk_level": "Critical",
            "description": "New section added detailing guidelines for managing suspected cases of novel respiratory virus XYZ.",
            "similarity_score": 0.55
        },
        {
            "change_type": "procedural_adjustment",
            "risk_level": "Minor",
            "description": "Routine screening age for procedure A decreased from 55 to 50 years.",
            "similarity_score": 0.88
        }
    ]
    
    # Mocking actual detection by returning random meaningful changes
    detected_changes = random.sample(change_pool, k=random.randint(1, 4))
    return detected_changes

def extract_text_from_pdf(file_path: str) -> str:
    """Mock extracting text from PDF."""
    logger.info(f"Extracting text from {file_path}")
    return "Extracted mock medical text."

def detect_semantic_drift(baseline_path: str, updated_path: str) -> List[dict]:
    """
    Core function to detect differences between two documents by:
    1. Extracting text from PDFs.
    2. Segmenting and embedding text.
    3. Running semantic similarity searches to detect drift.
    """
    baseline_text = extract_text_from_pdf(baseline_path)
    updated_text = extract_text_from_pdf(updated_path)
    
    changes = mock_vector_search(baseline_text, updated_text)
    
    return changes
