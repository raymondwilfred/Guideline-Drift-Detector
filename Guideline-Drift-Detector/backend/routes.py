from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import random
from backend.database import get_db
from backend.models import Guideline, GuidelineVersion, DiffRecord

from pydantic import BaseModel
from typing import List, Optional, Dict
import random

class PatientData(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    symptoms: List[str] = []
    medications: List[str] = []
    vitals: Dict[str, float] = {}
    history: List[str] = []

router = APIRouter()

@router.get("/guidelines")
def list_guidelines(db: Session = Depends(get_db)):
    guidelines = db.query(Guideline).all()
    result = []
    for g in guidelines:
        versions = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == g.id).order_by(GuidelineVersion.release_date.desc()).all()
        result.append({
            "id": g.id, 
            "title": g.title, 
            "organization": g.organization,
            "disease_category": g.disease_category,
            "latest_version": versions[0].version_label if versions else "N/A"
        })
    return result

@router.get("/guidelines/{guideline_id}/diffs")
def get_diffs(guideline_id: int, db: Session = Depends(get_db)):
    versions = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == guideline_id).order_by(GuidelineVersion.release_date.desc()).all()
    if len(versions) < 2:
        return []
        
    new_v = versions[0]
    old_v = versions[1]
    
    diffs = db.query(DiffRecord).filter(
        DiffRecord.new_version_id == new_v.id,
        DiffRecord.old_version_id == old_v.id
    ).all()
    
    return [
        {
            "id": d.id,
            "change_type": d.change_type,
            "risk_level": d.risk_level,
            "explanation": d.explanation,
            "old_text_snippet": d.old_text_snippet,
            "new_text_snippet": d.new_text_snippet
        }
        for d in diffs
    ]

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_guidelines = db.query(Guideline).count()
    total_diffs = db.query(DiffRecord).count()
    critical_changes = db.query(DiffRecord).filter(DiffRecord.risk_level == "Critical").count()
    return {
        "total_guidelines": total_guidelines,
        "total_diffs": total_diffs,
        "critical_changes": critical_changes
    }

# --- Phase 2: Advanced Clinical Intelligence Actionable Endpoints ---

@router.get("/simulate_impact/{diff_id}")
def simulate_patient_impact(diff_id: int, db: Session = Depends(get_db)):
    """ Patient-Centric & Digital Twin Simulation Engine """
    diff = db.query(DiffRecord).filter(DiffRecord.id == diff_id).first()
    if not diff:
        return {"error": "Diff not found"}
        
    random.seed(diff_id)
    total_cohort = 10000
    
    # Establish overall risk bounds
    if diff.risk_level == "Critical":
        impact_pct = random.uniform(25.0, 45.0)
    elif diff.risk_level == "Moderate":
        impact_pct = random.uniform(10.0, 24.9)
    else:
        impact_pct = random.uniform(1.0, 9.9)

    patients_affected = int((impact_pct / 100) * total_cohort)
    
    # Generate Demographic Profiling (Age)
    age_groups = ["18-30", "31-45", "46-60", "61+"]
    age_distribution = [random.randint(10, 30) for _ in age_groups]
    total_dist = sum(age_distribution)
    demographics_age = [{"group": age, "impacted": int((dist/total_dist) * patients_affected)} for age, dist in zip(age_groups, age_distribution)]

    # Generate Patient Reclassification Funnel (e.g. Normal -> At Risk -> Diseased)
    reclassification = [
        {"status": "Status Quo (Unaffected)", "patients": total_cohort - patients_affected},
        {"status": "Reclassified: Pre-Clinical/At Risk", "patients": int(patients_affected * 0.4)},
        {"status": "Reclassified: Immediate Treatment", "patients": int(patients_affected * 0.6)}
    ]
    
    return {
        "diff_id": diff_id,
        "total_cohort_simulated": total_cohort,
        "patients_newly_eligible": patients_affected,
        "impact_percentage": round(impact_pct, 1),
        "risk_shift": "Increased surveillance needed" if "Screening" in diff.change_type else "New pharmacological intervention required",
        "demographics_age": demographics_age,
        "reclassification": reclassification,
        "chart_data": [
            {"name": "No Change", "value": total_cohort - patients_affected},
            {"name": "Care Plan Updated", "value": patients_affected}
        ]
    }

@router.get("/conflicts")
def get_guideline_conflicts(db: Session = Depends(get_db)):
    """ Multi-Guideline Conflict Engine """
    # In a real system, we cross-reference disease_category and compute semantic contradictions.
    # Here we mock a conflict engine result for 'Hypertension' (WHO vs NICE) to demonstrate the capability.
    return [
        {
            "id": 1,
            "disease_category": "Hypertension",
            "conflict_type": "Diagnostic Threshold",
            "org_1": "WHO",
            "org_1_rule": "Start treatment at 140/90 mmHg",
            "org_2": "NICE",
            "org_2_rule": "Start treatment at 130/80 mmHg (QRISK > 10%)",
            "resolution_advice": "Local epidemiology and resource availability should dictate the preferred threshold. NICE is more aggressive.",
            "severity": "High"
        },
        {
            "id": 2,
            "disease_category": "Diabetes",
            "conflict_type": "First-line Therapy Formulation",
            "org_1": "WHO",
            "org_1_rule": "Metformin monotherapy universally recommended",
            "org_2": "ADA / Euro Guidelines",
            "org_2_rule": "SGLT2 inhibitors recommended regardless of A1C for high CVD risk",
            "resolution_advice": "WHO focuses on global low-resource settings, whereas Western guidelines prioritize cardiovascular outcomes.",
            "severity": "Moderate"
        }
    ]

@router.post("/patient/analyze")
def analyze_patient_data(data: PatientData):
    """ Intelligent EMR Analysis: Scores completeness, detects missing data, and predicts risk. """
    
    # Calculate Completeness Score
    required_fields = ["age", "symptoms", "vitals", "history"]
    filled_fields = 0
    missing = []
    
    if data.age: filled_fields += 1
    else: missing.append("Age")
    
    if data.symptoms: filled_fields += 1
    else: missing.append("Symptoms")
    
    if data.vitals and any(v > 0 for v in data.vitals.values()): filled_fields += 1
    else: missing.append("Vital Signs (BP/Sugar)")
    
    if data.history: filled_fields += 1
    else: missing.append("Medical History")
    
    completeness = int((filled_fields / len(required_fields)) * 100)
    
    # Predictive Risk Logic (Simplified Hypertension/Diabetes logic)
    risk_level = "Low"
    alerts = []
    suggestions = []
    
    bp = data.vitals.get("bp_systolic", 0)
    sugar = data.vitals.get("blood_sugar", 0)
    
    if bp >= 140 or sugar >= 200:
        risk_level = "High"
        alerts.append("CRITICAL: Vital thresholds exceeded. Immediate clinical review required.")
        suggestions.append("Schedule urgent cardiology/endocrinology consult.")
        suggestions.append("Repeat vital measurement in 15 minutes.")
    elif bp >= 130 or sugar >= 140:
        risk_level = "Moderate"
        alerts.append("WARNING: Elevated levels detected.")
        suggestions.append("Recommend lifestyle modification and 24h monitoring.")
    
    # Keyword-based context requests
    follow_ups = []
    if any(s.lower() in ["chest pain", "dizziness"] for s in data.symptoms):
        if "chest pain" in [s.lower() for s in data.symptoms]:
            follow_ups.append("Was the chest pain triggered by physical exertion?")
            follow_ups.append("Does the pain radiate to the left arm or jaw?")
        if "dizziness" in [s.lower() for s in data.symptoms]:
            follow_ups.append("Is the dizziness accompanied by blurred vision?")
    
    # Advanced Cross-Disease Interaction (Comorbidities)
    has_diabetes = any("diabetes" in h.lower() for h in data.history)
    has_htn = any(h.lower() in ["hypertension", "high bp", "bp"] for h in data.history)
    
    if has_diabetes and has_htn:
        alerts.append("SYNERGISTIC RISK: Combined Diabetes & Hypertension significantly accelerates Cardiovascular and Renal complication potential.")
        suggestions.append("Immediate referral for Fundoscopy (Retinopathy screening) and UACR (Kidney function).")
    
    return {
        "completeness_score": completeness,
        "missing_data": missing,
        "risk_level": risk_level,
        "alerts": alerts,
        "suggestions": suggestions,
        "follow_ups": follow_ups,
        "analyzed_at": random.randint(1000, 9999)
    }

class ChatRequest(BaseModel):
    query: str

@router.post("/chat")
def chat_assistant(req: ChatRequest):
    """ AI Clinical Chat Assistant """
    q = req.query.lower()
    
    # Simple semantic rule-based bot integrated with our "Knowledge Graph" mock
    response = "I am the Drift Detector AI. You can ask me about changes in Diabetes, Hypertension, or Ask for Patient Impacts."
    
    if "diabetes" in q or "metformin" in q:
        response = "The latest update in Diabetes Guidelines indicates a major shift for high CVD risk patients: SGLT2 inhibitors are now recommended independently of baseline A1C, shifting away from universal Metformin first-line therapy."
    elif "hypertension" in q or "blood pressure" in q or "bp" in q:
        response = "NICE has recently lowered the treatment threshold for Hypertension. You should now offer antihypertensive drugs to adults with stage 1 hypertension who have an estimated 10-year CVD risk of 10% or more, down from the previous 20%."
    elif "conflict" in q or "who vs nice" in q:
        response = "Yes, there is a known conflict in Hypertension thresholds. WHO recommends 140/90, while NICE recommends treating at 130/80 if QRISK is over 10%. This is the Multi-Guideline Conflict Engine at work!"
    elif "impact" in q or "patient" in q:
        response = "The Patient Impact Simulation Engine calculates that a threshold change like the Hypertension update affects approximately ~35% of an average clinical cohort, requiring immediate care plan updates."

    return {"answer": response}

@router.get("/diseases/{category}")
def get_disease_details(category: str):
    """ Fetch deep intelligence for a specific disease category """
    metadata = {
        "hypertension": {
            "name": "Hypertension (High Blood Pressure)",
            "definition": "A condition in which the force of the blood against the artery walls is too high, usually defined as 140/90 or higher.",
            "causes": ["Genetics", "High salt intake", "Obesity", "Physical inactivity", "Excessive alcohol"],
            "risk_factors": ["Age", "Race", "Family history", "Chronic kidney disease"],
            "parameters": [
                {"label": "Normal", "range": "< 120/80", "color": "#16a34a"},
                {"label": "Elevated", "range": "120-129 / < 80", "color": "#eab308"},
                {"label": "Stage 1", "range": "130-139 / 80-89", "color": "#f97316"},
                {"label": "Stage 2", "range": ">= 140 / >= 90", "color": "#dc2626"},
                {"label": "Crisis", "range": "> 180 / > 120", "color": "#7f1d1d"}
            ],
            "screening": "All adults > 18y every 2 years if normal, annually if risk factors present.",
            "protocols": ["Lifestyle modification (DASH Diet)", "ACE inhibitors", "Beta blockers", "Calcium channel blockers"]
        },
        "diabetes": {
            "name": "Diabetes Mellitus (Type 2)",
            "definition": "A chronic condition that affects the way the body processes blood sugar (glucose).",
            "causes": ["Insulin resistance", "Sedentary lifestyle", "Pancreatic dysfunction"],
            "risk_factors": ["Overweight", "PCOS", "Age > 45", "Gestational diabetes history"],
            "parameters": [
                {"label": "Normal (Fasting)", "range": "70 - 99 mg/dL", "color": "#16a34a"},
                {"label": "Prediabetes", "range": "100 - 125 mg/dL", "color": "#f97316"},
                {"label": "Diabetes", "range": ">= 126 mg/dL", "color": "#dc2626"}
            ],
            "screening": "Every 3 years for adults > 35y or younger if BMI > 25.",
            "protocols": ["Metformin first-line", "SGLT2 inhibitors for CVD risk", "GLP-1 receptor agonists", "Insulin therapy"]
        },
        "asthma": {
            "name": "Bronchial Asthma",
            "definition": "A condition in which a person's airways become inflamed, narrow and swell, and produce extra mucus.",
            "causes": ["Allergen exposure", "Respiratory infections", "Cold air", "Pollutants"],
            "risk_factors": ["Atopy", "Family history", "Occupational exposure"],
            "parameters": [
                {"label": "Controlled", "range": "No daytime symptoms", "color": "#16a34a"},
                {"label": "Partial", "range": "> 2 days/week symptoms", "color": "#f97316"},
                {"label": "Uncontrolled", "range": "Daily symptoms", "color": "#dc2626"}
            ],
            "screening": "Spirometry / Peak Flow testing during symptomatic periods.",
            "protocols": ["SABA (Rescue)", "Inhaled Corticosteroids (ICS)", "LABA combinations", "Leukotriene modifiers"]
        },
        "cvd": {
            "name": "Cardiovascular Disease (CVD)",
            "definition": "A general term for conditions affecting the heart or blood vessels, often associated with atherosclerosis.",
            "causes": ["High blood pressure", "Smoking", "High cholesterol", "Diabetes"],
            "risk_factors": ["Overweight", "Poor diet", "Genetics", "Age"],
            "parameters": [
                {"label": "Total Cholesterol", "range": "< 200 mg/dL", "color": "#16a34a"},
                {"label": "LDL (Bad)", "range": "< 100 mg/dL", "color": "#16a34a"},
                {"label": "HDL (Good)", "range": "> 40 mg/dL", "color": "#16a34a"},
                {"label": "Triglycerides", "range": "< 150 mg/dL", "color": "#eab308"}
            ],
            "screening": "Lipid profile every 5 years for adults > 20y.",
            "protocols": ["Statins", "Aspirin (Secondary prevention)", "Lifestyle (Smoking cessation)"]
        },
        "ckd": {
            "name": "Chronic Kidney Disease (CKD)",
            "definition": "Gradual loss of kidney function over time, often caused by long-standing diabetes or hypertension.",
            "causes": ["Diabetes", "Hypertension", "Glomerulonephritis", "Polycystic kidney disease"],
            "risk_factors": ["Age", "Family history", "Heart disease"],
            "parameters": [
                {"label": "Stage 1 (Normal)", "range": "GFR > 90", "color": "#16a34a"},
                {"label": "Stage 2 (Mild)", "range": "GFR 60-89", "color": "#eab308"},
                {"label": "Stage 3 (Moderate)", "range": "GFR 30-59", "color": "#f97316"},
                {"label": "Stage 4 (Severe)", "range": "GFR 15-29", "color": "#dc2626"},
                {"label": "Stage 5 (Failure)", "range": "GFR < 15", "color": "#7f1d1d"}
            ],
            "screening": "eGFR and UACR (Albumin/Creatinine) annually for at-risk patients.",
            "protocols": ["BP Control (<130/80)", "SGLT2 inhibitors", "ACE/ARB", "Dietary protein restriction"]
        },
        "stroke": {
                    "name": "Ischemic/Hemorrhagic Stroke",
                    "definition": "A medical emergency where blood supply to part of the brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients.",
                    "causes": ["Arretheriosclerosis", "Atrial Fibrillation", "Hypertension", "Carotid artery disease"],
                    "risk_factors": ["Smoking", "Age", "Previous TIA", "High cholesterol"],
                    "parameters": [
                        {"label": "NIHSS Score", "range": "0 (Normal) - 42 (Severe)", "color": "#f97316"},
                        {"label": "Time to Needle", "range": "< 60 mins (Golden Hour)", "color": "#16a34a"},
                        {"label": "BP Threshold", "range": "< 185/110 (for Lytic)", "color": "#dc2626"}
                    ],
                    "screening": "Regular carotid doppler and AFib screening in elderly.",
                    "protocols": ["tPA (Alteplase) within 4.5h", "Mechanical Thrombectomy", "Antiplatelets (Aspirin/Clopidogrel)"]
                },
        "afib": {
            "name": "Atrial Fibrillation (AFib)",
            "definition": "An irregular and often very rapid heart rhythm (arrhythmia) that can lead to blood clots in the heart.",
            "causes": ["Hypertension", "Heart attacks", "Sleep apnea", "Thyroid issues"],
            "risk_factors": ["Age", "Alcohol consumption", "Obesity", "Family history"],
            "parameters": [
                {"label": "CHADS2-VASc Score", "range": "0 (Low) - 9 (High Risk)", "color": "#f97316"},
                {"label": "Heart Rate (Resting)", "range": "60 - 100 bpm", "color": "#16a34a"},
                {"label": "Anticoagulation Need", "range": "Score >= 2 (Male) / 3 (Female)", "color": "#dc2626"}
            ],
            "screening": "Pulse palpation or single-lead ECG in adults > 65y.",
            "protocols": ["Rate Control (Beta blockers)", "Rhythm Control", "Anticoagulation (DOACs/Warfarin)"]
        },
        "alzheimers": {
            "name": "Alzheimer's Disease",
            "definition": "A progressive disease that destroys memory and other important mental functions.",
            "causes": ["Amyloid plaques", "Tau tangles", "Neurodegeneration"],
            "risk_factors": ["Age", "APOE-e4 gene", "Previous head trauma", "Down syndrome"],
            "parameters": [
                {"label": "MMSE Score", "range": "24-30 (Normal) / < 20 (MDR)", "color": "#f97316"},
                {"label": "MoCA Score", "range": ">= 26 (Normal)", "color": "#16a34a"}
            ],
            "screening": "Cognitive assessment for symptomatic elderly patients.",
            "protocols": ["Cholinesterase inhibitors (Donepezil)", "Memantine", "Aducanumab (Selected cases)"]
        },
        "copd": {
            "name": "COPD (Chronic Obstructive Pulmonary Disease)",
            "definition": "A chronic inflammatory lung disease that causes obstructed airflow from the lungs.",
            "causes": ["Smoking", "Long-term exposure to irritants", "Alpha-1 antitrypsin deficiency"],
            "risk_factors": ["Occupational dust", "Biomass fuel exposure", "Genetics"],
            "parameters": [
                {"label": "FEV1/FVC Ratio", "range": "< 0.70 (Diagnostic)", "color": "#dc2626"},
                {"label": "Oxygen Sat (SpO2)", "range": "88% - 92% (Target)", "color": "#eab308"}
            ],
            "screening": "Spirometry for smokers > 40y with symptoms.",
            "protocols": ["LAMA/LABA Inhalers", "Inhaled Corticosteroids", "Pulmonary Rehab", "Oxygen therapy"]
        },
        "anemia": {
            "name": "Anemia (Iron Deficiency)",
            "definition": "A condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues.",
            "causes": ["Blood loss", "Lack of iron in diet", "Inability to absorb iron", "Pregnancy"],
            "risk_factors": ["Vegetarian diet", "Frequent blood donation", "Menstruation"],
            "parameters": [
                {"label": "Hemoglobin (Male)", "range": "13.5 - 17.5 g/dL", "color": "#16a34a"},
                {"label": "Hemoglobin (Female)", "range": "12.0 - 15.5 g/dL", "color": "#16a34a"},
                {"label": "Ferritin", "range": "30 - 300 ng/mL", "color": "#eab308"}
            ],
            "screening": "CBC (Complete Blood Count) during routine physicals.",
            "protocols": ["Oral Iron Supplements", "IV Iron (Severe cases)", "High-iron diet"]
        }
    }
    
    cat_key = category.lower()
    
    # Map specialties/categories to specific disease metadata
    category_map = {
        "endocrinology": "diabetes",
        "cardiology": "hypertension",
        "pulmonology": "asthma",
        "nephrology": "ckd",
        "vascular": "cvd",
        "neurology": "stroke",
        "geriatrics": "alzheimers",
        "hematology": "anemia"
    }
    
    target_key = category_map.get(cat_key, cat_key)
    result = metadata.get(target_key)
    
    if not result:
        # AI Fallback Simulation Layer
        return {
            "name": f"AI Intelligence: {category}",
            "definition": f"Simulated clinical overview for {category}. This condition involves complex physiological interactions currently being mapped by the intelligence engine.",
            "causes": ["Genetic predisposition", "Environmental factors", "Lifestyle interactions"],
            "risk_factors": ["Age", "Metabolic status", "Family history"],
            "parameters": [
                {"label": "Standard Observation", "range": "Clinical evaluation required", "color": "#f97316"}
            ],
            "screening": "As per local organizational clinical guidelines.",
            "protocols": ["Patient-specific individualized care plan"]
        }
        
    return result

@router.get("/compare/{g1_id}/{g2_id}")
def compare_guidelines(g1_id: int, g2_id: int, db: Session = Depends(get_db)):
    """ Compare two guidelines and find conflicting thresholds or protocols """
    g1 = db.query(Guideline).filter(Guideline.id == g1_id).first()
    g2 = db.query(Guideline).filter(Guideline.id == g2_id).first()
    
    if not g1 or not g2:
        return {"error": "Guideline(s) not found"}
        
    # Get latest versions
    v1 = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == g1_id).order_by(GuidelineVersion.release_date.desc()).first()
    v2 = db.query(GuidelineVersion).filter(GuidelineVersion.guideline_id == g2_id).order_by(GuidelineVersion.release_date.desc()).first()
    
    # Simple semantic conflict detection (Mocked for now with logic based on seeded data)
    # In a real app, this would use NLP to extract thresholds and compare them.
    conflicts = []
    
    # Hypothetical conflict logic for demonstration
    if "Diabetes" in g1.title and "Diabetes" in g2.title:
        conflicts.append({
            "parameter": "Fasting Blood Sugar Threshold",
            "g1_value": "115 mg/dL",
            "g2_value": "126 mg/dL",
            "severity": "Critical",
            "clinical_note": "A mismatch in diagnostic thresholds can lead to over/under-diagnosis of up to 15% of the pre-diabetic population."
        })
    elif "Stroke" in g1.title and "Stroke" in g2.title:
        conflicts.append({
            "parameter": "Door-to-Needle Time",
            "g1_value": "60 mins",
            "g2_value": "45 mins",
            "severity": "Moderate",
            "clinical_note": "Conflicting timelines for tPA administration can cause confusion in emergency protocols."
        })
    else:
        # Generic 'No conflict' or 'Minor mapping'
        conflicts.append({
            "parameter": "Screening Frequency",
            "g1_value": "Annual",
            "g2_value": "Every 2 Years",
            "severity": "Minor",
            "clinical_note": "Discrepancy in screening intervals may affect long-term follow-up costs but has low acute risk."
        })

    return {
        "g1": {"title": g1.title, "org": g1.organization},
        "g2": {"title": g2.title, "org": g2.organization},
        "conflicts": conflicts
    }

@router.post("/patient/simulate_swap")
def simulate_guideline_swap(data: dict):
    """ Recalculates patient risk based on a DIFFERENT guideline's logic """
    patient = data.get("patient", {})
    target_guideline_id = data.get("target_guideline_id")
    
    # Mock simulation logic
    # In a real app, this would use the target guideline's extracted thresholds
    original_risk = data.get("current_risk", "Moderate")
    new_risk = original_risk
    reclassification = "No Change"
    
    systolic = patient.get("clinical_data", {}).get("bp_systolic", 0)
    
    if target_guideline_id:
        # Example: If switching to a stricter guideline (like NICE 130/80)
        if systolic >= 130 and systolic < 140:
            new_risk = "High"
            reclassification = "Upgraded (Stricter Threshold)"
        elif systolic < 120:
            new_risk = "Low"
            reclassification = "Downgraded (Optimized)"

    return {
        "original_risk": original_risk,
        "simulated_risk": new_risk,
        "reclassification": reclassification,
        "delta": 15 if new_risk != original_risk else 0
    }

@router.post("/ai/explain_risk")
def explain_clinical_risk(data: dict):
    """ Generates a structured clinical rationale for a patient's risk profile """
    patient = data.get("patient", {})
    risk_level = data.get("risk_level", "Unknown")
    
    # Mock AI rationale based on patient data
    rationale = [
        f"Patient exhibits elevated markers ({patient.get('clinical_data', {}).get('bp_systolic')} mmHg) which crosses the secondary intervention threshold.",
        "Comorbidity factors (Diabetes + Age) multiply the cardiovascular risk coefficient by 1.8x.",
        "Guideline drift analysis suggests a high sensitivity to current medication titration."
    ]
    
    return {
        "risk_level": risk_level,
        "rationale": rationale,
        "confidence_score": 0.89,
        "source_references": ["WHO Section 4.2", "NICE Stroke Protocol v2"]
    }
