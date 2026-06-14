from typing import Optional
from pydantic import BaseModel

# Auth Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    body_fat_pct: float
    training_experience: str
    goal: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    body_fat_pct: float
    training_experience: str
    goal: str
    onboarding_completed: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Workout Schemas
class WorkoutCreate(BaseModel):
    exercise_name: str
    weight_kg: float
    reps: int
    sets: int
    notes: Optional[str] = None

class WorkoutResponse(BaseModel):
    id: int
    user_id: int
    exercise_name: str
    weight_kg: float
    reps: int
    sets: int
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# Nutrition Schemas
class NutritionCreate(BaseModel):
    date: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    notes: Optional[str] = None

class NutritionResponse(BaseModel):
    id: int
    user_id: int
    date: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# Body Metrics Schemas
class BodyMetricsCreate(BaseModel):
    weight_kg: float
    body_fat_pct: float
    date: str

class BodyMetricsResponse(BaseModel):
    id: int
    user_id: int
    weight_kg: float
    body_fat_pct: float
    date: str

    class Config:
        from_attributes = True

# Recovery Schemas
class RecoveryCreate(BaseModel):
    sleep_hours: float
    sleep_quality: int
    stress_level: int
    notes: Optional[str] = None

class RecoveryResponse(BaseModel):
    id: int
    user_id: int
    sleep_hours: float
    sleep_quality: int
    stress_level: int
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# Onboarding Schemas
class OnboardingDataSchema(BaseModel):
    # Step 2: Training History
    years_training: Optional[float] = None
    months_training: Optional[float] = None
    trained_consistently_6m: Optional[bool] = None
    training_days_per_week: Optional[int] = None
    avg_workout_duration: Optional[int] = None
    training_split: Optional[str] = None
    plateau_last_3m: Optional[bool] = None
    
    # Step 3: Sleep & Recovery
    sleep_hours_avg: Optional[float] = None
    sleep_quality_rating: Optional[int] = None
    daily_stress_level: Optional[int] = None
    water_intake_liters: Optional[float] = None
    recovery_rating: Optional[int] = None
    
    # Step 5: Nutrition & Lifestyle
    daily_calories: Optional[int] = None
    daily_protein_g: Optional[float] = None
    current_phase: Optional[str] = None
    weight_trend: Optional[str] = None
    steps_per_day: Optional[int] = None
    cardio_regular: Optional[bool] = None
    cardio_sessions_per_week: Optional[int] = None
    cardio_type: Optional[str] = None
    tracks_workouts: Optional[bool] = None
    missed_workouts_frequency: Optional[str] = None
    workout_consistency_rating: Optional[int] = None
    injuries_last_12m: Optional[bool] = None
    training_with_pain: Optional[bool] = None
    injured_body_parts: Optional[str] = None
    days_willing_to_train: Optional[int] = None
    progress_vs_recovery_importance: Optional[int] = None
    willing_increase_volume: Optional[bool] = None
    willing_increase_calories: Optional[bool] = None
    willing_reduce_volume_if_needed: Optional[bool] = None

class TrainingMetricsSchema(BaseModel):
    bench_press_weight_kg: Optional[float] = None
    bench_press_reps: Optional[int] = None
    bench_press_sets: Optional[int] = None
    squat_weight_kg: Optional[float] = None
    squat_reps: Optional[int] = None
    squat_sets: Optional[int] = None
    deadlift_weight_kg: Optional[float] = None
    deadlift_reps: Optional[int] = None
    deadlift_sets: Optional[int] = None
    ohp_weight_kg: Optional[float] = None
    ohp_reps: Optional[int] = None
    ohp_sets: Optional[int] = None
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    arm_cm: Optional[float] = None
    thigh_cm: Optional[float] = None

class GoalsSchema(BaseModel):
    target_weight_kg: Optional[float] = None
    target_body_fat_pct: Optional[float] = None
    target_bench_press_kg: Optional[float] = None
    target_squat_kg: Optional[float] = None
    target_deadlift_kg: Optional[float] = None
    target_ohp_kg: Optional[float] = None

class OnboardingStatusResponse(BaseModel):
    onboarding_completed: bool
    days_since_first_workout: Optional[int] = None
    can_access_dashboard: bool