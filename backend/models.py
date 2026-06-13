from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    body_fat_pct = Column(Float)
    training_experience = Column(String)
    goal = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    workouts = relationship("Workout", back_populates="user", cascade="all, delete-orphan")
    nutrition = relationship("Nutrition", back_populates="user", cascade="all, delete-orphan")
    metrics = relationship("BodyMetrics", back_populates="user", cascade="all, delete-orphan")
    recovery = relationship("Recovery", back_populates="user", cascade="all, delete-orphan")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    exercise_name = Column(String)
    weight_kg = Column(Float)
    reps = Column(Integer)
    sets = Column(Integer)
    rpe = Column(Float, nullable=True)
    date = Column(String)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="workouts")

class Nutrition(Base):
    __tablename__ = "nutrition"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String)
    calories = Column(Float)
    protein_g = Column(Float)
    carbs_g = Column(Float)
    fats_g = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="nutrition")

class BodyMetrics(Base):
    __tablename__ = "body_metrics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String)
    weight_kg = Column(Float)
    body_fat_pct = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="metrics")

class Recovery(Base):
    __tablename__ = "recovery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(String)
    sleep_hours = Column(Float)
    stress_level = Column(Integer)
    recovery_score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recovery")