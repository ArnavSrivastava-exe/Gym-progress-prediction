"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authAPI } from "@/lib/api"
import { setToken } from "@/lib/auth"

const GOALS = ["Fat Loss", "Muscle Gain", "Strength Gain", "Recomposition", "Maintenance"]
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Elite"]
const GENDERS = ["Male", "Female", "Other"]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    age: 20,
    gender: "Male",
    height_cm: 175,
    weight_kg: 75,
    body_fat_pct: 15,
    training_experience: "Intermediate",
    goal: "Muscle Gain",
  })

  const setField = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      setToken(res.data.access_token)
      router.push("/dashboard")
    } catch (err: any) {
      const detail = err.response?.data?.detail
      let errorMsg = "Registration failed. Is the backend running?"
      
      if (Array.isArray(detail)) {
        errorMsg = detail[0]?.msg || "Validation error"
      } else if (typeof detail === "string") {
        errorMsg = detail
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Gym Analytics
          </p>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "#ffffff",
              textShadow: "0 0 40px rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            Create account
          </h1>

          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>
            Step {step} of 2
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255,60,60,0.06)",
              border: "1px solid rgba(255,60,60,0.15)",
              borderRadius: "6px",
              padding: "10px 14px",
              fontSize: "12px",
              color: "rgba(255,120,120,0.9)",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setField("full_name", e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="athlete@example.com"
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button className="btn-primary" onClick={() => setStep(2)} disabled={!form.email || !form.password || !form.full_name}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label>Age</label>
              <input type="number" value={form.age} onChange={(e) => setField("age", Number(e.target.value))} />
            </div>

            <div>
              <label>Gender</label>
              <select value={form.gender} onChange={(e) => setField("gender", e.target.value)}>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Height cm</label>
              <input type="number" value={form.height_cm} onChange={(e) => setField("height_cm", Number(e.target.value))} />
            </div>

            <div>
              <label>Weight kg</label>
              <input type="number" value={form.weight_kg} onChange={(e) => setField("weight_kg", Number(e.target.value))} />
            </div>

            <div>
              <label>Body Fat %</label>
              <input type="number" value={form.body_fat_pct} onChange={(e) => setField("body_fat_pct", Number(e.target.value))} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost" onClick={() => setStep(1)}>
                Back
              </button>

              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "30px", fontSize: "12px" }}>
          Have account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}