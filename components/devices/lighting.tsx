"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Power } from "lucide-react"
import { CircularControl } from "@/components/circular-control"
import type { LightState } from "@/components/home-control"

interface LightingProps {
  state: LightState
  updateState: (state: Partial<LightState>) => void
}

export function Lighting({ state, updateState }: LightingProps) {
  // ローカルステートを親から渡された状態で初期化
  const [power, setPower] = useState(state.power)
  const [brightness, setBrightness] = useState(state.brightness)
  const [mode, setMode] = useState(state.mode)

  // 親コンポーネントから渡された状態が変更されたら、ローカルステートを更新
  useEffect(() => {
    setPower(state.power)
    setBrightness(state.brightness)
    setMode(state.mode)
  }, [state])

  const handlePowerToggle = () => {
    const newPower = !power
    setPower(newPower)
    updateState({ power: newPower })
  }

  const handleBrightnessChange = (value: number) => {
    if (value >= 10 && value <= 100) {
      setBrightness(value)
      updateState({ brightness: value })
    }
  }

  const handleModeChange = (newMode: string) => {
    setMode(newMode)
    updateState({ mode: newMode })
  }

  return (
    <div className="w-full h-full flex items-center">
      {/* 左側：照明表示 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-72 h-72">
          {/* 円形コントロール */}
          <CircularControl
            value={brightness}
            minValue={10}
            maxValue={100}
            onChange={handleBrightnessChange}
            color="#f59e0b"
            disabled={!power}
            size={288}
          />

          {/* 内側の円 - 照明効果 - 位置調整 */}
          <div
            className={`absolute inset-[32px] rounded-full bg-card flex items-center justify-center flex-col overflow-hidden`}
            style={{
              boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1)",
              pointerEvents: "none", // クリックイベントを下層に通過させる
            }}
          >
            {power && (
              <div
                className="absolute inset-0 bg-gradient-to-b from-amber-400/20 to-amber-600/5"
                style={{
                  opacity: brightness / 100,
                  boxShadow: `inset 0 0 ${brightness / 2}px ${brightness / 4}px rgba(251, 191, 36, 0.${brightness / 10})`,
                }}
              ></div>
            )}
            <Sun
              className={`w-20 h-20 ${power ? "text-amber-400" : "text-muted-foreground"}`}
              style={{
                filter: power
                  ? `drop-shadow(0 0 ${brightness / 10}px rgba(251, 191, 36, 0.${brightness / 10}))`
                  : "none",
              }}
            />
            <span className="text-3xl font-light mt-2">{brightness}%</span>
          </div>

          {/* 調整ボタン */}
          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors z-20"
            onClick={() => handleBrightnessChange(Math.max(10, brightness - 5))}
            disabled={!power}
          >
            <span className="text-xl">-</span>
          </button>
          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors z-20"
            onClick={() => handleBrightnessChange(Math.min(100, brightness + 5))}
            disabled={!power}
          >
            <span className="text-xl">+</span>
          </button>
        </div>

        <div className="mt-6 flex items-center">
          <span className="text-sm text-muted-foreground mr-2">10%</span>
          <div className="w-32 h-1 bg-muted rounded-full relative">
            <div
              className="absolute top-0 left-0 h-1 bg-amber-500 rounded-full"
              style={{ width: `${((brightness - 10) / 90) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">100%</span>
        </div>
      </div>

      {/* 右側：コントロール */}
      <div className="w-[240px] flex flex-col">
        <div className="mb-8">
          <h3 className="text-lg mb-4">モード</h3>

          <div className="grid grid-cols-1 gap-3">
            <button
              className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                mode === "normal"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
              onClick={() => handleModeChange("normal")}
              disabled={!power}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  mode === "normal" ? "bg-white/20" : "bg-background"
                }`}
              >
                <Sun className="w-4 h-4" />
              </div>
              <span>通常</span>
            </button>
            <button
              className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                mode === "night"
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
              onClick={() => handleModeChange("night")}
              disabled={!power}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  mode === "night" ? "bg-white/20" : "bg-background"
                }`}
              >
                <Moon className="w-4 h-4" />
              </div>
              <span>夜間</span>
            </button>
          </div>
        </div>

        <div className="mt-auto flex justify-center">
          <button
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              power
                ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/30"
                : "bg-card text-muted-foreground border border-border"
            }`}
            onClick={handlePowerToggle}
          >
            <Power className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  )
}
