import re

def clean_text(text: str) -> str:
    """Removes extra whitespaces and special characters."""
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def split_into_sentences(text: str) -> list:
    """Simple sentence splitter."""
    if not text:
        return []
    sentences = re.split(r'(?<=[.!?]) +', text)
    return [s for s in sentences if s]
