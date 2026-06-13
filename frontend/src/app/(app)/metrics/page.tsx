"use client"

import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import SectionHeader from "@/components/ui/SectionHeader"
import { metricsAPI, recoveryAPI } from "@/lib/api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function MetricsPage() {
  const [metricForm, setMetricForm] = useState({ date: new Date().toISOString().split("T")[0], weight_kg: 75, body_fat_pct: 15 })
  const [recoveryForm, setRecoveryForm] = useState({ date: new Date().toISOString().split("T")[0], sleep_hours: 8, stress_level: 3, recovery_score: 7 })
  const [metrics, setMetrics] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    metricsAPI.list({ days: 60 }).then(r => setMetrics(r.data)).catch(console.error)
  }, [])

  const saveMetric = async () => {
    setSaving(true)
    try {
      const res = await metricsAPI.log(metricForm)
      setMetrics(prev => [...prev, res.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const saveRecovery = async () => {
    setSaving(true)
    try {
      await recoveryAPI.log(recoveryForm)
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  return (
    <AppLayout>
      <SectionHeader title="Body Metrics" subtitle="Track weight, body fat, sleep, and recovery" />

      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Log Body Metrics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Date</label>
              <input type="date" value={metricForm.date} onChange={e => setMetricForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Weight (kg)</label>
                <input type="number" step="0.1" value={metricForm.weight_kg}
                  onChange={e => setMetricForm(f => ({ ...f, weight_kg: +e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Body Fat %</label>
                <input type="number" step="0.1" value={metricForm.body_fat_pct}
                  onChange={e => setMetricForm(f => ({ ...f, body_fat_pct: +e.target.value }))}
                  className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
              </div>
            </div>
            <button onClick={saveMetric} disabled={saving}
              className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40">
              {saving ? "Saving..." : "Save Metrics"}
            </button>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Log Recovery</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Date</label>
              <input type="date" value={recoveryForm.date} onChange={e => setRecoveryForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            {[
              { label: "Sleep Hours", key: "sleep_hours", min: 0, max: 12, step: 0.5 },
              { label: "Stress Level (1–10)", key: "stress_level", min: 1, max: 10, step: 1 },
              { label: "Recovery Score (1–10)", key: "recovery_score", min: 1, max: 10, step: 0.5 },
            ].map(({ label, key, min, max, step }) => (
              <div key={key}>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-widest">{label}</label>
                  <span className="text-xs text-white/60">{(recoveryForm as any)[key]}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={(recoveryForm as any)[key]}
                  onChange={e => setRecoveryForm(f => ({ ...f, [key]: +e.target.value }))}
                  className="w-full accent-white" />
              </div>
            ))}
            <button onClick={saveRecovery} disabled={saving}
              className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40">
              {saving ? "Saving..." : "Save Recovery"}
            </button>
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      {metrics.length > 0 && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Weight History</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="weight_kg" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} dot={{ fill: "rgba(255,255,255,0.4)", r: 2 }} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </AppLayout>
  )
}