from ai_engine.utils import clean_text

def clean_guideline_text(raw_text: str) -> str:
    """Applies cleaning rules to raw guideline text."""
    return clean_text(raw_text)
