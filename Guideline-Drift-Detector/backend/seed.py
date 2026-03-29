from datetime import datetime, timedelta
from backend.database import SessionLocal, engine, Base
from backend.models import Guideline, GuidelineVersion, DiffRecord

def seed():
    db = SessionLocal()
    
    # We will clear Guidelines if needed or just add if they don't exist
    # For now, let's just make sure we add versions to existing ones or new ones.
    
    new_guidelines = [
        {
            "title": "NICE Stroke Rehabilitation & Management",
            "org": "NICE (National Institute for Health and Care Excellence)",
            "cat": "Neurology",
            "old_version": "2019.5",
            "new_version": "2023.11",
            "diffs": [
                {"type": "screening", "risk": "Moderate", "old": "Post-stroke assessment within 48h.", "new": "Comprehensive multidisciplinary assessment within 24h of admission.", "exp": "Early assessment significantly improves long-term motor recovery outcomes."}
            ]
        },
        {
            "title": "AHA/ACC Atrial Fibrillation Management",
            "org": "AHA/ACC (American Heart Association)",
            "cat": "Cardiology",
            "old_version": "2018.2",
            "new_version": "2023.10",
            "diffs": [
                {"type": "threshold", "risk": "Critical", "old": "Direct Oral Anticoagulants (DOACs) for CHADS2-VASc >= 2.", "new": "Early rhythm control strategy (Catheter Ablation) preferred for symptomatic AFib regardless of score.", "exp": "Shift toward rhythm control to reduce long-term heart failure risk."}
            ]
        },
        {
            "title": "GOLD Global Strategy for COPD",
            "org": "GOLD (Global Initiative for Chronic Obstructive Lung Disease)",
            "cat": "Pulmonology",
            "old_version": "2022.1",
            "new_version": "2024.1",
            "diffs": [
                {"type": "dosage", "risk": "Moderate", "old": "LAMA + LABA for Group B patients.", "new": "Triple therapy (LAMA+LABA+ICS) for patients with blood eosinophil counts >= 300 cells/µL.", "exp": "Precise targeting based on inflammatory biomarkers."}
            ]
        },
        {
            "title": "KDIGO Clinical Practice Guideline for CKD",
            "org": "KDIGO (Kidney Disease: Improving Global Outcomes)",
            "cat": "Nephrology",
            "old_version": "2012.1",
            "new_version": "2024.2",
            "diffs": [
                {"type": "threshold", "risk": "Critical", "old": "SGLT2 inhibitors recommended for eGFR > 30.", "new": "SGLT2 inhibitors extended to patients with eGFR as low as 20 mL/min/1.73m².", "exp": "Significant renal protection demonstrated in lower GFR ranges."}
            ]
        },
        {
            "title": "ESC Cardiovascular Disease Prevention",
            "org": "ESC (European Society of Cardiology)",
            "cat": "Vascular",
            "old_version": "2016.3",
            "new_version": "2021.5",
            "diffs": [
                {"type": "threshold", "risk": "Moderate", "old": "LDL-C target < 70 mg/dL for high risk.", "new": "LDL-C target < 55 mg/dL and 50% reduction for very high risk patients.", "exp": "Lower is better' strategy for atherosclerosis prevention."}
            ]
        },
        {
            "title": "WHO Management of Anemia",
            "org": "World Health Organization",
            "cat": "Hematology",
            "old_version": "2011.4",
            "new_version": "2023.6",
            "diffs": [
                {"type": "screening", "risk": "Minor", "old": "Hemoglobin testing in pregnancy at 1st and 3rd trimester.", "new": "Mandatory Ferritin screening added to identify iron deficiency before anemia develops.", "exp": "Focus on iron stores rather than just circulating hemoglobin."}
            ]
        }
    ]

    # Delete existing guidelines to reset and seed properly with multi-version
    db.query(Guideline).delete()
    db.query(GuidelineVersion).delete()
    db.query(DiffRecord).delete()
    db.commit()

    # Re-add the Original 3 as well for completeness
    original_3 = [
        {
            "title": "Diabetes Management Guidelines", "org": "World Health Organization", "cat": "Endocrinology", "old_v": "2019.2", "new_v": "2023.4",
            "diffs": [{"type": "threshold", "risk": "Critical", "old": "Fasting blood sugar > 126 mg/dL", "new": "Fasting blood sugar > 115 mg/dL for high-risk cohorts", "exp": "Early intervention saves lives."}]
        },
        {
            "title": "Hypertension in Adults", "org": "NICE", "cat": "Cardiology", "old_v": "2011.0", "new_v": "2023.0",
            "diffs": [{"type": "threshold", "risk": "Critical", "old": "140/90 mmHg", "new": "130/80 mmHg", "exp": "Stricter control reduces stroke risk."}]
        },
        {
            "title": "Management of Asthma in Children", "org": "ICMR", "cat": "Pulmonology", "old_v": "2015.0", "new_v": "2024.0",
            "diffs": [{"type": "dosage", "risk": "Moderate", "old": "SABA as needed", "new": "ICS-Formoterol preferred as MART", "exp": "Reduces exacerbations."}]
        }
    ]

    for g_data in (new_guidelines + original_3):
        # Handle original_3 vs new_guidelines naming differences
        title = g_data["title"]
        org = g_data.get("org", g_data.get("organization"))
        cat = g_data.get("cat", g_data.get("disease_category"))
        old_label = g_data.get("old_version", g_data.get("old_v"))
        new_label = g_data.get("new_version", g_data.get("new_v"))

        g = Guideline(title=title, organization=org, disease_category=cat)
        db.add(g)
        db.flush()
        
        # OLD VERSION
        v_old = GuidelineVersion(
            guideline_id=g.id, 
            version_label=old_label, 
            release_date=datetime.now() - timedelta(days=365*2),
            raw_text=f"Legacy text for {title}"
        )
        db.add(v_old)
        
        # NEW VERSION
        v_new = GuidelineVersion(
            guideline_id=g.id, 
            version_label=new_label, 
            release_date=datetime.now(),
            raw_text=f"Updated text for {title}"
        )
        db.add(v_new)
        db.flush()
        
        for d_data in g_data["diffs"]:
            d = DiffRecord(
                old_version_id=v_old.id,
                new_version_id=v_new.id,
                change_type=d_data["type"],
                risk_level=d_data["risk"],
                old_text_snippet=d_data["old"],
                new_text_snippet=d_data["new"],
                explanation=d_data["exp"]
            )
            db.add(d)
    
    db.commit()
    print(f"Successfully re-seeded database with {len(new_guidelines) + 3} multi-version guidelines.")
    db.close()

if __name__ == "__main__":
    seed()
