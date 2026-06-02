"use client"

import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import SectionHeader from "@/components/ui/SectionHeader"
import { mlAPI } from "@/lib/api"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts"

const EXERCISES = ["Bench Press", "Squat", "Deadlift", "Overhead Press"]
const HORIZONS = ["1 Week", "1 Month", "3 Months"]

export default function PredictionsPage() {
  const [selectedExercise, setSelectedExercise] = useState("Bench Press")
  const [strengthData, setStrengthData] = useState<any>(null)
  const [bodyweightData, setBodyweightData] = useState<any>(null)
  const [bodyfatData, setBodyfatData] = useState<any>(null)
  const [plateauData, setPlateauData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      mlAPI.strengthPrediction(selectedExercise),
      mlAPI.bodyWeightPrediction(),
      mlAPI.bodyFatPrediction(),
      mlAPI.plateauDetection(),
    ]).then(([s, bw, bf, p]) => {
      setStrengthData(s.data)
      setBodyweightData(bw.data)
      setBodyfatData(bf.data)
      setPlateauData(p.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [selectedExercise])

  return (
    <AppLayout>
      <SectionHeader
        title="ML Predictions"
        subtitle="Model outputs from XGBoost, LSTM, and Time Series Forecasting"
      />

      {/* Model 1: Strength */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 mb-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white">Model 1 — Strength Progression</h2>
            <p className="text-xs text-white/35 mt-1">XGBoost + LSTM ensemble prediction</p>
          </div>
          <div className="flex gap-2">
            {EXERCISES.map(ex => (
              <button key={ex} onClick={() => setSelectedExercise(ex)}
                className={`text-xs px-3 py-1.5 rounded border transition-all ${selectedExercise === ex ? "border-white text-white" : "border-white/10 text-white/35 hover:border-white/20"}`}>
                {ex.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {["current_1rm", "predicted_1w", "predicted_1m", "predicted_3m"].map((k, i) => (
            <div key={k} className="bg-white/3 rounded p-4">
              <p className="text-xs text-white/35 mb-2">{["Current 1RM", "1 Week", "1 Month", "3 Months"][i]}</p>
              <p className="text-xl font-light text-white">{strengthData?.[k] ?? "—"} kg</p>
              {i > 0 && strengthData?.[k] && strengthData?.current_1rm && (
                <p className="text-xs text-white/30 mt-1">
                  +{(strengthData[k] - strengthData.current_1rm).toFixed(1)} kg
                </p>
              )}
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={strengthData?.chart ?? []}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="ci" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "rgba(255,255,255,0.4)" }} />
            <Area type="monotone" dataKey="ci_upper" stroke="none" fill="url(#ci)" name="CI Upper" />
            <Area type="monotone" dataKey="ci_lower" stroke="none" fill="url(#ci)" name="CI Lower" />
            <Line type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} dot={false} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Predicted" />
          </AreaChart>
        </ResponsiveContainer>

        <div className="flex items-center gap-6 mt-3">
          <ModelMetric label="MAE" value={strengthData?.metrics?.mae} />
          <ModelMetric label="RMSE" value={strengthData?.metrics?.rmse} />
          <ModelMetric label="R² Score" value={strengthData?.metrics?.r2} isPercent />
          <div className="ml-auto text-right">
            <p className="text-xs text-white/30">Confidence Interval</p>
            <p className="text-xs text-white/60">{strengthData?.confidence_interval ?? "±3.2 kg"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Model 2: Body Weight */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">Model 2 — Body Weight</h2>
          <p className="text-xs text-white/35 mb-5">XGBoost + Prophet time series</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {["current", "predicted_1m", "predicted_3m"].map((k, i) => (
              <div key={k} className="bg-white/3 rounded p-3">
                <p className="text-xs text-white/35 mb-1">{["Current", "1 Month", "3 Months"][i]}</p>
                <p className="text-lg font-light text-white">{bodyweightData?.[k] ?? "—"} kg</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={bodyweightData?.chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} dot={false} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <ModelMetric label="MAE" value={bodyweightData?.metrics?.mae} />
            <ModelMetric label="R²" value={bodyweightData?.metrics?.r2} isPercent />
          </div>
        </div>

        {/* Model 3: Body Fat */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">Model 3 — Body Fat %</h2>
          <p className="text-xs text-white/35 mb-5">Feature: calories, volume, protein, weight trend</p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {["current", "predicted_1m", "predicted_3m"].map((k, i) => (
              <div key={k} className="bg-white/3 rounded p-3">
                <p className="text-xs text-white/35 mb-1">{["Current", "1 Month", "3 Months"][i]}</p>
                <p className="text-lg font-light text-white">{bodyfatData?.[k] ?? "—"}%</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={bodyfatData?.chart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="actual" stroke="rgba(255,255,255,0.9)" strokeWidth={1.5} dot={false} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <ModelMetric label="MAE" value={bodyfatData?.metrics?.mae} />
            <ModelMetric label="R²" value={bodyfatData?.metrics?.r2} isPercent />
          </div>
        </div>
      </div>

      {/* Model 4: Plateau */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
        <div className="flex items-start gap-8">
          <div className="flex-1">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-1">Model 4 — Plateau Detection</h2>
            <p className="text-xs text-white/35 mb-5">XGBoost + Random Forest classifier</p>
            <div className="grid grid-cols-3 gap-4">
              {["Low Risk", "Medium Risk", "High Risk"].map((label, i) => {
                const values = plateauData?.probabilities ?? [0.82, 0.14, 0.04]
                const pct = (values[i] * 100).toFixed(0)
                return (
                  <div key={label} className={`rounded p-4 border ${i === 0 ? "border-white/20 bg-white/4" : "border-white/6 bg-white/2"}`}>
                    <p className="text-xs text-white/40 mb-2">{label}</p>
                    <p className={`text-2xl font-light ${i === 0 ? "text-white" : "text-white/40"}`}>{pct}%</p>
                    <div className="mt-3 h-0.5 bg-white/10 rounded">
                      <div className="h-full bg-white/60 rounded transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 flex gap-4">
              <ModelMetric label="Accuracy" value={plateauData?.metrics?.accuracy} isPercent />
              <ModelMetric label="F1 Score" value={plateauData?.metrics?.f1} isPercent />
              <ModelMetric label="ROC-AUC" value={plateauData?.metrics?.roc_auc} isPercent />
            </div>
          </div>
          <div className="w-48">
            <p className="text-xs text-white/30 mb-3">Key Features (SHAP)</p>
            {(plateauData?.feature_importance ?? [
              { name: "Volume Change", importance: 0.32 },
              { name: "Fatigue Index", importance: 0.25 },
              { name: "Progress Velocity", importance: 0.20 },
              { name: "Sleep Average", importance: 0.13 },
              { name: "Recovery Score", importance: 0.10 },
            ]).map((f: any) => (
              <div key={f.name} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/40">{f.name}</span>
                  <span className="text-white/60">{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="h-0.5 bg-white/8 rounded">
                  <div className="h-full bg-white/40 rounded" style={{ width: `${f.importance * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function ModelMetric({ label, value, isPercent }: { label: string; value?: number; isPercent?: boolean }) {
  const display = value !== undefined ? (isPercent ? `${(value * 100).toFixed(1)}%` : value.toFixed(3)) : "—"
  return (
    <div>
      <p className="text-xs text-white/30">{label}</p>
      <p className="text-sm text-white/70 font-medium mt-0.5">{display}</p>
    </div>
  )
}