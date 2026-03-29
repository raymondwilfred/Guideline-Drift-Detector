import os
import sys
from datetime import datetime, timedelta

# Avoid path issues
sys.path.append(os.path.dirname(__file__))

from backend.database import SessionLocal, engine, Base
from backend.models import Guideline, GuidelineVersion, DiffRecord

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Clean existing data for a fresh start
    db.query(DiffRecord).delete()
    db.query(GuidelineVersion).delete()
    db.query(Guideline).delete()
    db.commit()

    print("Seeding WHO Diabetes Care Guideline...")
    g1 = Guideline(title="Diabetes Management Guidelines", organization="World Health Organization", disease_category="Endocrinology")
    db.add(g1)
    db.commit()
    db.refresh(g1)

    v1_diabetes = GuidelineVersion(guideline_id=g1.id, version_label="2022.1", release_date=datetime.now() - timedelta(days=700), raw_text="Initial guideline emphasizing standard metformin treatment and annual retinopathy screening.")
    v2_diabetes = GuidelineVersion(guideline_id=g1.id, version_label="2023.4", release_date=datetime.now() - timedelta(days=200), raw_text="Updated guideline. SGLT2 inhibitors recommended for high cardiovascular risk. Retinopathy screening every 2 years for low-risk patients.")
    db.add_all([v1_diabetes, v2_diabetes])
    db.commit()
    db.refresh(v1_diabetes)
    db.refresh(v2_diabetes)

    db.add(DiffRecord(
        old_version_id=v1_diabetes.id,
        new_version_id=v2_diabetes.id,
        change_type="Treatment Protocol Update",
        risk_level="Critical",
        explanation="The primary pharmacological recommendation has shifted for patients with CVD risk. This requires immediate protocol updates for prescribing physicians.",
        old_text_snippet="Standard first-line therapy is metformin for all type 2 diabetes patients without contraindications.",
        new_text_snippet="For patients with established cardiovascular disease, SGLT2 inhibitors or GLP-1 RAs are recommended independently of baseline A1C."
    ))
    db.add(DiffRecord(
        old_version_id=v1_diabetes.id,
        new_version_id=v2_diabetes.id,
        change_type="Screening Interval Modified",
        risk_level="Moderate",
        explanation="Retinopathy screening frequency has been relaxed for a specific patient sub-group.",
        old_text_snippet="Annual dilated eye examinations are recommended for all adult patients.",
        new_text_snippet="Screening may be extended to every 2 years in patients with no background retinopathy and optimal glycemic control."
    ))

    print("Seeding NICE Hypertension Guideline...")
    g2 = Guideline(title="Hypertension in Adults", organization="National Institute for Health and Care Excellence", disease_category="Cardiology")
    db.add(g2)
    db.commit()
    db.refresh(g2)

    v1_hyper = GuidelineVersion(guideline_id=g2.id, version_label="NG136", release_date=datetime.now() - timedelta(days=1500), raw_text="Target clinic blood pressure below 140/90 mmHg for adults under 80.")
    v2_hyper = GuidelineVersion(guideline_id=g2.id, version_label="NG136_Update", release_date=datetime.now() - timedelta(days=50), raw_text="Revised thresholds. Offer anti-hypertensive drug treatment to age under 80 with stage 1 hypertension and QRISK score 10% or more.")
    db.add_all([v1_hyper, v2_hyper])
    db.commit()
    db.refresh(v1_hyper)
    db.refresh(v2_hyper)

    db.add(DiffRecord(
        old_version_id=v1_hyper.id,
        new_version_id=v2_hyper.id,
        change_type="Diagnostic Threshold Revision",
        risk_level="Critical",
        explanation="The risk threshold for initiating pharmacological treatment has been lowered from 20% to 10% QRISK3. This expands the treatment eligible population significantly.",
        old_text_snippet="Offer lifestyle advice and consider drug treatment if CVD risk > 20%.",
        new_text_snippet="Offer antihypertensive drug treatment to adults with stage 1 hypertension who have an estimated 10-year CVD risk of 10% or more."
    ))
    db.add(DiffRecord(
        old_version_id=v1_hyper.id,
        new_version_id=v2_hyper.id,
        change_type="Terminology Update",
        risk_level="Minor",
        explanation="Standardized wording around blood pressure monitoring techniques.",
        old_text_snippet="Ambulatory blood pressure monitoring (ABPM) should be offered.",
        new_text_snippet="ABPM is the preferred diagnostic method to confirm hypertension."
    ))
    db.commit()

    print("Seeding ICMR Pediatric Asthma...")
    g3 = Guideline(title="Management of Asthma in Children", organization="Indian Council of Medical Research", disease_category="Pulmonology")
    db.add(g3)
    db.commit()
    db.refresh(g3)

    v1_asthma = GuidelineVersion(guideline_id=g3.id, version_label="2021 Release", release_date=datetime.now() - timedelta(days=1000), raw_text="...")
    v2_asthma = GuidelineVersion(guideline_id=g3.id, version_label="2024 Revision", release_date=datetime.now() - timedelta(days=20), raw_text="...")
    db.add_all([v1_asthma, v2_asthma])
    db.commit()
    db.refresh(v1_asthma)
    db.refresh(v2_asthma)

    db.add(DiffRecord(
        old_version_id=v1_asthma.id,
        new_version_id=v2_asthma.id,
        change_type="Dosage Modification",
        risk_level="Critical",
        explanation="Inhaled Corticosteroid (ICS) maximum daily dose recommendation for mild persistent asthma in under 5s has been reduced.",
        old_text_snippet="Maximum daily dose of budesonide 400mcg equivalent for step 2 therapy.",
        new_text_snippet="Maximum daily dose of budesonide should not exceed 200mcg equivalent in step 2 therapy; refer to specialist if uncontrolled."
    ))

    db.commit()
    print("Database seeding completed efficiently. The UI will now have rich drift data!")
    
if __name__ == "__main__":
    seed_database()
