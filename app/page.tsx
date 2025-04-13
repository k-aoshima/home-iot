"use client"
import { useState, useEffect } from "react"
import HomeControl from "@/components/home-control"
import Login from "@/components/login"

export default function Home() {
  // ログイン状態を管理
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ローカルストレージからログイン状態を復元
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn")
    if (storedLoginState === "true") {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  // ログイン処理
  const handleLogin = (username: string, password: string) => {
    // 簡易的な認証（実際のアプリでは適切な認証システムを使用してください）
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true)
      localStorage.setItem("isLoggedIn", "true")
      return true
    }
    return false
  }

  // ログアウト処理
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("isLoggedIn")
  }

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-xl">読み込み中...</div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-[1200px] mx-auto relative z-10 flex h-[440px] rounded-xl overflow-hidden shadow-lg border border-border">
        {isLoggedIn ? <HomeControl onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
      </div>
    </main>
  )
}
