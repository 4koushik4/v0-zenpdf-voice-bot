"use client"

import { useEffect, useRef } from "react"
import "./ConversationView.css"

export default function ConversationView({ messages }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="conversation-view">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message message-${msg.type}`}>
            <div className="message-content">
              {msg.type === "bot" && <span className="bot-label">Bot:</span>}
              {msg.type === "user" && <span className="user-label">You:</span>}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
