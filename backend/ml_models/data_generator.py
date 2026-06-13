import numpy as np
import pandas as pd
from datetime import datetime, timedelta

class SyntheticDataGenerator:
    @staticmethod
    def generate_user_data(days: int = 180) -> tuple:
        """Generate realistic synthetic user data for training"""
        
        dates = [datetime.now() - timedelta(days=x) for x in range(days, 0, -1)]
        dates = [d.strftime("%Y-%m-%d") for d in dates]
        
        # Workouts
        exercises = ["Bench Press", "Squat", "Deadlift"]
        workouts = []
        for i, date in enumerate(dates):
            if np.random.random() > 0.3:  # 70% training days
                for exercise in np.random.choice(exercises, size=np.random.randint(1, 3), replace=False):
                    base_weight = 100 if exercise == "Bench Press" else 150 if exercise == "Squat" else 180
                    weight = base_weight + (i / days * 20) + np.random.normal(0, 5)
                    workouts.append({
                        "exercise_name": exercise,
                        "weight_kg": max(50, weight),
                        "reps": np.random.randint(5, 12),
                        "sets": np.random.randint(3, 5),
                        "rpe": np.random.uniform(6, 9),
                        "date": date,
                    })
        
        # Nutrition
        nutrition = []
        for date in dates:
            nutrition.append({
                "date": date,
                "calories": np.random.normal(2500, 200),
                "protein_g": np.random.normal(180, 20),
                "carbs_g": np.random.normal(300, 30),
                "fats_g": np.random.normal(85, 10),
            })
        
        # Metrics
        metrics = []
        base_weight = 75
        for i, date in enumerate(dates):
            metrics.append({
                "date": date,
                "weight_kg": base_weight - (i / days * 3) + np.random.normal(0, 0.5),
                "body_fat_pct": 15 - (i / days * 2) + np.random.normal(0, 0.3),
            })
        
        # Recovery
        recovery = []
        for date in dates:
            recovery.append({
                "date": date,
                "sleep_hours": np.random.normal(7.5, 1),
                "stress_level": np.random.randint(1, 10),
                "recovery_score": np.random.randint(5, 10),
            })
        
        return workouts, nutrition, metrics, recovery