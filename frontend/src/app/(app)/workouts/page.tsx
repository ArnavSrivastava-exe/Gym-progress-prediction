"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function WorkoutsPage() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<string[]>([])
  const [formData, setFormData] = useState({
    exercise_name: "",
    weight_kg: "",
    reps: "",
    sets: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    fetchWorkouts()
    fetchExercises()
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

  const fetchExercises = async () => {
    try {
      const response = await api.get("/workouts/exercises")
      setExercises(response.data.exercises)
    } catch (err) {
      console.error("Error fetching exercises:", err)
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
      const response = await api.post("/workouts", payload)
      console.log("Success!", response.data)

      setFormData({
        exercise_name: "",
        weight_kg: "",
        reps: "",
        sets: "",
        date: new Date().toISOString().split("T")[0],
      })
      
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
              {/* Exercise */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "white" }}>
                  Exercise
                </label>
                <select
                  value={formData.exercise_name}
                  onChange={(e) => setFormData({ ...formData, exercise_name: e.target.value })}
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
                >
                  <option value="">Select an exercise...</option>
                  {exercises.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
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
                  ;(e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"
                  ;(e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)"
                }}
                onMouseOut={(e) => {
                  ;(e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"
                  ;(e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"
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
                  ;(e.target as HTMLButtonElement).style.background = "rgba(100,150,255,0.15)"
                  ;(e.target as HTMLButtonElement).style.borderColor = "rgba(100,150,255,0.3)"
                }}
                onMouseOut={(e) => {
                  ;(e.target as HTMLButtonElement).style.background = "rgba(100,150,255,0.1)"
                  ;(e.target as HTMLButtonElement).style.borderColor = "rgba(100,150,255,0.2)"
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
                        ;(e.target as HTMLButtonElement).style.background = "rgba(255,100,100,0.2)"
                      }}
                      onMouseOut={(e) => {
                        ;(e.target as HTMLButtonElement).style.background = "rgba(255,100,100,0.1)"
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