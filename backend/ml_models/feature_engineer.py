import numpy as np
import pandas as pd
from typing import List, Dict, Tuple

class FeatureEngineer:
    @staticmethod
    def estimate_1rm(weight: float, reps: int) -> float:
        """Estimate 1RM using Brzycki formula"""
        if reps == 1:
            return weight
        return weight * (36 / (37 - reps))
    
    @staticmethod
    def engineer_features(workouts: List[Dict], nutrition: List[Dict], metrics: List[Dict], recovery: List[Dict]) -> pd.DataFrame:
        """Create engineered features for ML models"""
        
        # Convert to DataFrames
        df_workouts = pd.DataFrame(workouts) if workouts else pd.DataFrame()
        df_nutrition = pd.DataFrame(nutrition) if nutrition else pd.DataFrame()
        df_metrics = pd.DataFrame(metrics) if metrics else pd.DataFrame()
        df_recovery = pd.DataFrame(recovery) if recovery else pd.DataFrame()
        
        # If no data, return empty
        if df_workouts.empty:
            return pd.DataFrame()
        
        # Convert dates
        for df in [df_workouts, df_nutrition, df_metrics, df_recovery]:
            if not df.empty and 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'])
        
        # Calculate 1RM for each workout
        if not df_workouts.empty:
            df_workouts['estimated_1rm'] = df_workouts.apply(
                lambda x: FeatureEngineer.estimate_1rm(x['weight_kg'], x['reps']),
                axis=1
            )
        
        # Weekly aggregations
        features = []
        
        if not df_workouts.empty:
            for date in df_workouts['date'].unique():
                week_start = pd.to_datetime(date) - pd.Timedelta(days=7)
                
                # Workout features
                week_workouts = df_workouts[(df_workouts['date'] >= week_start) & (df_workouts['date'] <= date)]
                weekly_volume = week_workouts['weight_kg'].sum() if not week_workouts.empty else 0
                workout_freq = len(week_workouts) if not week_workouts.empty else 0
                avg_rpe = week_workouts['rpe'].mean() if not week_workouts.empty and 'rpe' in week_workouts.columns else 5.0
                max_1rm = week_workouts['estimated_1rm'].max() if not week_workouts.empty else 0
                
                # Nutrition features
                week_nutrition = df_nutrition[(df_nutrition['date'] >= week_start) & (df_nutrition['date'] <= date)]
                avg_calories = week_nutrition['calories'].mean() if not week_nutrition.empty else 2500
                avg_protein = week_nutrition['protein_g'].mean() if not week_nutrition.empty else 150
                avg_carbs = week_nutrition['carbs_g'].mean() if not week_nutrition.empty else 250
                avg_fats = week_nutrition['fats_g'].mean() if not week_nutrition.empty else 80
                
                # Recovery features
                week_recovery = df_recovery[(df_recovery['date'] >= week_start) & (df_recovery['date'] <= date)]
                avg_sleep = week_recovery['sleep_hours'].mean() if not week_recovery.empty else 7.0
                avg_stress = week_recovery['stress_level'].mean() if not week_recovery.empty else 5
                avg_recovery_score = week_recovery['recovery_score'].mean() if not week_recovery.empty else 7
                
                # Metrics features
                week_metrics = df_metrics[(df_metrics['date'] >= week_start) & (df_metrics['date'] <= date)]
                weight = week_metrics['weight_kg'].iloc[-1] if not week_metrics.empty else 75
                body_fat = week_metrics['body_fat_pct'].iloc[-1] if not week_metrics.empty and 'body_fat_pct' in week_metrics.columns else 15
                
                # Calculate trends
                if len(week_workouts) > 1:
                    progress_velocity = (week_workouts['estimated_1rm'].iloc[-1] - week_workouts['estimated_1rm'].iloc[0]) / len(week_workouts)
                else:
                    progress_velocity = 0
                
                features.append({
                    'date': date,
                    'weekly_volume': weekly_volume,
                    'weekly_frequency': workout_freq,
                    'avg_rpe': avg_rpe,
                    'max_1rm': max_1rm,
                    'avg_calories': avg_calories,
                    'avg_protein': avg_protein,
                    'avg_carbs': avg_carbs,
                    'avg_fats': avg_fats,
                    'avg_sleep': avg_sleep,
                    'avg_stress': avg_stress,
                    'avg_recovery_score': avg_recovery_score,
                    'weight': weight,
                    'body_fat': body_fat,
                    'progress_velocity': progress_velocity,
                    'fatigue_index': avg_stress / avg_recovery_score if avg_recovery_score > 0 else 0.5,
                })
        
        return pd.DataFrame(features) if features else pd.DataFrame()