"use client"

import { useState, useRef, useEffect } from "react"
import VoiceControls from "@/components/voice-controls"
import MessageList from "@/components/message-list"
import InputArea from "@/components/input-area"
import { detectOperation, getOperationMessage, getSuccessMessage, PDF_OPERATIONS } from "@/lib/pdf-operations"
import { callPDFAPI } from "@/lib/api-client"
import { speakText } from "@/lib/voice-utils"

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! I'm ZenPDF, your AI assistant for PDF management. I can compress, merge, split, extract, and transform your PDFs. You can type or speak your request. What would you like to do?",
      timestamp: new Date(),
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    const operation = detectOperation(text)

    if (!operation) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I can help you with: ${Object.values(PDF_OPERATIONS)
          .map((op) => op.name)
          .join(", ")}. What would you like to do?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      speakText(botMessage.content)
      return
    }

    if (!uploadedFile) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `To ${operation} a PDF, please upload a file first using the upload button.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      speakText(botMessage.content)
      return
    }

    setIsProcessing(true)
    try {
      const processingMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getOperationMessage(operation),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, processingMessage])

      const resultBlob = await callPDFAPI(operation, uploadedFile)
      const fileName = `${operation}-${uploadedFile.name}`
      const fileUrl = URL.createObjectURL(resultBlob)

      const successMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content: getSuccessMessage(operation),
        timestamp: new Date(),
        fileUrl,
        fileName,
      }
      setMessages((prev) => [...prev, successMessage])
      speakText(getSuccessMessage(operation))
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: `I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      speakText(errorMessage.content)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleVoiceInput = (transcript: string) => {
    handleSendMessage(transcript)
  }

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    const message: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: `File "${file.name}" uploaded successfully (${(file.size / 1024 / 1024).toFixed(2)} MB). What would you like me to do with it?`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
    speakText(message.content)
  }

  const handleClearFile = () => {
    setUploadedFile(null)
    const message: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: "File cleared. You can upload a new PDF anytime.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  if (!showChat) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        {/* Navigation */}
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

        {/* Hero Section */}
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
                Compress, merge, split, extract, and transform your PDFs using voice or text commands. Powered by AI,
                designed for simplicity.
              </p>
            </div>

            {/* CTA Buttons */}
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

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Voice & Text",
                description: "Speak or type your commands. ZenPDF understands both naturally.",
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
                title: "Privacy First",
                description: "Your files are processed securely and never stored permanently.",
                icon: "🔒",
              },
              {
                title: "No Setup Required",
                description: "Start using immediately. No installation, no configuration.",
                icon: "✨",
              },
              {
                title: "Always Learning",
                description: "AI learns your preferences and improves with every interaction.",
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

        {/* Operations Showcase */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What you can do</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Just tell ZenPDF what you need. It handles the rest.
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

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-2xl border border-border/40 bg-muted/20 p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to transform your PDFs?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Start using ZenPDF now. No credit card required. No limits.
            </p>
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity inline-block"
            >
              Launch ZenPDF
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/40 mt-20 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
            <p>ZenPDF © 2025. Built with AI. Designed for simplicity.</p>
          </div>
        </footer>
      </main>
    )
  }

  return (
    <main className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChat(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-xl font-bold">ZenPDF</h1>
              <p className="text-xs text-muted-foreground">AI-powered PDF assistant</p>
            </div>
          </div>
          <VoiceControls isListening={isListening} onVoiceInput={handleVoiceInput} />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <MessageList messages={messages} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <InputArea
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            onClearFile={handleClearFile}
            isProcessing={isProcessing}
            uploadedFile={uploadedFile}
          />
        </div>
      </div>
    </main>
  )
}
