import uvicorn
import yaml
import os

def load_config():
    with open("config.yaml", "r") as f:
        return yaml.safe_load(f)

if __name__ == "__main__":
    config = load_config()
    host = config.get("server", {}).get("host", "0.0.0.0")
    port = config.get("server", {}).get("port", 8000)

    # Ensure required directories exist
    os.makedirs(config["paths"]["data_dir"], exist_ok=True)
    os.makedirs(config["paths"]["raw_guidelines"], exist_ok=True)
    os.makedirs(config["paths"]["processed_guidelines"], exist_ok=True)

    print(f"Starting Medical Guideline Diff & Drift Detector on {host}:{port}")
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
