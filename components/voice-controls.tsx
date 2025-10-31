"use client"

import { useState, useRef, useEffect } from "react"
import { initializeSpeechRecognition } from "@/lib/voice-utils"

interface VoiceControlsProps {
  isListening: boolean
  onVoiceInput: (transcript: string) => void
  robotMode?: boolean
}

export default function VoiceControls({ isListening, onVoiceInput, robotMode = false }: VoiceControlsProps) {
  const [isActive, setIsActive] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const recognition = initializeSpeechRecognition()
    if (!recognition) {
      setIsSupported(false)
      return
    }

    recognitionRef.current = recognition

    recognitionRef.current.onstart = () => {
      setIsActive(true)
      setTranscript("")
      setInterimTranscript("")
    }

    recognitionRef.current.onresult = (event: any) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcriptPart
        } else {
          interim += transcriptPart
        }
      }

      setTranscript((prev) => prev + final)
      setInterimTranscript(interim)
    }

    recognitionRef.current.onend = () => {
      setIsActive(false)
      const finalTranscript = transcript + interimTranscript

      if (robotMode && finalTranscript.trim()) {
        onVoiceInput(finalTranscript)
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start()
          }
        }, 500)
      } else if (finalTranscript.trim()) {
        onVoiceInput(finalTranscript)
      }

      setTranscript("")
      setInterimTranscript("")
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      setIsActive(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [transcript, interimTranscript, onVoiceInput, robotMode])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isActive) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return <div className="text-xs text-muted-foreground">Voice control not supported in your browser</div>
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full transition-all ${
          isActive
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/50"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/50"
        }`}
        title={isActive ? "Stop listening" : "Start listening"}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M3 8.5a7 7 0 1114 0H3z" />
        </svg>
      </button>

      {isActive && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-muted-foreground font-medium">Listening...</div>
          <div className="flex gap-1">
            <div className="w-1.5 h-4 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full animate-pulse" />
            <div
              className="w-1.5 h-6 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-1.5 h-4 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      )}

      {interimTranscript && (
        <p className="text-sm text-muted-foreground italic text-center max-w-xs">{interimTranscript}</p>
      )}
    </div>
  )
}
