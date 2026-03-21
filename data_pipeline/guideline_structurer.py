def structure_guideline(text: str) -> dict:
    """
    Attempts to break text into sections. 
    Returns a unified dict.
    """
    return {
        "raw_text": text,
        "sections": {
            "main": text
        }
    }
