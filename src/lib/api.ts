import axios from "axios"
import Cookies from "js-cookie"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("access_token")
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data: RegisterPayload) => api.post("/auth/register", data),
  login: (data: LoginPayload) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  updateProfile: (data: Partial<UserProfile>) => api.put("/auth/profile", data),
}

// Workouts
export const workoutAPI = {
  log: (data: WorkoutLog) => api.post("/workouts", data),
  list: (params?: { limit?: number; offset?: number }) => api.get("/workouts", { params }),
  delete: (id: number) => api.delete(`/workouts/${id}`),
  getExercises: () => api.get("/workouts/exercises"),
}

// Nutrition
export const nutritionAPI = {
  log: (data: NutritionLog) => api.post("/nutrition", data),
  list: (params?: { days?: number }) => api.get("/nutrition", { params }),
}

// Body Metrics
export const metricsAPI = {
  log: (data: BodyMetrics) => api.post("/metrics", data),
  list: (params?: { days?: number }) => api.get("/metrics", { params }),
}

// Recovery
export const recoveryAPI = {
  log: (data: RecoveryLog) => api.post("/recovery", data),
  list: (params?: { days?: number }) => api.get("/recovery", { params }),
}

// ML Predictions
export const mlAPI = {
  strengthPrediction: (exercise: string) => api.get(`/ml/strength-prediction?exercise=${exercise}`),
  bodyWeightPrediction: () => api.get("/ml/bodyweight-prediction"),
  bodyFatPrediction: () => api.get("/ml/bodyfat-prediction"),
  plateauDetection: () => api.get("/ml/plateau-detection"),
  recommendations: () => api.get("/ml/recommendations"),
  dashboard: () => api.get("/ml/dashboard-summary"),
}

// Types
export interface RegisterPayload {
  email: string
  password: string
  full_name: string
  age: number
  gender: string
  height_cm: number
  weight_kg: number
  body_fat_pct: number
  training_experience: string
  goal: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface UserProfile {
  full_name: string
  age: number
  gender: string
  height_cm: number
  weight_kg: number
  body_fat_pct: number
  training_experience: string
  goal: string
}

export interface WorkoutLog {
  exercise_name: string
  weight_kg: number
  reps: number
  sets: number
  rpe?: number
  date: string
  notes?: string
}

export interface NutritionLog {
  date: string
  calories: number
  protein_g: number
  carbs_g: number
  fats_g: number
}

export interface BodyMetrics {
  date: string
  weight_kg: number
  body_fat_pct?: number
}

export interface RecoveryLog {
  date: string
  sleep_hours: number
  stress_level: number
  recovery_score: number
}