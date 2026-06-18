"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function WorkoutsPage() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [exerciseSearch, setExerciseSearch] = useState("")
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false)
  const [formData, setFormData] = useState({
    exercise_name: "",
    weight_kg: "",
    reps: "",
    sets: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Comprehensive exercise list - sorted alphabetically
  const allExercises = [
    "Assisted Pull Ups",
    "Barbell Curl",
    "Barbell Flat Bench Press",
    "Barbell Row",
    "Bench Press",
    "Bicep Curl",
    "Cable Bar Overhead Extension",
    "Cable Bicep Curl",
    "Cable Curl",
    "Cable Fly",
    "Cable Row",
    "Calf Raise",
    "Chest Dips",
    "Chest Supported T Bar Row Close",
    "Chest Supported T Bar Row Wide",
    "Close Grip Bench",
    "Close Grip Chest Supported T Bar Row",
    "Close Grip Lat Pulldown",
    "Close Grip Shrugs",
    "Decline Situps",
    "Deadlift",
    "Dumbbell Bench Press",
    "Dumbbell Curl",
    "Dumbbell Row",
    "Dumbbell Shoulder Press",
    "EZ Bar Preacher Curl",
    "Face Pulls",
    "Flat Bench Press",
    "Flat Dumbbell Press",
    "Front Raise",
    "Front Squat",
    "Full Up",
    "Hack Squat",
    "Hammer Curl",
    "Handle Wide Grip Lat Pulldown",
    "High to Low Cable Fly",
    "Incline Bench Press",
    "Incline Dumbbell Press",
    "Incline Smith Bench Press",
    "Lat Pulldown",
    "Lateral Raise",
    "Leg Curl",
    "Leg Extension",
    "Leg Press",
    "Machine Crunch",
    "Mid Cable Fly",
    "Overhead Press",
    "Pec Fly",
    "Ped Fly",
    "Pull Ups",
    "Push Press",
    "Reverse Fly",
    "Romanian Deadlift",
    "Rope Pushdown",
    "Seal Row",
    "Shrugs",
    "Single Arm Dumbbell Preacher Curl",
    "Skull Crushers",
    "Smith Machine Incline Bench Press",
    "Squat",
    "Sumo Deadlift",
    "T Row",
    "Trap Bar Deadlift",
    "Tricep Dips",
    "Tricep Overhead Extension",
    "Tricep Pushdown",
    "Tricep Rod Pushdown",
    "Tricep Rod Pushdowns",
    "Wide Grip Chest Supported T Bar Row",
    "Wide Grip Lat Pulldown",
    "Wide Grip Shrugs",
  ].sort()

  // Filter exercises based on search
  const filteredExercises = allExercises.filter((ex) =>
    ex.toLowerCase().includes(exerciseSearch.toLowerCase())
  )

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await api.get("/workouts")
      setWorkouts(response.data)
    } catch (err) {
      console.error("Error fetching workouts:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (workoutId: number) => {
    if (!confirm("Are you sure you want to delete this workout?")) return

    try {
      await api.delete(`/workouts/${workoutId}`)
      fetchWorkouts()
    } catch (err) {
      console.error("Error deleting workout:", err)
      alert("Failed to delete workout")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted!", formData)

    if (!formData.exercise_name) {
      alert("❌ Please select an exercise")
      return
    }
    if (!formData.weight_kg) {
      alert("❌ Please enter weight")
      return
    }
    if (!formData.reps) {
      alert("❌ Please enter reps")
      return
    }
    if (!formData.sets) {
      alert("❌ Please enter sets")
      return
    }

    try {
      const payload = {
        exercise_name: formData.exercise_name,
        weight_kg: parseFloat(formData.weight_kg),
        reps: parseInt(formData.reps),
        sets: parseInt(formData.sets),
        date: formData.date,
      }

      console.log("Sending payload:", payload)
      await api.post("/workouts", payload)
      console.log("Success!")

      setFormData({
        exercise_name: "",
        weight_kg: "",
        reps: "",
        sets: "",
        date: new Date().toISOString().split("T")[0],
      })
      setExerciseSearch("")

      await fetchWorkouts()
      alert("✅ Workout logged successfully!")
    } catch (err: any) {
      console.error("ERROR:", err)
      alert(`❌ Failed: ${err.response?.data?.detail || err.message}`)
    }
  }

  return (
    <div style={{ background: "#000", color: "white", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "50px" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>
            💪 Gym Analytics
          </p>
          <h1 style={{ fontSize: "40px", fontWeight: "700", margin: "0", color: "white" }}>Log Workouts</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: "8px 0 0 0" }}>Track your strength progress</p>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px" }}>
          {/* LEFT: Form */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "24px", color: "white" }}>Log New Workout</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Exercise - Searchable */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  Exercise
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search exercises... (e.g., 'pr' for preacher curl)"
                    value={formData.exercise_name || exerciseSearch}
                    onChange={(e) => {
                      setFormData({ ...formData, exercise_name: e.target.value })
                      setExerciseSearch(e.target.value)
                      setShowExerciseDropdown(true)
                    }}
                    onFocus={() => setShowExerciseDropdown(true)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "14px",
                      boxSizing: "border-box",
                    }}
                  />
                  {showExerciseDropdown && filteredExercises.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "rgba(0,0,0,0.9)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {filteredExercises.map((ex) => (
                        <div
                          key={ex}
                          onClick={() => {
                            setFormData({ ...formData, exercise_name: ex })
                            setShowExerciseDropdown(false)
                            setExerciseSearch("")
                          }}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: "rgba(255,255,255,0.8)",
                            transition: "all 0.2s ease",
                          }}
                          onMouseOver={(e) => {
                            ;(e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.1)"
                            ;(e.currentTarget as HTMLDivElement).style.color = "white"
                          }}
                          onMouseOut={(e) => {
                            ;(e.currentTarget as HTMLDivElement).style.background = "transparent"
                            ;(e.currentTarget as HTMLDivElement).style.color = "rgba(255,255,255,0.8)"
                          }}
                        >
                          {ex}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  placeholder="e.g., 100"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Reps */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  Reps
                </label>
                <input
                  type="number"
                  value={formData.reps}
                  onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                  placeholder="e.g., 8"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Sets */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  Sets
                </label>
                <input
                  type="number"
                  value={formData.sets}
                  onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                  placeholder="e.g., 4"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Date */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginTop: "12px",
                }}
                onMouseOver={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)"
                }}
                onMouseOut={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"
                }}
              >
                Log Workout
              </button>

              {/* Back to Dashboard Button */}
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(100,150,255,0.1)",
                  border: "1px solid rgba(100,150,255,0.2)",
                  borderRadius: "8px",
                  color: "#6496ff",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginTop: "8px",
                }}
                onMouseOver={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(100,150,255,0.15)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,150,255,0.3)"
                }}
                onMouseOut={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(100,150,255,0.1)"
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,150,255,0.2)"
                }}
              >
                ← Back to Dashboard
              </button>
            </form>
          </div>

          {/* RIGHT: Recent Workouts */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "24px", color: "white" }}>Recent Workouts</h2>

            {loading ? (
              <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px 0" }}>Loading...</p>
            ) : workouts.length === 0 ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "40px 20px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0" }}>No workouts logged yet</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>Log your first workout to get started</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "600px", overflowY: "auto" }}>
                {workouts.map((workout, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                        <h3 style={{ fontSize: "14px", fontWeight: "600", margin: "0", color: "white" }}>{workout.exercise_name}</h3>
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                          {workout.date ? (
                            typeof workout.date === "string" && workout.date.includes("T")
                              ? new Date(workout.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                              : workout.date
                          ) : "N/A"}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0" }}>
                        {workout.weight_kg} kg × {workout.reps} reps × {workout.sets} sets
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      style={{
                        padding: "8px 12px",
                        background: "rgba(255,100,100,0.1)",
                        border: "1px solid rgba(255,100,100,0.2)",
                        borderRadius: "6px",
                        color: "#ff6464",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        marginLeft: "12px",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseOver={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,100,100,0.2)"
                      }}
                      onMouseOut={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,100,100,0.1)"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}