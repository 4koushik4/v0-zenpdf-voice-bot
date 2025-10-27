"use client"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  fileUrl?: string
  fileName?: string
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-2xl rounded-lg px-4 py-3 ${
              message.type === "user"
                ? "bg-indigo-600 text-white rounded-br-none"
                : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            {message.fileUrl && (
              <a
                href={message.fileUrl}
                download={message.fileName}
                className="mt-2 inline-block px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded transition"
              >
                Download {message.fileName}
              </a>
            )}
            <p className={`text-xs mt-1 ${message.type === "user" ? "text-indigo-200" : "text-slate-500"}`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
