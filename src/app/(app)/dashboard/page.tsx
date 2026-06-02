"use client"

import { useEffect, useState } from "react"
import AppLayout from "@/components/layout/AppLayout"
import StatCard from "@/components/ui/StatCard"
import SectionHeader from "@/components/ui/SectionHeader"
import { mlAPI } from "@/lib/api"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts"

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mlAPI.dashboard().then(r => setSummary(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return (
    <AppLayout>
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-4xl font-light tracking-tight text-white glow-text">Gym Progress<br />Prediction System</h1>
          <p className="text-sm text-white/35 mt-3 tracking-widest">Predict. Analyze. Optimize.</p>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <StatCard label="Total Workouts" value={summary?.total_workouts ?? "—"} sub="This Month" />
        <StatCard label="Total Volume" value={summary?.total_volume_kg ? `${(summary.total_volume_kg / 1000).toFixed(1)}K` : "—"} sub="kg" />
        <StatCard label="Avg. Sleep" value={summary?.avg_sleep_hours?.toFixed(1) ?? "—"} sub="hours" />
        <StatCard label="Body Fat" value={summary?.current_body_fat ? `${summary.current_body_fat}%` : "—"} trendValue={summary?.body_fat_delta ? `${Math.abs(summary.body_fat_delta)}% vs last month` : undefined} trend={summary?.body_fat_delta < 0 ? "up" : "down"} />
        <StatCard label="Strength Index" value={summary?.strength_index?.toFixed(1) ?? "—"} sub={summary?.strength_index >= 75 ? "Good" : "Developing"} />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Strength Chart */}
        <div className="col-span-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">Strength Progression</h2>
            <span className="text-xs text-white/30">Bench Press (1RM)</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={summary?.strength_chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
              <Line type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} dot={false} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-white/30">vs previous 3 months</p>
              <p className="text-lg font-light text-white mt-0.5">
                ↑ {summary?.strength_progress_pct?.toFixed(1) ?? "—"}%
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-white/30">Predicted 1RM</p>
              <p className="text-lg font-light text-white mt-0.5">{summary?.predicted_bench_1rm ?? "—"} kg</p>
            </div>
          </div>
        </div>

        {/* Plateau Risk */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">Plateau Risk</h2>
          <PlateauGauge risk={summary?.plateau_risk} confidence={summary?.plateau_confidence} />
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex justify-between text-xs mb-4">
              <span className="text-white/40">Confidence</span>
              <span className="text-white">{summary?.plateau_confidence ? `${(summary.plateau_confidence * 100).toFixed(0)}%` : "—"}</span>
            </div>
            <p className="text-xs text-white/30 mb-2">Factors</p>
            {(summary?.plateau_factors ?? ["Increasing training volume", "Good recovery", "Progressive overload detected"]).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="w-1 h-1 bg-white/30 rounded-full" />
                <span className="text-xs text-white/50">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Body Fat Trend */}
        <div className="col-span-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">Body Fat Trend</h2>
            <span className="text-xs text-white/30">Body Fat %</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={summary?.bodyfat_chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
              <Line type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} dot={false} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-white/30">vs previous 3 months</p>
              <p className="text-lg font-light text-white mt-0.5">↓ {Math.abs(summary?.body_fat_delta ?? 1.3).toFixed(1)}%</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-white/30">Predicted Body Fat</p>
              <p className="text-lg font-light text-white mt-0.5">{summary?.predicted_body_fat ?? "—"}%</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Recommended Adjustments</h2>
          <div className="space-y-4">
            {(summary?.recommendations ?? [
              { title: "Increase Volume", desc: "Add 1-2 sets for compound lifts", priority: "High" },
              { title: "Increase Intensity", desc: "Add 2.5–5 kg to working sets", priority: "Medium" },
              { title: "Deload in 5 Weeks", desc: "Take a deload week to optimize recovery", priority: "Low" },
            ]).map((r: any, i: number) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                <div className="w-6 h-6 border border-white/15 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-white/30 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white">{r.title}</p>
                  <p className="text-xs text-white/35 mt-0.5">{r.desc}</p>
                </div>
                <span className={`text-xs mt-0.5 ${r.priority === "High" ? "text-white" : r.priority === "Medium" ? "text-white/60" : "text-white/30"}`}>
                  {r.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Volume */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">Weekly Volume Overview</h2>
            <span className="text-xs text-white/30">All Exercises</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={summary?.weekly_volume ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
              <ReferenceLine y={summary?.optimal_volume_min} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" />
              <Bar dataKey="volume" fill="rgba(255,255,255,0.15)" radius={[2, 2, 0, 0]} name="Volume (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Lifts */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Top Lifts</h2>
          <div className="space-y-3">
            {(summary?.top_lifts ?? [
              { rank: 1, name: "Squat", progress: 15.2 },
              { rank: 2, name: "Bench Press", progress: 12.6 },
              { rank: 3, name: "Deadlift", progress: 10.8 },
              { rank: 4, name: "Overhead Press", progress: 8.4 },
              { rank: 5, name: "Pull Up", progress: 7.1 },
            ]).map((l: any) => (
              <div key={l.rank} className="flex items-center gap-3">
                <span className="text-xs text-white/25 w-4">{l.rank}.</span>
                <span className="text-xs text-white/70 flex-1">{l.name}</span>
                <span className="text-xs text-white/60">↑ {l.progress?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/20 mt-5 pt-4 border-t border-white/5">vs previous 3 months</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-white/5">
        <div className="w-4 h-4 border border-white/20 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
        </div>
        <span className="text-xs text-white/20">Powered by Machine Learning</span>
        <span className="text-white/10 mx-1">·</span>
        <span className="text-xs text-white/20">Models: XGBoost, LSTM, Time Series Forecasting</span>
      </div>
    </AppLayout>
  )
}

function PlateauGauge({ risk, confidence }: { risk?: string; confidence?: number }) {
  const riskLabel = risk ?? "LOW"
  const riskMap: Record<string, { angle: number; desc: string }> = {
    LOW: { angle: 45, desc: "You are not likely to hit a plateau in the next 4 weeks." },
    MEDIUM: { angle: 135, desc: "Moderate risk of plateau. Consider a deload soon." },
    HIGH: { angle: 225, desc: "High plateau risk detected. Deload recommended." },
  }
  const { angle, desc } = riskMap[riskLabel] ?? riskMap["LOW"]
  const r = 60
  const cx = 80, cy = 80
  const startAngle = 180
  const endAngle = startAngle + (angle / 270) * 180
  const toRad = (d: number) => (d * Math.PI) / 180
  const x = cx + r * Math.cos(toRad(endAngle))
  const y = cy + r * Math.sin(toRad(endAngle))

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x} ${y}`} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="8" strokeLinecap="round" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="18" fontWeight="300">{riskLabel}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="9">Risk Level</text>
      </svg>
      <p className="text-xs text-white/35 text-center mt-2 leading-relaxed">{desc}</p>
    </div>
  )
}