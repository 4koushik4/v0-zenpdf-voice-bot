"use client"

import { useState, useRef, useEffect } from "react"
import { initializeSpeechRecognition } from "@/lib/voice-utils"

interface VoiceControlsProps {
  isListening: boolean
  onVoiceInput: (transcript: string) => void
}

export default function VoiceControls({ isListening, onVoiceInput }: VoiceControlsProps) {
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
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          setTranscript((prev) => prev + transcriptPart)
        } else {
          interim += transcriptPart
        }
      }
      setInterimTranscript(interim)
    }

    recognitionRef.current.onend = () => {
      setIsActive(false)
      const finalTranscript = transcript + interimTranscript
      if (finalTranscript.trim()) {
        onVoiceInput(finalTranscript)
      }
      setTranscript("")
      setInterimTranscript("")
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsActive(false)
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [transcript, interimTranscript, onVoiceInput])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isActive) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return <div className="text-xs text-slate-400">Voice control not supported in your browser</div>
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-full transition ${
          isActive
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
            : "bg-indigo-600 hover:bg-indigo-700 text-white"
        }`}
        title={isActive ? "Stop listening" : "Start listening"}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M3 8.5a7 7 0 1114 0H3z" />
        </svg>
      </button>
      {isActive && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400">Listening...</span>
          <div className="flex gap-0.5">
            <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}
      {interimTranscript && <span className="text-xs text-slate-400 italic">{interimTranscript}</span>}
    </div>
  )
}
