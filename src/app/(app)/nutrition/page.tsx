"use client"

import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import SectionHeader from "@/components/ui/SectionHeader"
import { nutritionAPI, NutritionLog } from "@/lib/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const DEFAULT: NutritionLog = {
  date: new Date().toISOString().split("T")[0],
  calories: 2500, protein_g: 180, carbs_g: 280, fats_g: 80,
}

export default function NutritionPage() {
  const [form, setForm] = useState<NutritionLog>(DEFAULT)
  const [logs, setLogs] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    nutritionAPI.list({ days: 14 }).then(r => setLogs(r.data)).catch(console.error)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await nutritionAPI.log(form)
      setLogs(prev => [res.data, ...prev])
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  const macroCalories = form.protein_g * 4 + form.carbs_g * 4 + form.fats_g * 9
  const macros = [
    { name: "Protein", value: form.protein_g, cal: form.protein_g * 4, color: "rgba(255,255,255,0.8)" },
    { name: "Carbs", value: form.carbs_g, cal: form.carbs_g * 4, color: "rgba(255,255,255,0.4)" },
    { name: "Fats", value: form.fats_g, cal: form.fats_g * 9, color: "rgba(255,255,255,0.2)" },
  ]

  return (
    <AppLayout>
      <SectionHeader title="Nutrition Tracking" subtitle="Daily macros and calorie intake" />

      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="col-span-1 bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Log Today</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
            </div>
            {[
              { label: "Calories (kcal)", key: "calories", step: 50 },
              { label: "Protein (g)", key: "protein_g", step: 5 },
              { label: "Carbs (g)", key: "carbs_g", step: 10 },
              { label: "Fats (g)", key: "fats_g", step: 5 },
            ].map(({ label, key, step }) => (
              <div key={key}>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">{label}</label>
                <input type="number" step={step} value={(form as any)[key]} onChange={e => set(key, +e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
              </div>
            ))}

            {/* Macro Breakdown */}
            <div className="bg-white/3 rounded p-3 space-y-2">
              {macros.map(m => (
                <div key={m.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">{m.name}</span>
                    <span className="text-white/60">{m.value}g · {m.cal} kcal</span>
                  </div>
                  <div className="h-0.5 bg-white/8 rounded">
                    <div className="h-full rounded transition-all" style={{ width: `${Math.min(100, m.cal / macroCalories * 100)}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full bg-white text-black py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40">
              {saving ? "Saving..." : "Save Log"}
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Calorie History (14 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...logs].reverse()}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="calories" fill="rgba(255,255,255,0.15)" radius={[2, 2, 0, 0]} name="Calories" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-5 space-y-2">
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center gap-4 px-3 py-2 rounded border border-white/6">
                <span className="text-xs text-white/30 w-24">{log.date}</span>
                <span className="text-xs text-white">{log.calories} kcal</span>
                <span className="text-xs text-white/40">P: {log.protein_g}g</span>
                <span className="text-xs text-white/40">C: {log.carbs_g}g</span>
                <span className="text-xs text-white/40">F: {log.fats_g}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}