"use client"
import MessageList from "./message-list"
import InputArea from "./input-area"
import VoiceControls from "./voice-controls"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  fileUrl?: string
  fileName?: string
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  onFileUpload: (file: File) => void
  onClearFile: () => void
  isProcessing: boolean
  uploadedFile: File | null
  onVoiceInput: (transcript: string) => void
  isListening: boolean
}

export default function ChatInterface({
  messages,
  onSendMessage,
  onFileUpload,
  onClearFile,
  isProcessing,
  uploadedFile,
  onVoiceInput,
  isListening,
}: ChatInterfaceProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              ZenPDF Voice Bot
            </h1>
            <p className="text-sm text-slate-400">AI-powered PDF assistant with voice control</p>
          </div>
          <VoiceControls isListening={isListening} onVoiceInput={onVoiceInput} />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <MessageList messages={messages} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <InputArea
            onSendMessage={onSendMessage}
            onFileUpload={onFileUpload}
            onClearFile={onClearFile}
            isProcessing={isProcessing}
            uploadedFile={uploadedFile}
          />
        </div>
      </div>
    </div>
  )
}
