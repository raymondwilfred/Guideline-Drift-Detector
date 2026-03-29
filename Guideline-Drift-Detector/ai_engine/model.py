from transformers import pipeline
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SemanticDriftModel:
    def __init__(self):
        logger.info("Initializing Advanced Semantic Drift pipeline...")
        try:
            # Setup a lightweight zero-shot classification model to determine risk levels
            self.classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
            # Setup text summarization to generate AI explanations
            self.summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
            self.model_loaded = True
        except Exception as e:
            logger.warning(f"Could not load HuggingFace models natively: {e}")
            self.model_loaded = False
            
    def compute_drift(self, old_text: str, new_text: str):
        if not old_text or not new_text or old_text == new_text:
            return None
            
        change_type = "Semantic Adjustment"
        risk_level = "Minor"
        explanation = "The clinical language has been updated for clarity without significant treatment alteration."
        
        # Advanced Heuristic / ML fallback
        lower_new = new_text.lower()
        if "dose" in lower_new or "mg" in lower_new or "dosage" in lower_new or "maximum" in lower_new:
            change_type = "Dosage Modification"
        elif "screen" in lower_new or "interval" in lower_new or "frequency" in lower_new:
            change_type = "Screening Interval Revision"
        elif "emerge" in lower_new or "new condition" in lower_new or "suspect" in lower_new:
            change_type = "Emerging Disease Context"
        elif "threshold" in lower_new or "target" in lower_new:
            change_type = "Clinical Threshold Revision"

        if self.model_loaded:
            try:
                # 1. Determine Risk Level using Zero-Shot Learner
                candidate_labels = ["Critical Risk", "Moderate Risk", "Minor Editorial Change"]
                classification = self.classifier(new_text, candidate_labels)
                top_label = classification['labels'][0]
                
                if top_label == "Critical Risk":
                    risk_level = "Critical"
                elif top_label == "Moderate Risk":
                    risk_level = "Moderate"
                else:
                    risk_level = "Minor"
                
                # 2. Generate an AI Summary of the change
                combined_text = f"Old Version: {old_text}. New Version: {new_text}. Summary of changes: "
                summary = self.summarizer(new_text, max_length=50, min_length=15, do_sample=False)
                explanation = f"AI Analysis: {summary[0]['summary_text'].strip()}"
                
            except Exception as e:
                logger.error(f"AI inference error: {e}")
                self._fallback_logic(change_type, locals())
        else:
            # Fallback to smart heuristic if models are not available/downloaded yet
            if change_type in ["Dosage Modification", "Clinical Threshold Revision", "Emerging Disease Context"]:
                risk_level = "Critical"
            elif change_type in ["Screening Interval Revision"]:
                risk_level = "Moderate"
                
        return {
            "change_type": change_type,
            "risk_level": risk_level,
            "explanation": explanation
        }

    def _fallback_logic(self, change_type, context):
        if change_type in ["Dosage Modification", "Clinical Threshold Revision"]:
            context['risk_level'] = "Critical"
        elif change_type in ["Screening Interval Revision"]:
            context['risk_level'] = "Moderate"

drift_model = SemanticDriftModel()
