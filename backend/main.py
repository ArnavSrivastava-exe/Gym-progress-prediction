from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes import auth, workouts, nutrition, metrics, recovery, ml
from ml_models.data_generator import SyntheticDataGenerator
from ml_models.feature_engineer import FeatureEngineer
from ml_models.strength_model import StrengthPredictionModel
from ml_models.bodyweight_model import BodyweightPredictionModel
from ml_models.bodyfat_model import BodyFatPredictionModel
from ml_models.plateau_model import PlateauDetectionModel

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Gym Progress Prediction System",
    description="ML-powered fitness analytics platform",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://172.20.20.23:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth.router)
app.include_router(workouts.router)
app.include_router(nutrition.router)
app.include_router(metrics.router)
app.include_router(recovery.router)
app.include_router(ml.router)

# Train ML models on startup with synthetic data
@app.on_event("startup")
def train_models():
    """Train all ML models with synthetic data on startup"""
    print("🤖 Training ML models...")
    
    workouts, nutrition, metrics, recovery = SyntheticDataGenerator.generate_user_data(days=180)
    
    features_df = FeatureEngineer.engineer_features(workouts, nutrition, metrics, recovery)
    
    if not features_df.empty:
        # Train strength model
        strength_result = ml.strength_model.train(features_df)
        print(f"✓ Strength Model: {strength_result}")
        
        # Train bodyweight model
        bw_result = ml.bodyweight_model.train(features_df)
        print(f"✓ Bodyweight Model: {bw_result}")
        
        # Train bodyfat model
        bf_result = ml.bodyfat_model.train(features_df)
        print(f"✓ Bodyfat Model: {bf_result}")
        
        # Train plateau model
        plateau_result = ml.plateau_model.train(features_df)
        print(f"✓ Plateau Detection Model: {plateau_result}")
    
    print("✅ All models trained successfully!")

@app.get("/")
def read_root():
    return {
        "message": "Gym Progress Prediction System API",
        "docs": "http://localhost:8000/docs",
        "version": "1.0.0",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Gym Progress Prediction API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)