"use client"

import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import SectionHeader from "@/components/ui/SectionHeader"
import { authAPI } from "@/lib/api"

const GOALS = ["Fat Loss", "Muscle Gain", "Strength Gain", "Recomposition", "Maintenance"]
const EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Elite"]

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    authAPI.me().then(r => setProfile(r.data)).catch(console.error)
  }, [])

  const set = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await authAPI.updateProfile(profile)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (e) { console.error(e) } finally { setSaving(false) }
  }

  if (!profile) return (
    <AppLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-xs text-white/30 uppercase tracking-widest">Loading profile...</div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <SectionHeader title="Settings" subtitle="Manage your athlete profile and preferences" />

      <div className="grid grid-cols-2 gap-5">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Personal Info</h2>
          <div className="space-y-4">
            {[
              { label: "Full Name", key: "full_name", type: "text" },
              { label: "Email", key: "email", type: "email" },
              { label: "Age", key: "age", type: "number" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">{label}</label>
                <input type={type} value={profile[key] ?? ""} onChange={e => set(key, type === "number" ? +e.target.value : e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Gender</label>
              <select value={profile.gender ?? "Male"} onChange={e => set("gender", e.target.value)}
                className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors">
                {["Male", "Female", "Other"].map(g => <option key={g} value={g} className="bg-black">{g}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Body & Training</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Height (cm)", key: "height_cm" },
                { label: "Weight (kg)", key: "weight_kg" },
                { label: "Body Fat %", key: "body_fat_pct" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">{label}</label>
                  <input type="number" step="0.1" value={profile[key] ?? ""} onChange={e => set(key, +e.target.value)}
                    className="w-full bg-white/4 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-colors" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Training Experience</label>
              <div className="grid grid-cols-2 gap-2">
                {EXPERIENCE.map(e => (
                  <button key={e} onClick={() => set("training_experience", e)}
                    className={`py-2 rounded text-xs border transition-all ${profile.training_experience === e ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/20"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Primary Goal</label>
              <div className="grid grid-cols-2 gap-2">
                {GOALS.map(g => (
                  <button key={g} onClick={() => set("goal", g)}
                    className={`py-2 rounded text-xs border transition-all ${profile.goal === g ? "bg-white text-black border-white" : "border-white/10 text-white/40 hover:border-white/20"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button onClick={handleSave} disabled={saving}
          className={`px-8 py-3 rounded text-sm font-medium transition-all ${success ? "bg-white/20 text-white/60" : "bg-white text-black hover:bg-white/90"} disabled:opacity-40`}>
          {success ? "✓ Saved" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </AppLayout>
  )
}
