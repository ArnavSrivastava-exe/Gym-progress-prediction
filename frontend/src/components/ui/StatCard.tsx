interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}

export default function StatCard({ label, value, sub, trend, trendValue }: StatCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5 card-hover">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-3">{label}</p>
      <p className="text-2xl font-light text-white">{value}</p>
      {(sub || trendValue) && (
        <div className="mt-2 flex items-center gap-2">
          {trendValue && (
            <span className={`text-xs ${
              trend === "up" ? "text-white/70" :
              trend === "down" ? "text-white/40" :
              "text-white/50"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {trendValue}
            </span>
          )}
          {sub && <span className="text-xs text-white/30">{sub}</span>}
        </div>
      )}
    </div>
  )
}