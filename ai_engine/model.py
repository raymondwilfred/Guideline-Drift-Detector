from transformers import pipeline

class SemanticDriftModel:
    def __init__(self):
        print("Initializing Semantic Drift model...")
        try:
            # We use a very lightweight model to avoid massive downloads for just demonstrating
            self.summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        except Exception:
            self.summarizer = None
            
    def compute_drift(self, old_text: str, new_text: str):
        if not old_text or not new_text or old_text == new_text:
            return None
            
        change_type = "General text update"
        risk_level = "Minor"
        
        lower_new = new_text.lower()
        if "dose" in lower_new or "mg" in lower_new or "dosage" in lower_new:
            change_type = "Dosage modification"
            risk_level = "Critical"
        elif "screen" in lower_new or "age" in lower_new or "year" in lower_new:
            change_type = "Screening criteria"
            risk_level = "Moderate"
        elif "emerge" in lower_new or "new condition" in lower_new:
            change_type = "Emerging condition"
            risk_level = "Critical"
            
        explanation = "The new text introduces updates to the clinical guidelines."
        if self.summarizer:
            try:
                summary = self.summarizer(new_text, max_length=40, min_length=10, do_sample=False)
                explanation = f"Summary of update: {summary[0]['summary_text']}"
            except Exception:
                pass
                
        return {
            "change_type": change_type,
            "risk_level": risk_level,
            "explanation": explanation
        }

drift_model = SemanticDriftModel()
