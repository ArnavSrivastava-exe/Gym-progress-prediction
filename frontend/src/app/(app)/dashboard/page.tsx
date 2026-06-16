"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function DashboardPage() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/ml/dashboard-summary")
        setDashboardData(response.data)
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", paddingTop: "50px" }}>
        Loading...
      </div>
    )
  }

  // LOCKED STATE - Show when < 7 workouts
  if (dashboardData?.unlocked === false || dashboardData?.locked === true) {
    return (
      <div style={{ background: "#000", color: "white", minHeight: "100vh", padding: "30px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0" }}>💪 GYM ANALYTICS</p>
                <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0", color: "white", marginTop: "8px" }}>
                  GYM PROGRESS PREDICTION SYSTEM
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>Predict. Analyze. Optimize.</p>
              </div>
            </div>
          </div>

          {/* LOCKED MESSAGE */}
          <div
            style={{
              background: "#000",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "12px",
              padding: "60px 40px",
              textAlign: "center",
              marginTop: "60px",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔒</div>
            <h2 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 16px 0", color: "white" }}>Insights Locked</h2>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", margin: "0 0 32px 0" }}>
              Start logging your workouts to unlock personalized insights and AI-powered predictions!
            </p>

            {/* Progress */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "24px", marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: "0 0 12px 0", textTransform: "uppercase" }}>
                Progress
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      height: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        background: "linear-gradient(90deg, #4ade80, #3b82f6)",
                        height: "100%",
                        width: `${((dashboardData?.unique_dates_logged || dashboardData?.total_workouts || 0) / 7) * 100}%`,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "white", minWidth: "80px" }}>
                  {(dashboardData?.unique_dates_logged || dashboardData?.total_workouts || 0)} / 7
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "12px 0 0 0" }}>
                {dashboardData?.workouts_needed || 7} more workouts needed
              </p>
            </div>

            {/* What Unlocks */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "24px", marginBottom: "32px" }}>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: "0 0 16px 0", textTransform: "uppercase" }}>
                What You'll Get
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>Progress Charts</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0" }}>Track trends over time</p>
                </div>
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤖</div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>AI Predictions</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0" }}>Future performance</p>
                </div>
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>💡</div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>Smart Tips</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0" }}>Personalized advice</p>
                </div>
                <div>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚠️</div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>Plateau Detection</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0" }}>Stay ahead of stalls</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/workouts")}
              style={{
                padding: "16px 32px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) => {
                ;(e.target as HTMLButtonElement).style.transform = "scale(1.05)"
              }}
              onMouseOut={(e) => {
                ;(e.target as HTMLButtonElement).style.transform = "scale(1)"
              }}
            >
              Start Logging Workouts →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div style={{ color: "white", textAlign: "center", paddingTop: "50px" }}>
        No data available
      </div>
    )
  }

  // UNLOCKED STATE - Show full dashboard
  const strengthData = [
    { month: "Jan", actual: 80, predicted: 82 },
    { month: "Feb", actual: 85, predicted: 87 },
    { month: "Mar", actual: 90, predicted: 92 },
    { month: "Apr", actual: 95, predicted: 98 },
    { month: "May", actual: 100, predicted: 103 },
    { month: "Jun", actual: 105, predicted: 108 },
    { month: "Jul", actual: 110, predicted: 113 },
    { month: "Aug", actual: 115, predicted: 127.5 },
  ]

  const bodyFatData = [
    { month: "Jan", actual: 20, predicted: 19.5 },
    { month: "Feb", actual: 19.5, predicted: 19 },
    { month: "Mar", actual: 19, predicted: 18.5 },
    { month: "Apr", actual: 18, predicted: 17.5 },
    { month: "May", actual: 17, predicted: 16.5 },
    { month: "Jun", actual: 16, predicted: 15.5 },
    { month: "Jul", actual: 15, predicted: 14.5 },
    { month: "Aug", actual: 13.2, predicted: 13.2 },
  ]

  const volumeData = [
    { week: "Apr 27", volume: 1200 },
    { week: "May 4", volume: 1450 },
    { week: "May 11", volume: 1350 },
    { week: "May 18", volume: 1600 },
    { week: "May 25", volume: 1400 },
    { week: "Jun 1", volume: 1700 },
    { week: "Jun 8", volume: 1550 },
    { week: "Jun 15", volume: 1400 },
  ]

  const recommendations = [
    { title: "Increase Volume", desc: "Add 1-2 sets for compound lifts (Bench, Squat, Deadlift)", priority: "High" },
    { title: "Increase Intensity", desc: "Add 2.5 - 5 kg to your working sets", priority: "Medium" },
    { title: "Deload in 5 Weeks", desc: "Take a deload week to optimize recovery", priority: "Low" },
  ]

  return (
    <div style={{ background: "#000", color: "white", minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0" }}>💪 GYM ANALYTICS</p>
              <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "0", color: "white", marginTop: "8px" }}>
                GYM PROGRESS PREDICTION SYSTEM
              </h1>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0 0" }}>Predict. Analyze. Optimize.</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0" }}>Today</p>
              <p style={{ fontSize: "18px", color: "white", fontWeight: "600", margin: "4px 0" }}>
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Top Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "20px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>Total Workouts</p>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "white" }}>{dashboardData.total_workouts || 0}</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>Logged</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "20px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>Total Volume</p>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "white" }}>{dashboardData.total_volume_kg?.toFixed(0) || 0}</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>kg</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "20px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>Avg Sleep</p>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "white" }}>{dashboardData.avg_sleep_hours?.toFixed(1) || 0}</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>hours</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "20px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>Body Fat</p>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "white" }}>{dashboardData.body_fat_pct?.toFixed(1) || 0}%</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>Current</p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "20px" }}>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>Strength Index</p>
            <p style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "white" }}>{dashboardData.strength_index?.toFixed(1) || 0}</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "4px 0 0 0" }}>Score</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          {/* Strength Progression */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "white" }}>STRENGTH PROGRESSION</h3>
            <div style={{ marginBottom: "16px" }}>
              <select style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px 12px", borderRadius: "4px", fontSize: "13px" }}>
                <option>Bench Press (1RM)</option>
                <option>Squat (1RM)</option>
                <option>Deadlift (1RM)</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.4)" dataKey="month" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.5)" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Plateau Risk */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "white" }}>PLATEAU RISK</h3>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div style={{ position: "relative", width: "150px", height: "150px" }}>
                <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#4ade80" strokeWidth="20" strokeDasharray="56.5 282.7" strokeLinecap="round" transform="rotate(-90 100 100)" />
                </svg>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
                  <p style={{ fontSize: "28px", fontWeight: "700", margin: "0", color: "#4ade80" }}>{dashboardData.plateau_risk}</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "4px 0 0 0" }}>Risk Level</p>
                </div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "12px" }}>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 8px 0", textTransform: "uppercase" }}>Confidence: {((dashboardData.plateau_confidence || 0) * 100).toFixed(0)}%</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "0 0 12px 0" }}>Factors:</p>
              <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                {dashboardData.plateau_factors?.map((factor: string, idx: number) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations & Top Lifts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          {/* Recommendations */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "white" }}>RECOMMENDED ADJUSTMENTS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(dashboardData.recommendations || []).map((rec: any, idx: number) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "600", margin: "0", color: "white" }}>{rec.title}</h4>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: rec.priority === "High" ? "rgba(255,100,100,0.2)" : rec.priority === "Medium" ? "rgba(255,180,100,0.2)" : "rgba(100,150,255,0.2)",
                        color: rec.priority === "High" ? "#ff6464" : rec.priority === "Medium" ? "#ffb464" : "#6496ff",
                      }}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0" }}>{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Lifts */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 20px 0", color: "white" }}>TOP LIFTS</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(dashboardData.top_lifts || []).map((lift: any, idx: number) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.5)", minWidth: "20px" }}>{idx + 1}.</span>
                    <span style={{ fontSize: "13px", color: "white" }}>{lift.name}</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#4ade80" }}>↑ {lift.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "30px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: "0 0 8px 0" }}>🧠 Powered by Machine Learning</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "0" }}>Models: XGBoost, LSTM, Time Series Forecasting</p>
        </div>
      </div>
    </div>
  )
}