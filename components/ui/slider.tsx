"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#1A212E]">
      <SliderPrimitive.Range
        className={cn(
          "absolute h-full",
          className?.includes("purple")
            ? "bg-gradient-to-r from-purple-600 to-purple-500"
            : "bg-gradient-to-r from-blue-600 to-blue-500",
          className?.includes("amber") && "bg-gradient-to-r from-amber-600 to-amber-500",
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full border bg-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-md",
        className?.includes("purple") ? "border-purple-500" : "border-blue-500",
        className?.includes("amber") && "border-amber-500",
      )}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
