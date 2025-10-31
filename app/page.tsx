"use client"

import { useState, useRef, useEffect } from "react"
import RobotAvatar from "@/components/robot-avatar"
import VoiceControls from "@/components/voice-controls"
import { detectOperation, getSuccessMessage, PDF_OPERATIONS } from "@/lib/pdf-operations"
import { callPDFAPI } from "@/lib/api-client"
import { speakText, stopSpeech } from "@/lib/voice-utils"
import { WakeWordDetector } from "@/lib/wake-word-detection"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  fileUrl?: string
  fileName?: string
}

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [showRobot, setShowRobot] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [currentOperation, setCurrentOperation] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm ZenPDF, your AI assistant for PDF management. I can compress, merge, split, extract, and transform your PDFs. You can type or speak your request. What would you like to do?",
      timestamp: new Date(),
    },
  ])

  const wakeWordDetectorRef = useRef<WakeWordDetector | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      wakeWordDetectorRef.current = new WakeWordDetector()

      if (wakeWordDetectorRef.current.isSupported()) {
        wakeWordDetectorRef.current.start(() => {
          setShowRobot(true)
          setIsListening(true)
          speakText("Hello, how may I help you?", () => {
            setIsSpeaking(false)
          })
          setIsSpeaking(true)
        })
      }
    }

    return () => {
      wakeWordDetectorRef.current?.stop()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleRobotVoiceInput = (transcript: string) => {
    setCurrentTranscript(transcript)

    const operation = detectOperation(transcript)

    if (operation) {
      setCurrentOperation(operation)
      const msg = `Great! I'll help you ${operation}. Please upload the PDF file.`
      speakText(msg)
      setIsSpeaking(true)
    } else {
      const msg = `I can help with: ${Object.values(PDF_OPERATIONS)
        .map((op) => op.name)
        .join(", ")}. What would you like?`
      speakText(msg)
      setIsSpeaking(true)
    }
  }

  const handleRobotFileUpload = (file: File) => {
    setUploadedFile(file)
    const msg = `File uploaded successfully. Ready to ${currentOperation || "process your PDF"}.`
    speakText(msg)
    setIsSpeaking(true)
  }

  const handleExecuteOperation = async (operation: string, params: Record<string, any>, file: File) => {
    setIsProcessing(true)
    setCurrentOperation(null)

    try {
      const resultBlob = await callPDFAPI(operation, file, params)
      const fileName = `${operation}-${file.name}`
      const fileUrl = URL.createObjectURL(resultBlob)

      const msg = getSuccessMessage(operation)
      speakText(msg)
      setIsSpeaking(true)

      const downloadLink = document.createElement("a")
      downloadLink.href = fileUrl
      downloadLink.download = fileName
      downloadLink.click()

      setUploadedFile(null)
    } catch (error) {
      const errorMsg = `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      speakText(errorMsg)
      setIsSpeaking(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const closeRobot = () => {
    setShowRobot(false)
    setCurrentTranscript("")
    setCurrentOperation(null)
    setUploadedFile(null)
    stopSpeech()
  }

  if (showRobot) {
    return (
      <main className="fixed inset-0 bg-black/40 backdrop-blur z-50 flex items-center justify-center p-4">
        <div className="bg-background border border-border/40 rounded-3xl max-w-2xl w-full p-8">
          <button
            onClick={closeRobot}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>

          <RobotAvatar isActive={true} isSpeaking={isSpeaking} transcript={currentTranscript} />

          <div className="mt-8 flex justify-center">
            <VoiceControls isListening={isListening} onVoiceInput={handleRobotVoiceInput} />
          </div>

          {currentOperation && (
            <div className="mt-8">
              <label className="block text-center text-sm font-medium mb-4">Upload PDF File</label>
              <div
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = ".pdf"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleRobotFileUpload(file)
                  }
                  input.click()
                }}
                className="border-2 border-dashed border-border/40 rounded-lg p-8 text-center cursor-pointer hover:border-border/80 transition-colors"
              >
                {uploadedFile ? (
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Click to upload PDF</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                  </div>
                )}
              </div>

              {uploadedFile && (
                <button
                  onClick={() => handleExecuteOperation(currentOperation, {}, uploadedFile)}
                  disabled={isProcessing}
                  className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : `Execute ${currentOperation}`}
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-semibold text-lg">ZenPDF</span>
          </div>
          <button
            onClick={() => setShowChat(true)}
            className="px-4 py-2 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            Try Now
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Your AI assistant for
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PDF management
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Say "Hey ZenPDF" to activate. Compress, merge, split, extract, and transform your PDFs using voice or text
              commands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Start Using ZenPDF
            </button>
            <button className="px-8 py-3 rounded-full border border-border/60 font-semibold hover:bg-muted/50 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Voice Activation",
              description: "Say Hey ZenPDF to activate the robot assistant instantly.",
              icon: "🎤",
            },
            {
              title: "14+ Operations",
              description: "Compress, merge, split, extract, rotate, watermark, and more.",
              icon: "⚙️",
            },
            {
              title: "Instant Results",
              description: "Get your processed PDFs in seconds with AI-powered efficiency.",
              icon: "⚡",
            },
            {
              title: "Interactive Robot",
              description: "Engaging robot avatar that responds to your commands.",
              icon: "🤖",
            },
            {
              title: "No Setup Required",
              description: "Start using immediately. No installation, no configuration.",
              icon: "✨",
            },
            {
              title: "Always Listening",
              description: "Background wake word detection for hands-free operation.",
              icon: "🧠",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-border/40 hover:border-border/80 transition-colors group"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What you can do</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Just say Hey ZenPDF and tell it what you need. It handles the rest.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(PDF_OPERATIONS).map((op, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-muted/30 border border-border/40 text-center hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium text-sm">{op.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl border border-border/40 bg-muted/20 p-12 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to transform your PDFs?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Just say Hey ZenPDF. The robot assistant will guide you through everything.
          </p>
          <button
            onClick={() => setShowChat(true)}
            className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity inline-block"
          >
            Launch ZenPDF
          </button>
        </div>
      </section>

      <footer className="border-t border-border/40 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>ZenPDF © 2025. Built with AI. Designed for simplicity. Say Hey ZenPDF to begin.</p>
        </div>
      </footer>
    </main>
  )
}
