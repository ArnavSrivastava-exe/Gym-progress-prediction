"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authAPI } from "@/lib/api"
import { setToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      setToken(res.data.access_token)
      router.push("/dashboard")
    } catch (err: any) {
      const detail = err.response?.data?.detail
      let errorMsg = "Invalid credentials. Is the backend running?"
      
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
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            Welcome back
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>
            Sign in to your analytics dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="athlete@example.com"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
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
              }}
            >
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "8px" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            marginTop: "32px",
          }}
        >
          No account?{" "}
          <Link href="/register" style={{ color: "rgba(255,255,255,0.5)" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}