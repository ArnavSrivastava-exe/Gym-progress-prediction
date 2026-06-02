"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { removeToken } from "@/lib/auth"
import {
  LayoutDashboard,
  Dumbbell,
  TrendingUp,
  Brain,
  Activity,
  Apple,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/predictions", label: "Predictions", icon: Brain },
  { href: "/metrics", label: "Body Metrics", icon: Activity },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/recommendations", label: "Recommendations", icon: Zap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    removeToken()
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-52 bg-black border-r border-white/8 flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 border border-white/60 flex items-center justify-center">
            <div className="w-3 h-0.5 bg-white" />
          </div>
          <span className="text-xs font-semibold tracking-[0.2em] text-white/80 uppercase">
            Gym Analytics
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-150 group ${
                active
                  ? "bg-white/8 text-white border-r border-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/4"
              }`}
            >
              <Icon size={15} className={active ? "text-white" : "text-white/40 group-hover:text-white/60"} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-white/8">
        <div className="mb-3 px-1">
          <p className="text-xs text-white/60 font-medium">Athlete</p>
          <p className="text-xs text-white/30 mt-0.5">Level: Intermediate</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors px-1 py-1"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
