"use client"

import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import SectionHeader from "@/components/ui/SectionHeader"
import { workoutAPI, WorkoutLog } from "@/lib/api"

const EXERCISES = [
  "Bench Press", "Squat", "Deadlift", "Overhead Press", "Pull Ups",
  "Barbell Row", "Incline Press", "Leg Press", "Romanian Deadlift",
  "Dips", "Lat Pulldown", "Cable Row", "Bicep Curl", "Tricep Pushdown",
]

const DEFAULT_FORM: WorkoutLog = {
  exercise_name: "Bench Press",
  weight_kg: 80,
  reps: 5,
  sets: 5,
  rpe: 8,
  date: new Date().toISOString().split("T")[0],
  notes: "",
}

export default function WorkoutsPage() {
  const [form, setForm] = useState<WorkoutLog>(DEFAULT_FORM)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    setLoading(true)
    workoutAPI.list({ limit: 50 }).then(r => setLogs(r.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await workoutAPI.log(form)
      setLogs(prev => [res.data, ...prev])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    await workoutAPI.delete(id)
    setLogs(prev => prev.filter(l => l.id !== id))
  }

  const estimate1RM = (w: number, r: number) => +(w * (1 + r / 30)).toFixed(1)

  return (
    <AppLayout>
      <SectionHeader title="Log Workout" subtitle="Track your sets, reps, and progressive overload" />

      <div className="grid grid-cols-3 gap-6">
        {/* Form */}
        <div className="col-span-1 bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">New Entry</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Exercise</label>
              <select value={form.exercise_name} onChange={e => set("exercise_name", e.target.value)}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors">
                {EXERCISES.map(ex => <option key={ex} value={ex} className="bg-black">{ex}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Weight (kg)", key: "weight_kg" },
                { label: "Reps", key: "reps" },
                { label: "Sets", key: "sets" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">{label}</label>
                  <input type="number" value={(form as any)[key]} onChange={e => set(key, +e.target.value)}
                    className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">RPE (1–10)</label>
              <input type="range" min="1" max="10" step="0.5" value={form.rpe}
                onChange={e => set("rpe", +e.target.value)}
                className="w-full accent-white" />
              <div className="flex justify-between text-xs text-white/30 mt-1">
                <span>Easy</span>
                <span className="text-white font-medium">{form.rpe}</span>
                <span>Max</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Notes</label>
              <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                placeholder="Optional notes..." />
            </div>

            {/* 1RM Preview */}
            <div className="bg-white/4 rounded p-3">
              <p className="text-xs text-white/40">Estimated 1RM</p>
              <p className="text-xl font-light text-white mt-1">{estimate1RM(form.weight_kg, form.reps)} kg</p>
            </div>

            <button onClick={handleSave} disabled={saving}
              className={`w-full py-3 rounded text-sm font-medium transition-all ${success ? "bg-white/20 text-white/60" : "bg-white text-black hover:bg-white/90"} disabled:opacity-40`}>
              {success ? "✓ Saved" : saving ? "Saving..." : "Log Workout"}
            </button>
          </div>
        </div>

        {/* History */}
        <div className="col-span-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-6">Recent Sessions</h2>
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-white/4 rounded animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-white/20 text-sm">No workouts logged yet</p>
              <p className="text-white/10 text-xs mt-1">Log your first session to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-4 px-4 py-3 rounded border border-white/6 hover:border-white/12 transition-colors group">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{log.exercise_name}</p>
                    <p className="text-xs text-white/35 mt-0.5">{log.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">{log.weight_kg} kg × {log.reps} reps × {log.sets} sets</p>
                    <p className="text-xs text-white/30 mt-0.5">
                      1RM ≈ {estimate1RM(log.weight_kg, log.reps)} kg
                      {log.rpe && ` · RPE ${log.rpe}`}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(log.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white/60 ml-2 text-lg leading-none">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}