"use client"

import { useEffect, useState } from "react"

interface RobotAvatarProps {
  isActive: boolean
  isSpeaking: boolean
  transcript?: string
}

export default function RobotAvatar({ isActive, isSpeaking, transcript }: RobotAvatarProps) {
  const [mouthOpen, setMouthOpen] = useState(false)

  useEffect(() => {
    if (!isSpeaking) {
      setMouthOpen(false)
      return
    }

    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev)
    }, 200)

    return () => clearInterval(interval)
  }, [isSpeaking])

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Robot Avatar */}
      <div
        className={`relative w-40 h-40 rounded-3xl transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/50"
            : "bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg"
        }`}
      >
        {/* Robot Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="flex gap-6 mb-4">
            {/* Left Eye */}
            <div
              className={`w-6 h-6 rounded-full transition-all duration-200 ${
                isActive ? "bg-white shadow-lg shadow-white/50" : "bg-gray-500"
              }`}
            >
              <div className="w-2 h-2 bg-black rounded-full mx-auto mt-1"></div>
            </div>
            {/* Right Eye */}
            <div
              className={`w-6 h-6 rounded-full transition-all duration-200 ${
                isActive ? "bg-white shadow-lg shadow-white/50" : "bg-gray-500"
              }`}
            >
              <div className="w-2 h-2 bg-black rounded-full mx-auto mt-1"></div>
            </div>
          </div>

          {/* Mouth */}
          <div className="mt-2 w-12">
            {mouthOpen ? (
              // Open mouth
              <div className="h-3 bg-black rounded-full opacity-70"></div>
            ) : (
              // Closed mouth
              <div className="h-1 bg-black rounded-full opacity-70"></div>
            )}
          </div>

          {/* Antenna */}
          <div className="absolute top-0 right-4 w-1 h-8 bg-yellow-400 rounded-full transform -rotate-12"></div>

          {/* Pulse animation when active */}
          {isActive && (
            <>
              <div className="absolute inset-0 rounded-3xl animate-pulse bg-white/10"></div>
            </>
          )}
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <p className={`font-semibold text-lg transition-colors ${isActive ? "text-white" : "text-muted-foreground"}`}>
          {isActive ? "ZenPDF Active" : "Ready to Help"}
        </p>
        {transcript && <p className="text-sm text-muted-foreground italic">"{transcript}"</p>}
      </div>

      {/* Audio Visualizer */}
      {isSpeaking && (
        <div className="flex gap-1 items-end">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full animate-pulse"
              style={{
                height: `${12 + Math.sin(Date.now() / 100 + i) * 8}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}
