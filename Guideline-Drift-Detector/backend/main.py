from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import router
from backend.database import engine, Base
from backend.models import Guideline, GuidelineVersion, DiffRecord

# Create tables if not exists
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Medical Guideline Diff & Drift Detector API",
    description="API for tracking and explaining clinical guideline changes.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Medical Guideline Drift Detector API"}