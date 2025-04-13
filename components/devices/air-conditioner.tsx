"use client"

import { useState, useEffect } from "react"
import { Snowflake, Fan, Droplets, Power, Flame } from "lucide-react"
import { CircularControl } from "@/components/circular-control"
import type { AirconState } from "@/components/home-control"

interface AirConditionerProps {
  state: AirconState
  updateState: (state: Partial<AirconState>) => void
}

export function AirConditioner({ state, updateState }: AirConditionerProps) {
  // ローカルステートを親から渡された状態で初期化
  const [power, setPower] = useState(state.power)
  const [temperature, setTemperature] = useState(state.temperature)
  const [mode, setMode] = useState(state.mode)

  // 親コンポーネントから渡された状態が変更されたら、ローカルステートを更新
  useEffect(() => {
    setPower(state.power)
    setTemperature(state.temperature)
    setMode(state.mode)
  }, [state])

  const handlePowerToggle = () => {
    const newPower = !power
    setPower(newPower)
    updateState({ power: newPower })
  }

  const handleTemperatureChange = (value: number) => {
    if (value >= 16 && value <= 30) {
      setTemperature(value)
      updateState({ temperature: value })
    }
  }

  const handleModeChange = (newMode: string) => {
    setMode(newMode)
    updateState({ mode: newMode })
  }

  // モードの定義
  const modes = [
    { id: "cool", name: "冷房", icon: Snowflake, color: "from-blue-600 to-blue-500", bgColor: "bg-white/20" },
    { id: "heat", name: "暖房", icon: Flame, color: "from-red-600 to-red-500", bgColor: "bg-white/20" },
    { id: "fan", name: "送風", icon: Fan, color: "from-blue-600 to-blue-500", bgColor: "bg-white/20" },
    { id: "dry", name: "除湿", icon: Droplets, color: "from-blue-600 to-blue-500", bgColor: "bg-white/20" },
  ]

  return (
    <div className="w-full h-full flex items-center">
      {/* 左側：温度コントロール */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-72 h-72">
          {/* 円形コントロール */}
          <CircularControl
            value={temperature}
            minValue={16}
            maxValue={30}
            onChange={handleTemperatureChange}
            color={mode === "heat" ? "#ef4444" : "#3b82f6"}
            disabled={!power}
            size={288}
          />

          {/* 内側の円 - 位置調整 */}
          <div
            className="absolute inset-[32px] rounded-full bg-card flex items-center justify-center flex-col"
            style={{
              boxShadow: "inset 0 4px 8px rgba(0,0,0,0.1)",
              pointerEvents: "none", // クリックイベントを下層に通過させる
            }}
          >
            <span className="text-6xl font-light">{temperature}°</span>
            <span className="text-sm text-muted-foreground mt-2">温度設定</span>
          </div>

          {/* 調整ボタン */}
          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors z-20"
            onClick={() => handleTemperatureChange(temperature - 1)}
            disabled={!power}
          >
            <span className="text-xl">-</span>
          </button>
          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors z-20"
            onClick={() => handleTemperatureChange(temperature + 1)}
            disabled={!power}
          >
            <span className="text-xl">+</span>
          </button>
        </div>

        <div className="mt-6 flex items-center">
          <span className="text-sm text-muted-foreground mr-2">16°</span>
          <div className="w-32 h-1 bg-muted rounded-full relative">
            <div
              className={`absolute top-0 left-0 h-1 rounded-full ${mode === "heat" ? "bg-red-500" : "bg-blue-500"}`}
              style={{ width: `${((temperature - 16) / 14) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">30°</span>
        </div>
      </div>

      {/* 右側：モードと電源 */}
      <div className="w-[240px] flex flex-col">
        <div className="mb-8">
          <h3 className="text-lg mb-4">モード</h3>

          {/* 縦スクロール可能なモードリスト - 監視画面と同じスクロールスタイルに変更 */}
          <div
            className="overflow-y-auto max-h-[200px] pr-2"
            style={{ scrollbarWidth: "thin", scrollbarColor: "var(--accent) var(--card)" }}
          >
            <div className="grid grid-flow-row gap-3">
              {modes.map((modeItem) => {
                const Icon = modeItem.icon
                const isActive = mode === modeItem.id
                const gradientColor = modeItem.id === "heat" ? "from-red-600 to-red-500" : "from-blue-600 to-blue-500"

                return (
                  <button
                    key={modeItem.id}
                    className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${gradientColor} text-white shadow-md`
                        : "bg-card text-foreground hover:bg-accent"
                    }`}
                    onClick={() => handleModeChange(modeItem.id)}
                    disabled={!power}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        isActive ? modeItem.bgColor : "bg-background"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{modeItem.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-center">
          <button
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              power
                ? mode === "heat"
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                  : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
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
