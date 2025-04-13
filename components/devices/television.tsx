"use client"

import { useState, useEffect } from "react"
import { Power, Tv } from "lucide-react"
import { CircularControl } from "@/components/circular-control"
import type { TvState } from "@/components/home-control"

interface TelevisionProps {
  state: TvState
  updateState: (state: Partial<TvState>) => void
}

export function Television({ state, updateState }: TelevisionProps) {
  // ローカルステートを親から渡された状態で初期化
  const [power, setPower] = useState(state.power)
  const [volume, setVolume] = useState(state.volume)
  const [channel, setChannel] = useState(state.channel)

  // 親コンポーネントから渡された状態が変更されたら、ローカルステートを更新
  useEffect(() => {
    setPower(state.power)
    setVolume(state.volume)
    setChannel(state.channel)
  }, [state])

  const handlePowerToggle = () => {
    const newPower = !power
    setPower(newPower)
    updateState({ power: newPower })
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    updateState({ volume: value })
  }

  const handleChannelChange = (value: number) => {
    // チャンネルの範囲を1-100に制限
    if (value >= 1 && value <= 100) {
      setChannel(value)
      updateState({ channel: value })
    }
  }

  return (
    <div className="w-full h-full flex items-center">
      {/* 左側：音量コントロール（円形コントロールに統一） */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-72 h-72">
          {/* 円形コントロール */}
          <CircularControl
            value={volume}
            minValue={0}
            maxValue={100}
            onChange={handleVolumeChange}
            color="#9333ea"
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
            <span className="text-6xl font-light">{volume}</span>
            <span className="text-sm text-muted-foreground mt-2">音量</span>
          </div>

          {/* 調整ボタン */}
          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors z-20"
            onClick={() => handleVolumeChange(Math.max(0, volume - 5))}
            disabled={!power}
          >
            <span className="text-xl">-</span>
          </button>
          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors z-20"
            onClick={() => handleVolumeChange(Math.min(100, volume + 5))}
            disabled={!power}
          >
            <span className="text-xl">+</span>
          </button>
        </div>

        <div className="mt-6 flex items-center">
          <span className="text-sm text-muted-foreground mr-2">0</span>
          <div className="w-32 h-1 bg-muted rounded-full relative">
            <div className="absolute top-0 left-0 h-1 bg-purple-500 rounded-full" style={{ width: `${volume}%` }}></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">100</span>
        </div>
      </div>

      {/* 右側：チャンネルと電源 */}
      <div className="w-[240px] flex flex-col">
        <div className="mb-8">
          <h3 className="text-lg mb-4">チャンネル</h3>

          <div className="grid grid-cols-1 gap-3">
            {/* チャンネル表示 */}
            <div className="bg-card p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mr-3">
                  <Tv className="w-4 h-4 text-muted-foreground" />
                </div>
                <span>現在</span>
              </div>
              <span className="text-xl font-light">{channel}</span>
            </div>

            {/* チャンネル調整 */}
            <div className="flex items-center justify-between gap-3">
              <button
                className="flex-1 py-3 rounded-xl bg-card flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-50"
                onClick={() => handleChannelChange(channel - 1)}
                disabled={!power || channel <= 1}
              >
                <span className="text-xl">-</span>
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-card flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-50"
                onClick={() => handleChannelChange(channel + 1)}
                disabled={!power || channel >= 100}
              >
                <span className="text-xl">+</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-center">
          <button
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              power
                ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
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
