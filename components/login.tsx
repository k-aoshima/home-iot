"use client"
import { useState } from "react"
import type React from "react"

import { User, Lock, ArrowRight } from "lucide-react"

interface LoginProps {
  onLogin: (username: string, password: string) => boolean
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("ユーザー名とパスワードを入力してください")
      return
    }

    setIsLoading(true)

    // ログイン処理（少し遅延を入れてローディング状態を表示）
    setTimeout(() => {
      const success = onLogin(username, password)
      if (!success) {
        setError("ユーザー名またはパスワードが正しくありません")
        setIsLoading(false)
      }
    }, 800)
  }

  return (
    <div className="w-full flex">
      {/* 左側：ログインフォーム */}
      <div className="w-1/2 bg-card p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">ホームコントロール</h1>
            <p className="text-muted-foreground">アカウントにログインして、デバイスを管理しましょう</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1">
                  ユーザー名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background border border-input text-foreground block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ユーザー名を入力"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border border-input text-foreground block w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="パスワードを入力"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    ログイン中...
                  </div>
                ) : (
                  <div className="flex items-center">
                    ログイン
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>デモ用アカウント: admin / password</p>
          </div>
        </div>
      </div>

      {/* 右側：イメージ部分 */}
      <div className="w-1/2 bg-secondary p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-500/30"></div>
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full filter blur-xl animate-float1"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full filter blur-xl animate-float2"></div>
          <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-cyan-500/30 rounded-full filter blur-xl animate-float3"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="inline-block p-3 rounded-full bg-blue-500/20 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">スマートホーム管理</h2>
          <p className="text-secondary-foreground max-w-xs mx-auto">
            あなたの家のすべてのデバイスを一つの場所から簡単に管理できます。
          </p>
        </div>
      </div>
    </div>
  )
}
