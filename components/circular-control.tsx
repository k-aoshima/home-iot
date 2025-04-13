"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"

interface CircularControlProps {
  value: number
  minValue: number
  maxValue: number
  onChange: (value: number) => void
  color: string
  disabled?: boolean
  size?: number
}

export function CircularControl({
  value,
  minValue,
  maxValue,
  onChange,
  color,
  disabled = false,
  size = 300,
}: CircularControlProps) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { resolvedTheme } = useTheme()

  // 円形スライダーの計算
  const range = maxValue - minValue
  const percentage = ((value - minValue) / range) * 100
  const isMax = value === maxValue // 最大値かどうかをチェック
  const radius = size * 0.38 // 円の半径を少し小さく
  const strokeWidth = 24 // 線の太さを増加

  // 角度からパスの終点を計算
  // 0度は上（12時の位置）
  const angleInDegrees = (percentage / 100) * 360
  const radians = (angleInDegrees * Math.PI) / 180
  const centerPoint = size / 2

  // 円弧の終点座標
  const endX = centerPoint + radius * Math.sin(radians)
  const endY = centerPoint - radius * Math.cos(radians)

  // SVGパスの描画用の角度計算
  const startX = centerPoint
  const startY = centerPoint - radius
  const largeArcFlag = percentage > 50 ? 1 : 0

  // 背景色の設定
  const bgColor = resolvedTheme === "dark" ? "#1A212E" : "#e5e7eb"
  const disabledColor = resolvedTheme === "dark" ? "#3A4254" : "#d1d5db"

  // マウス/タッチ位置から値を計算する関数
  const calculateValueFromPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return value

      const rect = svgRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // 中心からの角度を計算
      const dx = clientX - centerX
      const dy = centerY - clientY // Y軸は上が負なので反転

      // Math.atan2は-πからπの範囲を返す
      let angle = Math.atan2(dx, dy) * (180 / Math.PI)

      // 角度を0-360に調整
      if (angle < 0) angle += 360

      // 角度からパーセンテージ、そして値を計算
      const newPercentage = angle / 360
      const newValue = Math.round(minValue + newPercentage * range)

      // 値が範囲内にあることを確認
      return Math.max(minValue, Math.min(maxValue, newValue))
    },
    [minValue, maxValue, range, value],
  )

  // マウス移動ハンドラ
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const newValue = calculateValueFromPosition(e.clientX, e.clientY)
      onChange(newValue)
    },
    [isDragging, calculateValueFromPosition, onChange],
  )

  // タッチ移動ハンドラ
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.touches[0]
      const newValue = calculateValueFromPosition(touch.clientX, touch.clientY)
      onChange(newValue)
    },
    [isDragging, calculateValueFromPosition, onChange],
  )

  // マウスアップハンドラ
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // タッチ終了ハンドラ
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ドラッグ開始（マウス）
  const startDragMouse = (e: React.MouseEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }

  // ドラッグ開始（タッチ）
  const startDragTouch = (e: React.TouchEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }

  // クリック処理
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return
    const newValue = calculateValueFromPosition(e.clientX, e.clientY)
    onChange(newValue)
  }

  // イベントリスナーの設定と削除
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleTouchEnd)
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd])

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* 背景円 - 太さを増加 */}
      <div className="absolute inset-0 rounded-full border-[24px]" style={{ borderColor: bgColor }}></div>

      {/* 進捗円弧 - SVGで実装 */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
        onClick={handleClick}
        style={{ cursor: disabled ? "default" : "pointer" }}
      >
        {/* 背景円 - クリック可能な領域を広げるため透明な円を追加 */}
        <circle
          cx={centerPoint}
          cy={centerPoint}
          r={radius + strokeWidth}
          fill="transparent"
          className={disabled ? "" : "cursor-pointer"}
          onMouseDown={disabled ? undefined : startDragMouse}
          onTouchStart={disabled ? undefined : startDragTouch}
        />

        {/* 背景円 - 最大値の場合は表示しない */}
        {!isMax && (
          <circle
            cx={centerPoint}
            cy={centerPoint}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            stroke={bgColor}
            strokeLinecap="round"
          />
        )}

        {/* 進捗円弧 - 最大値の場合は完全な円を描画 */}
        {isMax ? (
          <circle
            cx={centerPoint}
            cy={centerPoint}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            stroke={disabled ? disabledColor : color}
            strokeLinecap="round"
            style={{
              transition: isDragging ? "none" : "stroke 0.3s ease",
              filter: isDragging && !disabled ? `drop-shadow(0 0 4px ${color}99)` : "none",
            }}
            className={disabled ? "" : "cursor-pointer"}
            onMouseDown={disabled ? undefined : startDragMouse}
            onTouchStart={disabled ? undefined : startDragTouch}
          />
        ) : (
          <path
            d={`
              M ${startX} ${startY}
              A ${radius} ${radius} 0 
              ${largeArcFlag} 1
              ${endX} ${endY}
            `}
            fill="none"
            strokeWidth={strokeWidth}
            stroke={disabled ? disabledColor : color}
            strokeLinecap="round"
            style={{
              transition: isDragging ? "none" : "d 0.3s ease, stroke 0.3s ease",
              filter: isDragging && !disabled ? `drop-shadow(0 0 4px ${color}99)` : "none",
            }}
            className={disabled ? "" : "cursor-pointer"}
            onMouseDown={disabled ? undefined : startDragMouse}
            onTouchStart={disabled ? undefined : startDragTouch}
          />
        )}
      </svg>
    </div>
  )
}
