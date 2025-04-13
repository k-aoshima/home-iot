"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // コンポーネントがマウントされた後にのみレンダリングするための対策
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground">
        <Sun className="w-4 h-4" />
      </div>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
      title={resolvedTheme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
