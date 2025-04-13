"use client"
import { useState } from "react"
import type { DeviceStates, AirconState, TvState, LightState } from "@/components/home-control"
import { AirVent, Tv, Lightbulb, Power, Snowflake, Fan, Droplets, Flame, ChevronRight, ChevronLeft } from "lucide-react"

interface DashboardProps {
  deviceStates: DeviceStates
  updateAircon: (index: number, state: Partial<AirconState>) => void
  updateTv: (index: number, state: Partial<TvState>) => void
  updateLight: (index: number, state: Partial<LightState>) => void
}

export function Dashboard({ deviceStates, updateAircon, updateTv, updateLight }: DashboardProps) {
  // タブ管理
  const [activeTab, setActiveTab] = useState<"all" | "aircon" | "tv" | "light">("all")

  // スクロール位置管理
  const [scrollPosition, setScrollPosition] = useState(0)

  // すべてのデバイスがオンかどうかを確認
  const allDevicesOn =
    deviceStates.aircons.every((a) => a.power) &&
    deviceStates.tvs.every((t) => t.power) &&
    deviceStates.lights.every((l) => l.power)

  // 一括電源制御
  const toggleAllPower = () => {
    // 現在の状態の反対に設定
    const newPowerState = !allDevicesOn

    // すべてのエアコンの電源を切り替え
    deviceStates.aircons.forEach((_, index) => {
      updateAircon(index, { power: newPowerState })
    })

    // すべてのテレビの電源を切り替え
    deviceStates.tvs.forEach((_, index) => {
      updateTv(index, { power: newPowerState })
    })

    // すべての照明の電源を切り替え
    deviceStates.lights.forEach((_, index) => {
      updateLight(index, { power: newPowerState })
    })
  }

  // モードに応じたアイコンを取得する関数
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "cool":
        return <Snowflake className="w-4 h-4" />
      case "heat":
        return <Flame className="w-4 h-4" />
      case "fan":
        return <Fan className="w-4 h-4" />
      case "dry":
        return <Droplets className="w-4 h-4" />
      default:
        return <Snowflake className="w-4 h-4" />
    }
  }

  // モード名を取得する関数
  const getModeName = (mode: string) => {
    switch (mode) {
      case "cool":
        return "冷房"
      case "heat":
        return "暖房"
      case "fan":
        return "送風"
      case "dry":
        return "除湿"
      case "normal":
        return "通常"
      case "night":
        return "夜間"
      default:
        return mode
    }
  }

  // スクロール処理
  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("dashboard-scroll-container")
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300
      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      setScrollPosition(container.scrollLeft + scrollAmount)
    }
  }

  // 表示するデバイスをフィルタリング
  const getFilteredDevices = () => {
    if (activeTab === "all")
      return { aircons: deviceStates.aircons, tvs: deviceStates.tvs, lights: deviceStates.lights }
    if (activeTab === "aircon") return { aircons: deviceStates.aircons, tvs: [], lights: [] }
    if (activeTab === "tv") return { aircons: [], tvs: deviceStates.tvs, lights: [] }
    if (activeTab === "light") return { aircons: [], tvs: [], lights: deviceStates.lights }
    return { aircons: [], tvs: [], lights: [] }
  }

  const filteredDevices = getFilteredDevices()

  return (
    <div className="w-full h-full flex flex-col">
      {/* ヘッダー: タブとコントロール */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === "all" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setActiveTab("aircon")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === "aircon" ? "bg-blue-500 text-white" : "bg-card hover:bg-accent"
            }`}
          >
            エアコン
          </button>
          <button
            onClick={() => setActiveTab("tv")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === "tv" ? "bg-purple-500 text-white" : "bg-card hover:bg-accent"
            }`}
          >
            テレビ
          </button>
          <button
            onClick={() => setActiveTab("light")}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activeTab === "light" ? "bg-amber-500 text-white" : "bg-card hover:bg-accent"
            }`}
          >
            照明
          </button>
        </div>

        <button
          onClick={toggleAllPower}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            allDevicesOn
              ? "bg-gradient-to-r from-gray-600 to-gray-500 text-white"
              : "bg-card text-foreground border border-border hover:bg-accent"
          }`}
        >
          <Power className="w-4 h-4" />
          <span className="text-sm">{allDevicesOn ? "すべてOFF" : "すべてON"}</span>
        </button>
      </div>

      {/* スクロールコントロール */}
      <div className="relative flex-1">
        {/* 左スクロールボタン */}
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md border border-border"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* 右スクロールボタン */}
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-md border border-border"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* スクロール可能なコンテナ */}
        <div
          id="dashboard-scroll-container"
          className="flex-1 overflow-x-auto hide-scrollbar h-full"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex space-x-4 px-4 h-full">
            {/* エアコンカード */}
            {filteredDevices.aircons.map((aircon, index) => (
              <div
                key={aircon.id}
                className="flex-shrink-0 w-[280px] bg-card rounded-xl border border-border shadow-sm overflow-hidden h-full flex flex-col"
              >
                {/* カードヘッダー */}
                <div className="bg-blue-500/10 p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        aircon.power ? (aircon.mode === "heat" ? "bg-red-500/20" : "bg-blue-500/20") : "bg-muted"
                      }`}
                    >
                      <AirVent
                        className={`w-5 h-5 ${
                          aircon.power
                            ? aircon.mode === "heat"
                              ? "text-red-500"
                              : "text-blue-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{aircon.name}</h3>
                      <p
                        className={`text-xs ${
                          aircon.power
                            ? aircon.mode === "heat"
                              ? "text-red-500"
                              : "text-blue-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {aircon.power ? getModeName(aircon.mode) : "オフ"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateAircon(index, { power: !aircon.power })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      aircon.power
                        ? aircon.mode === "heat"
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                          : "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </div>

                {/* カードコンテンツ */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="text-center mb-4">
                    <span className="text-5xl font-light">{aircon.temperature}°</span>
                    <p className="text-sm text-muted-foreground mt-1">設定温度</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">モード</span>
                        <div
                          className={`text-xs px-2 py-1 rounded-full flex items-center ${
                            aircon.mode === "heat" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {getModeIcon(aircon.mode)}
                          <span className="ml-1">{getModeName(aircon.mode)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-muted-foreground">温度範囲</span>
                        <span className="text-sm">16° - 30°</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full relative">
                        <div
                          className={`absolute top-0 left-0 h-2 rounded-full ${
                            aircon.mode === "heat" ? "bg-red-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${((aircon.temperature - 16) / 14) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* テレビカード */}
            {filteredDevices.tvs.map((tv, index) => (
              <div
                key={tv.id}
                className="flex-shrink-0 w-[280px] bg-card rounded-xl border border-border shadow-sm overflow-hidden h-full flex flex-col"
              >
                {/* カードヘッダー */}
                <div className="bg-purple-500/10 p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        tv.power ? "bg-purple-500/20" : "bg-muted"
                      }`}
                    >
                      <Tv className={`w-5 h-5 ${tv.power ? "text-purple-500" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{tv.name}</h3>
                      <p className={`text-xs ${tv.power ? "text-purple-500" : "text-muted-foreground"}`}>
                        {tv.power ? "オン" : "オフ"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateTv(index, { power: !tv.power })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tv.power
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </div>

                {/* カードコンテンツ */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="text-center mb-4">
                    <span className="text-5xl font-light">{tv.channel}</span>
                    <p className="text-sm text-muted-foreground mt-1">チャンネル</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">音量</span>
                      <span className="text-sm">{tv.volume}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full relative">
                      <div
                        className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full"
                        style={{ width: `${tv.volume}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 照明カード */}
            {filteredDevices.lights.map((light, index) => (
              <div
                key={light.id}
                className="flex-shrink-0 w-[280px] bg-card rounded-xl border border-border shadow-sm overflow-hidden h-full flex flex-col"
              >
                {/* カードヘッダー */}
                <div className="bg-amber-500/10 p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        light.power ? "bg-amber-500/20" : "bg-muted"
                      }`}
                    >
                      <Lightbulb className={`w-5 h-5 ${light.power ? "text-amber-500" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{light.name}</h3>
                      <p className={`text-xs ${light.power ? "text-amber-500" : "text-muted-foreground"}`}>
                        {light.power ? getModeName(light.mode) : "オフ"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateLight(index, { power: !light.power })}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      light.power
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </div>

                {/* カードコンテンツ */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="text-center mb-4">
                    <span className="text-5xl font-light">{light.brightness}%</span>
                    <p className="text-sm text-muted-foreground mt-1">明るさ</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">明るさ調整</span>
                      <span className="text-sm">{light.brightness}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full relative">
                      <div
                        className="absolute top-0 left-0 h-2 bg-amber-500 rounded-full"
                        style={{ width: `${light.brightness}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div className="flex justify-center mt-2">
        <div className="flex space-x-1">
          <div className="w-8 h-1 rounded-full bg-primary/30"></div>
          <div className="w-1 h-1 rounded-full bg-muted"></div>
          <div className="w-1 h-1 rounded-full bg-muted"></div>
        </div>
      </div>
    </div>
  )
}
