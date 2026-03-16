import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
    
    APP_NAME: str = "Guideline Drift Detector API"
    DEBUG_MODE: bool = True
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./guidelines.db")
    VECTOR_MODEL_NAME: str = "all-MiniLM-L6-v2"
    UPLOAD_DIR: str = "uploads"

settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
