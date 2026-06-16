"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function OnboardingSummaryPage() {
  const router = useRouter()
  const [days, setDays] = useState(0)

  useEffect(() => {
    setDays(7)
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "500px", textAlign: "center" }}>
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "60px",
              marginBottom: "20px",
            }}
          >
            ✅
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "300",
              color: "#ffffff",
              textShadow: "0 0 40px rgba(255,255,255,0.3)",
              margin: 0,
              marginBottom: "16px",
            }}
          >
            You're All Set!
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: "1.6",
            }}
          >
            Your profile has been created with your training data, current lifts, and goals.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "40px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
            }}
          >
            Dashboard Unlocks In
          </p>
          <div
            style={{
              fontSize: "48px",
              fontWeight: "600",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "8px",
            }}
          >
            {days} Days
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            After 7 days of logging workouts
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "40px",
            textAlign: "left",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              color: "white",
              fontWeight: "500",
              margin: "0 0 12px 0",
            }}
          >
            What's Next?
          </h3>
          <ul
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              lineHeight: "1.8",
              margin: 0,
              paddingLeft: "20px",
            }}
          >
            <li>Log your workouts every day</li>
            <li>Track your strength progress</li>
            <li>Get AI-powered predictions</li>
            <li>Unlock your personal dashboard</li>
          </ul>
        </div>

        <button
          onClick={() => router.push("/workouts")}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "rgba(255,255,255,0.8)",
            border: "none",
            borderRadius: "6px",
            color: "#000000",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "10px",
          }}
        >
          Start Logging Workouts →
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          style={{
            width: "100%",
            padding: "14px 20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}