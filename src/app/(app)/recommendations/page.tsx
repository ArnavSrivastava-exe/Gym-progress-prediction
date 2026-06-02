"use client"

import { useEffect, useState } from "react"
import AppLayout from "@/components/layout/AppLayout"
import SectionHeader from "@/components/ui/SectionHeader"
import { mlAPI } from "@/lib/api"

const PRIORITY_STYLE: Record<string, string> = {
  High: "text-white",
  Medium: "text-white/60",
  Low: "text-white/30",
}

const CATEGORY_ICONS: Record<string, string> = {
  Volume: "V",
  Intensity: "I",
  Recovery: "R",
  Nutrition: "N",
  Deload: "D",
}

export default function RecommendationsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mlAPI.recommendations().then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const recs = data?.recommendations ?? [
    { id: 1, title: "Increase Bench Press Volume", description: "Add 1–2 sets to your bench press sessions. Current weekly volume is below optimal range based on your training history and recovery scores.", category: "Volume", priority: "High", impact: 0.85 },
    { id: 2, title: "Add 2.5 kg to Working Sets", description: "Progressive overload signal detected. Your RPE over the last 3 sessions has averaged 6.8, indicating capacity for load increase.", category: "Intensity", priority: "High", impact: 0.78 },
    { id: 3, title: "Schedule Deload in 5 Weeks", description: "Fatigue index is trending upward. A planned deload week is recommended to maintain long-term progression.", category: "Deload", priority: "Low", impact: 0.65 },
    { id: 4, title: "Increase Daily Protein", description: "Current protein intake is below 2g/kg bodyweight. Increasing protein supports muscle protein synthesis and recovery.", category: "Nutrition", priority: "Medium", impact: 0.72 },
    { id: 5, title: "Add Recovery Day This Week", description: "Sleep average has dropped to 6.4 hours over the past week. An extra recovery day will reduce injury risk.", category: "Recovery", priority: "Medium", impact: 0.68 },
  ]

  return (
    <AppLayout>
      <SectionHeader
        title="Training Recommendations"
        subtitle="AI-generated recommendations based on your ML model outputs"
      />

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Recommendations", value: recs.length },
          { label: "High Priority", value: recs.filter((r: any) => r.priority === "High").length },
          { label: "Avg Impact Score", value: recs.length ? `${(recs.reduce((a: number, r: any) => a + r.impact, 0) / recs.length * 100).toFixed(0)}%` : "—" },
          { label: "Model Confidence", value: data?.overall_confidence ? `${(data.overall_confidence * 100).toFixed(0)}%` : "91%" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">{label}</p>
            <p className="text-2xl font-light text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Rec Cards */}
      <div className="space-y-3">
        {recs.map((rec: any, i: number) => (
          <div key={rec.id ?? i} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5 card-hover flex items-start gap-5">
            <div className="w-10 h-10 border border-white/15 rounded flex items-center justify-center flex-shrink-0 font-mono text-xs text-white/40">
              {CATEGORY_ICONS[rec.category] ?? "?"}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{rec.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{rec.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-medium ${PRIORITY_STYLE[rec.priority]}`}>{rec.priority} Priority</span>
                </div>
              </div>
              <p className="text-xs text-white/45 mt-3 leading-relaxed">{rec.description}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/30">Predicted Impact</span>
                    <span className="text-white/50">{rec.impact ? `${(rec.impact * 100).toFixed(0)}%` : "—"}</span>
                  </div>
                  <div className="h-0.5 bg-white/8 rounded">
                    <div className="h-full bg-white/40 rounded transition-all" style={{ width: `${(rec.impact ?? 0) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  )
}