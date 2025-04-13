"use client"
import { useState } from "react"
import { AirConditioner } from "@/components/devices/air-conditioner"
import { Television } from "@/components/devices/television"
import { Lighting } from "@/components/devices/lighting"
import { Dashboard } from "@/components/devices/dashboard"
import { AirVent, Tv, Lightbulb, LayoutDashboard, LogOut, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// デバイスの状態を定義する型
export interface DeviceState {
  id: string
  name: string
  power: boolean
}

export interface AirconState extends DeviceState {
  temperature: number
  mode: string
}

export interface TvState extends DeviceState {
  volume: number
  channel: number
}

export interface LightState extends DeviceState {
  brightness: number
  mode: string
}

export interface DeviceStates {
  aircons: AirconState[]
  tvs: TvState[]
  lights: LightState[]
}

// デバイスの順序を定義
const deviceOrder = ["dashboard", "aircon", "tv", "light"] as const
type DeviceType = (typeof deviceOrder)[number]

interface HomeControlProps {
  onLogout: () => void
}

export default function HomeControl({ onLogout }: HomeControlProps) {
  const [activeDevice, setActiveDevice] = useState<DeviceType>("aircon")
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false)

  // 各デバイスタイプの現在選択されているデバイスのインデックス
  const [activeAirconIndex, setActiveAirconIndex] = useState(0)
  const [activeTvIndex, setActiveTvIndex] = useState(0)
  const [activeLightIndex, setActiveLightIndex] = useState(0)

  // 全デバイスの状態を管理
  const [deviceStates, setDeviceStates] = useState<DeviceStates>({
    aircons: [
      {
        id: "aircon-1",
        name: "リビング",
        power: true,
        temperature: 24,
        mode: "cool",
      },
    ],
    tvs: [
      {
        id: "tv-1",
        name: "リビング",
        power: true,
        volume: 30,
        channel: 1,
      },
    ],
    lights: [
      {
        id: "light-1",
        name: "リビング",
        power: true,
        brightness: 60,
        mode: "normal",
      },
    ],
  })

  // デバイス切り替え
  const handleDeviceChange = (device: DeviceType) => {
    if (device === activeDevice) return
    setActiveDevice(device)
  }

  // 新しいエアコンを追加
  const addNewAircon = () => {
    const newId = `aircon-${deviceStates.aircons.length + 1}`
    const newName = `エアコン ${deviceStates.aircons.length + 1}`

    setDeviceStates((prev) => ({
      ...prev,
      aircons: [
        ...prev.aircons,
        {
          id: newId,
          name: newName,
          power: false,
          temperature: 25,
          mode: "cool",
        },
      ],
    }))

    // 新しく追加したデバイスを選択
    setActiveAirconIndex(deviceStates.aircons.length)
  }

  // 新しいテレビを追加
  const addNewTv = () => {
    const newId = `tv-${deviceStates.tvs.length + 1}`
    const newName = `テレビ ${deviceStates.tvs.length + 1}`

    setDeviceStates((prev) => ({
      ...prev,
      tvs: [
        ...prev.tvs,
        {
          id: newId,
          name: newName,
          power: false,
          volume: 20,
          channel: 1,
        },
      ],
    }))

    // 新しく追加したデバイスを選択
    setActiveTvIndex(deviceStates.tvs.length)
  }

  // 新しい照明を追加
  const addNewLight = () => {
    const newId = `light-${deviceStates.lights.length + 1}`
    const newName = `照明 ${deviceStates.lights.length + 1}`

    setDeviceStates((prev) => ({
      ...prev,
      lights: [
        ...prev.lights,
        {
          id: newId,
          name: newName,
          power: false,
          brightness: 50,
          mode: "normal",
        },
      ],
    }))

    // 新しく追加したデバイスを選択
    setActiveLightIndex(deviceStates.lights.length)
  }

  // エアコンの状態更新
  const updateAircon = (index: number, state: Partial<AirconState>) => {
    setDeviceStates((prev) => {
      const newAircons = [...prev.aircons]
      newAircons[index] = { ...newAircons[index], ...state }
      return { ...prev, aircons: newAircons }
    })
  }

  // テレビの状態更新
  const updateTv = (index: number, state: Partial<TvState>) => {
    setDeviceStates((prev) => {
      const newTvs = [...prev.tvs]
      newTvs[index] = { ...newTvs[index], ...state }
      return { ...prev, tvs: newTvs }
    })
  }

  // 照明の状態更新
  const updateLight = (index: number, state: Partial<LightState>) => {
    setDeviceStates((prev) => {
      const newLights = [...prev.lights]
      newLights[index] = { ...newLights[index], ...state }
      return { ...prev, lights: newLights }
    })
  }

  // 現在選択中のエアコン
  const currentAircon = deviceStates.aircons[activeAirconIndex] || deviceStates.aircons[0]

  // 現在選択中のテレビ
  const currentTv = deviceStates.tvs[activeTvIndex] || deviceStates.tvs[0]

  // 現在選択中の照明
  const currentLight = deviceStates.lights[activeLightIndex] || deviceStates.lights[0]

  // サイドバーに表示するメニュー項目
  const menuItems = [
    {
      id: "dashboard",
      name: "監視画面",
      icon: LayoutDashboard,
      color: "from-gray-600 to-gray-500",
      shadowColor: "shadow-gray-500/20",
    },
    {
      id: "aircon",
      name: "エアコン",
      icon: AirVent,
      color: "from-blue-600 to-blue-500",
      shadowColor: "shadow-blue-500/20",
    },
    {
      id: "tv",
      name: "テレビ",
      icon: Tv,
      color: "from-purple-600 to-purple-500",
      shadowColor: "shadow-purple-500/20",
    },
    {
      id: "light",
      name: "照明",
      icon: Lightbulb,
      color: "from-amber-600 to-amber-500",
      shadowColor: "shadow-amber-500/20",
    },
  ]

  // サイドバーの開閉を切り替える
  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed)
  }

  return (
    <>
      {/* サイドバー */}
      <div
        className={`bg-card flex flex-col border-r border-border transition-all duration-300 ease-in-out ${
          isMenuCollapsed ? "w-[70px]" : "w-[240px]"
        }`}
      >
        {/* ヘッダー - 固定 */}
        <div className="p-3 border-b border-border flex items-center justify-between">
          {!isMenuCollapsed && <h2 className="text-lg font-medium">ホームコントロール</h2>}
          <button
            onClick={toggleMenu}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
          >
            {isMenuCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* メニュー - スクロール可能 */}
        <div
          className="flex-1 overflow-y-auto p-3"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--accent) var(--card)" }}
        >
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.id} className="space-y-1">
                <button
                  className={`w-full ${isMenuCollapsed ? "p-3" : "p-4"} flex items-center rounded-xl transition-all duration-300 ${
                    activeDevice === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg ${item.shadowColor}`
                      : "bg-background text-foreground hover:bg-accent"
                  }`}
                  onClick={() => handleDeviceChange(item.id as DeviceType)}
                  title={isMenuCollapsed ? item.name : ""}
                >
                  <div
                    className={`${isMenuCollapsed ? "w-6 h-6" : "w-8 h-8"} rounded-full flex items-center justify-center ${
                      !isMenuCollapsed && "mr-3"
                    } ${activeDevice === item.id ? "bg-white/20" : "bg-card"}`}
                  >
                    <item.icon className={`${isMenuCollapsed ? "w-3 h-3" : "w-4 h-4"}`} />
                  </div>
                  {!isMenuCollapsed && <span>{item.name}</span>}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* フッター - 固定 */}
        <div className="p-3 border-t border-border">
          <button
            onClick={onLogout}
            className={`w-full ${isMenuCollapsed ? "p-3" : "p-4"} flex items-center rounded-xl bg-background text-foreground hover:bg-accent transition-all duration-300`}
            title={isMenuCollapsed ? "ログアウト" : ""}
          >
            <div
              className={`${isMenuCollapsed ? "w-6 h-6" : "w-8 h-8"} rounded-full bg-card flex items-center justify-center ${!isMenuCollapsed && "mr-3"}`}
            >
              <LogOut className={`${isMenuCollapsed ? "w-3 h-3" : "w-4 h-4"}`} />
            </div>
            {!isMenuCollapsed && <span>ログアウト</span>}
          </button>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 bg-background flex flex-col relative overflow-hidden">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {/* モバイル用メニューボタン */}
              {isMenuCollapsed && (
                <button
                  onClick={toggleMenu}
                  className="mr-3 w-8 h-8 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors md:hidden"
                >
                  <Menu className="w-4 h-4" />
                </button>
              )}

              <h2 className="text-xl font-medium">
                {activeDevice === "dashboard" && "監視画面"}
                {activeDevice === "aircon" && "エアコン"}
                {activeDevice === "tv" && "テレビ"}
                {activeDevice === "light" && "照明"}
              </h2>

              {activeDevice !== "dashboard" && (
                <div className="flex items-center ml-4 overflow-x-auto hide-scrollbar">
                  {activeDevice === "aircon" && (
                    <div className="flex space-x-2">
                      {deviceStates.aircons.map((aircon, index) => (
                        <button
                          key={aircon.id}
                          onClick={() => setActiveAirconIndex(index)}
                          className={`px-3 py-1 text-sm rounded-full ${
                            index === activeAirconIndex
                              ? "bg-blue-500 text-white"
                              : "bg-card text-foreground hover:bg-accent"
                          }`}
                        >
                          {aircon.name}
                        </button>
                      ))}
                      <button
                        onClick={addNewAircon}
                        className="px-3 py-1 text-sm rounded-full bg-card text-foreground hover:bg-accent"
                      >
                        + 追加
                      </button>
                    </div>
                  )}

                  {activeDevice === "tv" && (
                    <div className="flex space-x-2">
                      {deviceStates.tvs.map((tv, index) => (
                        <button
                          key={tv.id}
                          onClick={() => setActiveTvIndex(index)}
                          className={`px-3 py-1 text-sm rounded-full ${
                            index === activeTvIndex
                              ? "bg-purple-500 text-white"
                              : "bg-card text-foreground hover:bg-accent"
                          }`}
                        >
                          {tv.name}
                        </button>
                      ))}
                      <button
                        onClick={addNewTv}
                        className="px-3 py-1 text-sm rounded-full bg-card text-foreground hover:bg-accent"
                      >
                        + 追加
                      </button>
                    </div>
                  )}

                  {activeDevice === "light" && (
                    <div className="flex space-x-2">
                      {deviceStates.lights.map((light, index) => (
                        <button
                          key={light.id}
                          onClick={() => setActiveLightIndex(index)}
                          className={`px-3 py-1 text-sm rounded-full ${
                            index === activeLightIndex
                              ? "bg-amber-500 text-white"
                              : "bg-card text-foreground hover:bg-accent"
                          }`}
                        >
                          {light.name}
                        </button>
                      ))}
                      <button
                        onClick={addNewLight}
                        className="px-3 py-1 text-sm rounded-full bg-card text-foreground hover:bg-accent"
                      >
                        + 追加
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* テーマ切り替えボタン */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </div>

          {/* コンテンツエリア */}
          <div className="flex-1 flex overflow-hidden">
            {activeDevice === "dashboard" && (
              <Dashboard
                deviceStates={deviceStates}
                updateAircon={updateAircon}
                updateTv={updateTv}
                updateLight={updateLight}
              />
            )}
            {activeDevice === "aircon" && (
              <AirConditioner state={currentAircon} updateState={(state) => updateAircon(activeAirconIndex, state)} />
            )}
            {activeDevice === "tv" && (
              <Television state={currentTv} updateState={(state) => updateTv(activeTvIndex, state)} />
            )}
            {activeDevice === "light" && (
              <Lighting state={currentLight} updateState={(state) => updateLight(activeLightIndex, state)} />
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
