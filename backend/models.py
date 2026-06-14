from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    body_fat_pct = Column(Float, nullable=True)
    training_experience = Column(String, nullable=True)
    goal = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Onboarding tracking
    onboarding_completed = Column(Boolean, default=False)
    first_workout_date = Column(DateTime, nullable=True)
    
    # Relationships
    onboarding_data = relationship("OnboardingData", back_populates="user", uselist=False, cascade="all, delete-orphan")
    training_metrics = relationship("TrainingMetrics", back_populates="user", uselist=False, cascade="all, delete-orphan")
    goals = relationship("Goals", back_populates="user", uselist=False, cascade="all, delete-orphan")
    workouts = relationship("Workout", back_populates="user", cascade="all, delete-orphan")
    nutrition = relationship("Nutrition", back_populates="user", cascade="all, delete-orphan")
    metrics = relationship("BodyMetrics", back_populates="user", cascade="all, delete-orphan")
    recovery = relationship("Recovery", back_populates="user", cascade="all, delete-orphan")

class OnboardingData(Base):
    __tablename__ = "onboarding_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Step 2: Training History
    years_training = Column(Float, nullable=True)
    months_training = Column(Float, nullable=True)
    trained_consistently_6m = Column(Boolean, nullable=True)
    training_days_per_week = Column(Integer, nullable=True)
    avg_workout_duration = Column(Integer, nullable=True)
    training_split = Column(String, nullable=True)
    plateau_last_3m = Column(Boolean, nullable=True)
    
    # Step 3: Sleep & Recovery
    sleep_hours_avg = Column(Float, nullable=True)
    sleep_quality_rating = Column(Integer, nullable=True)
    daily_stress_level = Column(Integer, nullable=True)
    water_intake_liters = Column(Float, nullable=True)
    recovery_rating = Column(Integer, nullable=True)
    
    # Step 5: Nutrition & Lifestyle
    daily_calories = Column(Integer, nullable=True)
    daily_protein_g = Column(Float, nullable=True)
    current_phase = Column(String, nullable=True)
    weight_trend = Column(String, nullable=True)
    steps_per_day = Column(Integer, nullable=True)
    cardio_regular = Column(Boolean, nullable=True)
    cardio_sessions_per_week = Column(Integer, nullable=True)
    cardio_type = Column(String, nullable=True)
    
    # Tracking & Consistency
    tracks_workouts = Column(Boolean, nullable=True)
    missed_workouts_frequency = Column(String, nullable=True)
    workout_consistency_rating = Column(Integer, nullable=True)
    
    # Injuries & Pain
    injuries_last_12m = Column(Boolean, nullable=True)
    training_with_pain = Column(Boolean, nullable=True)
    injured_body_parts = Column(Text, nullable=True)
    
    # Preferences
    days_willing_to_train = Column(Integer, nullable=True)
    progress_vs_recovery_importance = Column(Integer, nullable=True)
    willing_increase_volume = Column(Boolean, nullable=True)
    willing_increase_calories = Column(Boolean, nullable=True)
    willing_reduce_volume_if_needed = Column(Boolean, nullable=True)
    
    # Daily State
    energy_level_today = Column(Integer, nullable=True)
    motivation_today = Column(Integer, nullable=True)
    workout_performance_today = Column(Integer, nullable=True)
    workout_difficulty_today = Column(Integer, nullable=True)
    muscle_soreness_today = Column(Integer, nullable=True)
    
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="onboarding_data")

class TrainingMetrics(Base):
    __tablename__ = "training_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    bench_press_weight_kg = Column(Float, nullable=True)
    bench_press_reps = Column(Integer, nullable=True)
    bench_press_sets = Column(Integer, nullable=True)
    
    squat_weight_kg = Column(Float, nullable=True)
    squat_reps = Column(Integer, nullable=True)
    squat_sets = Column(Integer, nullable=True)
    
    deadlift_weight_kg = Column(Float, nullable=True)
    deadlift_reps = Column(Integer, nullable=True)
    deadlift_sets = Column(Integer, nullable=True)
    
    ohp_weight_kg = Column(Float, nullable=True)
    ohp_reps = Column(Integer, nullable=True)
    ohp_sets = Column(Integer, nullable=True)
    
    chest_cm = Column(Float, nullable=True)
    waist_cm = Column(Float, nullable=True)
    arm_cm = Column(Float, nullable=True)
    thigh_cm = Column(Float, nullable=True)
    
    uses_fitness_tracker = Column(Boolean, nullable=True)
    resting_heart_rate = Column(Integer, nullable=True)
    daily_active_calories = Column(Float, nullable=True)
    
    weeks_on_current_program = Column(Integer, nullable=True)
    recent_program_change = Column(Boolean, nullable=True)
    deload_last_8_weeks = Column(Boolean, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="training_metrics")

class Goals(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    target_weight_kg = Column(Float, nullable=True)
    target_body_fat_pct = Column(Float, nullable=True)
    
    target_bench_press_kg = Column(Float, nullable=True)
    target_squat_kg = Column(Float, nullable=True)
    target_deadlift_kg = Column(Float, nullable=True)
    target_ohp_kg = Column(Float, nullable=True)
    
    goal_deadline = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="goals")

class Workout(Base):
    __tablename__ = "workouts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_name = Column(String)
    weight_kg = Column(Float)
    reps = Column(Integer)
    sets = Column(Integer)
    rpe = Column(Integer, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)
    
    user = relationship("User", back_populates="workouts")

class Nutrition(Base):
    __tablename__ = "nutrition"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    calories = Column(Float)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fats_g = Column(Float)
    
    user = relationship("User", back_populates="nutrition")

class BodyMetrics(Base):
    __tablename__ = "body_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    weight_kg = Column(Float)
    body_fat_pct = Column(Float, nullable=True)
    
    user = relationship("User", back_populates="metrics")

class Recovery(Base):
    __tablename__ = "recovery"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    sleep_hours = Column(Float)
    stress_level = Column(Integer)
    recovery_score = Column(Integer)
    
    user = relationship("User", back_populates="recovery")