import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Gym Progress Prediction System",
  description: "ML-powered fitness analytics platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
