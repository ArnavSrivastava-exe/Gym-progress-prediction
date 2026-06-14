"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import Cookies from "js-cookie"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Step 1: Basic Info (from registration, but can update)
    // Step 2: Training History
    years_training: "",
    months_training: "",
    trained_consistently_6m: null as boolean | null,
    training_days_per_week: "",
    avg_workout_duration: "",
    training_split: "",
    plateau_last_3m: null as boolean | null,

    // Step 3: Sleep & Recovery
    sleep_hours_avg: "",
    sleep_quality_rating: "",
    daily_stress_level: "",
    water_intake_liters: "",
    recovery_rating: "",

    // Step 4: Current PRs
    bench_press_weight_kg: "",
    bench_press_reps: "",
    bench_press_sets: "",
    squat_weight_kg: "",
    squat_reps: "",
    squat_sets: "",
    deadlift_weight_kg: "",
    deadlift_reps: "",
    deadlift_sets: "",
    ohp_weight_kg: "",
    ohp_reps: "",
    ohp_sets: "",

    // Step 5: Nutrition & Lifestyle
    daily_calories: "",
    daily_protein_g: "",
    current_phase: "",
    weight_trend: "",
    steps_per_day: "",
    cardio_regular: null as boolean | null,
    cardio_sessions_per_week: "",
    cardio_type: "",
    tracks_workouts: null as boolean | null,
    workout_consistency_rating: "",
    days_willing_to_train: "",

    // Step 6: Goals
    target_weight_kg: "",
    target_body_fat_pct: "",
    target_bench_press_kg: "",
    target_squat_kg: "",
    target_deadlift_kg: "",
    target_ohp_kg: "",
  })

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setError("")
  }

  const handleBooleanChange = (key: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

const handleSubmit = async () => {
  setLoading(true)
  try {
    const parseNum = (val: string) => {
      if (!val || val === "") return null
      const num = parseFloat(val)
      return isNaN(num) ? null : num
    }

    const parseInt_safe = (val: string) => {
      if (!val || val === "") return null
      const num = parseInt(val, 10)
      return isNaN(num) ? null : num
    }

    await api.post("/auth/onboarding", formData)

    await api.post("/auth/training-metrics", {
      bench_press_weight_kg: parseNum(formData.bench_press_weight_kg),
      bench_press_reps: parseInt_safe(formData.bench_press_reps),
      bench_press_sets: parseInt_safe(formData.bench_press_sets),
      squat_weight_kg: parseNum(formData.squat_weight_kg),
      squat_reps: parseInt_safe(formData.squat_reps),
      squat_sets: parseInt_safe(formData.squat_sets),
      deadlift_weight_kg: parseNum(formData.deadlift_weight_kg),
      deadlift_reps: parseInt_safe(formData.deadlift_reps),
      deadlift_sets: parseInt_safe(formData.deadlift_sets),
      ohp_weight_kg: parseNum(formData.ohp_weight_kg),
      ohp_reps: parseInt_safe(formData.ohp_reps),
      ohp_sets: parseInt_safe(formData.ohp_sets),
    })

    await api.post("/auth/goals", {
      target_weight_kg: parseNum(formData.target_weight_kg),
      target_body_fat_pct: parseNum(formData.target_body_fat_pct),
      target_bench_press_kg: parseNum(formData.target_bench_press_kg),
      target_squat_kg: parseNum(formData.target_squat_kg),
      target_deadlift_kg: parseNum(formData.target_deadlift_kg),
      target_ohp_kg: parseNum(formData.target_ohp_kg),
    })

    router.push("/onboarding-summary")
  } catch (err: any) {
    let errorMessage = "Failed to save onboarding data"

    if (err.response?.data?.detail) {
      if (typeof err.response.data.detail === "string") {
        errorMessage = err.response.data.detail
      } else if (Array.isArray(err.response.data.detail)) {
        errorMessage = err.response.data.detail.map((e: any) => e.msg).join(", ")
      }
    }

    setError(errorMessage)
  } finally {
    setLoading(false)
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        padding: "40px 16px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Setup Your Profile
          </p>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "#ffffff",
              textShadow: "0 0 40px rgba(255,255,255,0.3)",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Step {step} of 6
          </h1>
          <div
            style={{
              width: "100%",
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              marginTop: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(step / 6) * 100}%`,
                height: "100%",
                background: "rgba(255,255,255,0.8)",
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "rgba(255,60,60,0.06)",
              border: "1px solid rgba(255,60,60,0.15)",
              borderRadius: "6px",
              padding: "12px 14px",
              fontSize: "12px",
              color: "rgba(255,120,120,0.9)",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Step 1: Training History */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>Training Background</h2>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Years of strength training</label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={formData.years_training}
                onChange={(e) => handleInputChange("years_training", e.target.value)}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>How many days per week do you train?</label>
              <input
                type="number"
                min="0"
                max="7"
                value={formData.training_days_per_week}
                onChange={(e) => handleInputChange("training_days_per_week", e.target.value)}
                placeholder="4"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Average workout duration (minutes)</label>
              <input
                type="number"
                min="15"
                max="300"
                value={formData.avg_workout_duration}
                onChange={(e) => handleInputChange("avg_workout_duration", e.target.value)}
                placeholder="60"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Training split</label>
              <select
                value={formData.training_split}
                onChange={(e) => handleInputChange("training_split", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="">Select...</option>
                <option value="Full Body">Full Body</option>
                <option value="Upper/Lower">Upper/Lower</option>
                <option value="Push/Pull/Legs">Push/Pull/Legs</option>
                <option value="Bro Split">Bro Split</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Trained consistently last 6 months?</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  onClick={() => handleBooleanChange("trained_consistently_6m", true)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.trained_consistently_6m === true ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleBooleanChange("trained_consistently_6m", false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.trained_consistently_6m === false ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Sleep & Recovery */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>Sleep & Recovery</h2>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Average sleep per night (hours)</label>
              <input
                type="number"
                min="3"
                max="12"
                step="0.5"
                value={formData.sleep_hours_avg}
                onChange={(e) => handleInputChange("sleep_hours_avg", e.target.value)}
                placeholder="7"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Sleep quality (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.sleep_quality_rating}
                onChange={(e) => handleInputChange("sleep_quality_rating", e.target.value)}
                placeholder="7"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Daily stress level (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.daily_stress_level}
                onChange={(e) => handleInputChange("daily_stress_level", e.target.value)}
                placeholder="5"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Water intake per day (liters)</label>
              <input
                type="number"
                min="0.5"
                max="10"
                step="0.5"
                value={formData.water_intake_liters}
                onChange={(e) => handleInputChange("water_intake_liters", e.target.value)}
                placeholder="2.5"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Recovery quality (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.recovery_rating}
                onChange={(e) => handleInputChange("recovery_rating", e.target.value)}
                placeholder="7"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Current PRs */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>Current Lifts (Working Weight)</h2>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>Bench Press</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.bench_press_weight_kg}
                  onChange={(e) => handleInputChange("bench_press_weight_kg", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={formData.bench_press_reps}
                  onChange={(e) => handleInputChange("bench_press_reps", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={formData.bench_press_sets}
                  onChange={(e) => handleInputChange("bench_press_sets", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>Squat</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.squat_weight_kg}
                  onChange={(e) => handleInputChange("squat_weight_kg", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={formData.squat_reps}
                  onChange={(e) => handleInputChange("squat_reps", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={formData.squat_sets}
                  onChange={(e) => handleInputChange("squat_sets", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>Deadlift</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.deadlift_weight_kg}
                  onChange={(e) => handleInputChange("deadlift_weight_kg", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={formData.deadlift_reps}
                  onChange={(e) => handleInputChange("deadlift_reps", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={formData.deadlift_sets}
                  onChange={(e) => handleInputChange("deadlift_sets", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>Overhead Press</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={formData.ohp_weight_kg}
                  onChange={(e) => handleInputChange("ohp_weight_kg", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={formData.ohp_reps}
                  onChange={(e) => handleInputChange("ohp_reps", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={formData.ohp_sets}
                  onChange={(e) => handleInputChange("ohp_sets", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Nutrition & Lifestyle */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>Nutrition & Lifestyle</h2>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Daily calorie intake</label>
              <input
                type="number"
                min="500"
                max="10000"
                value={formData.daily_calories}
                onChange={(e) => handleInputChange("daily_calories", e.target.value)}
                placeholder="2500"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Daily protein intake (grams)</label>
              <input
                type="number"
                min="20"
                max="500"
                value={formData.daily_protein_g}
                onChange={(e) => handleInputChange("daily_protein_g", e.target.value)}
                placeholder="150"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Current phase</label>
              <select
                value={formData.current_phase}
                onChange={(e) => handleInputChange("current_phase", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              >
                <option value="">Select...</option>
                <option value="Bulking">Bulking</option>
                <option value="Cutting">Cutting</option>
                <option value="Maintaining">Maintaining</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Do you perform cardio regularly?</label>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  onClick={() => handleBooleanChange("cardio_regular", true)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.cardio_regular === true ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleBooleanChange("cardio_regular", false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: formData.cardio_regular === false ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  No
                </button>
              </div>
            </div>

            {formData.cardio_regular && (
              <div>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Cardio sessions per week</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={formData.cardio_sessions_per_week}
                  onChange={(e) => handleInputChange("cardio_sessions_per_week", e.target.value)}
                  placeholder="3"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    marginTop: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Workout consistency (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.workout_consistency_rating}
                onChange={(e) => handleInputChange("workout_consistency_rating", e.target.value)}
                placeholder="8"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>
        )}

        {/* Step 5: Goals */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>Your Goals</h2>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Target body weight (kg)</label>
              <input
                type="number"
                min="30"
                max="200"
                step="0.5"
                value={formData.target_weight_kg}
                onChange={(e) => handleInputChange("target_weight_kg", e.target.value)}
                placeholder="80"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>Target body fat %</label>
              <input
                type="number"
                min="5"
                max="50"
                step="0.5"
                value={formData.target_body_fat_pct}
                onChange={(e) => handleInputChange("target_body_fat_pct", e.target.value)}
                placeholder="12"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  color: "white",
                  marginTop: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>Target Lifts (1RM)</p>

              <div>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Bench Press (kg)</label>
                <input
                  type="number"
                  value={formData.target_bench_press_kg}
                  onChange={(e) => handleInputChange("target_bench_press_kg", e.target.value)}
                  placeholder="120"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    marginTop: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Squat (kg)</label>
                <input
                  type="number"
                  value={formData.target_squat_kg}
                  onChange={(e) => handleInputChange("target_squat_kg", e.target.value)}
                  placeholder="160"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    marginTop: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Deadlift (kg)</label>
                <input
                  type="number"
                  value={formData.target_deadlift_kg}
                  onChange={(e) => handleInputChange("target_deadlift_kg", e.target.value)}
                  placeholder="200"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    marginTop: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Overhead Press (kg)</label>
                <input
                  type="number"
                  value={formData.target_ohp_kg}
                  onChange={(e) => handleInputChange("target_ohp_kg", e.target.value)}
                  placeholder="80"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    color: "white",
                    marginTop: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Summary */}
        {step === 6 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={{ fontSize: "18px", color: "white", fontWeight: "500" }}>Review Your Profile</h2>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
                You're all set! Your profile has been created with your training history, current lifts, and goals.
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
                Next, you'll log your workouts. After 7 days of consistent logging, your dashboard will unlock and show AI-powered predictions!
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                Let's get started → 💪
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "40px" }}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              flex: 1,
              padding: "12px 20px",
              background: step === 1 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              color: step === 1 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)",
              cursor: step === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Back
          </button>

          {step < 6 ? (
            <button
              onClick={handleNext}
              style={{
                flex: 1,
                padding: "12px 20px",
                background: "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "6px",
                color: "#000000",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 20px",
                background: loading ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.8)",
                border: "none",
                borderRadius: "6px",
                color: "#000000",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {loading ? "Saving..." : "Complete Setup"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}