# SPDX-License-Identifier: MIT
from ai_engine.model import drift_model
from ai_engine.utils import split_into_sentences

def analyze_guideline_drift(old_text: str, new_text: str):
    """
    Compares two guidelines and returns a list of detected semantic drifts.
    This simulates comparing document subsets.
    """
    old_sentences = split_into_sentences(old_text)
    new_sentences = split_into_sentences(new_text)
    
    drifts = []
    
    if len(old_sentences) > 0 and len(new_sentences) > 0:
        min_len = min(len(old_sentences), len(new_sentences))
        for i in range(min_len):
            if old_sentences[i] != new_sentences[i]:
                drift = drift_model.compute_drift(old_sentences[i], new_sentences[i])
                if drift:
                    drifts.append({
                        **drift,
                        "old_text_snippet": old_sentences[i],
                        "new_text_snippet": new_sentences[i]
                    })
    else:
        # Fallback
        drift = drift_model.compute_drift(old_text, new_text)
        if drift:
            drifts.append({
                **drift,
                "old_text_snippet": old_text[:200] if old_text else "",
                "new_text_snippet": new_text[:200] if new_text else ""
            })
            
    return drifts
