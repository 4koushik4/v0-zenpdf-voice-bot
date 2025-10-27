"use client"

import { useState, useRef, useEffect } from "react"
import ConversationView from "./ConversationView"
import InputCollector from "./InputCollector"
import RobotAvatar from "./RobotAvatar"
import { OPERATIONS } from "../utils/operations"
import "./VoiceBot.css"

export default function VoiceBot() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your ZenPDF assistant. I can help you with PDF operations. What would you like to do?",
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState(null)
  const [operationInputs, setOperationInputs] = useState({})
  const [confidence, setConfidence] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => setIsListening(true)
      recognitionRef.current.onend = () => {
        setIsListening(false)
        setConfidence(0)
      }

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const isFinal = event.results[i].isFinal
          const conf = event.results[i][0].confidence

          if (isFinal) {
            finalTranscript += transcript + " "
            setConfidence(Math.round(conf * 100))
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          handleUserInput(finalTranscript.trim())
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        const errorMessages = {
          "no-speech": "I didn't hear anything. Please try again.",
          "audio-capture": "No microphone found. Please check your device.",
          network: "Network error. Please check your connection.",
          "not-allowed": "Microphone access denied. Please grant permission.",
        }
        const message = errorMessages[event.error] || "Sorry, I didn't catch that. Please try again."
        addMessage("bot", message)
        speak(message)
      }
    }

    synthRef.current = window.speechSynthesis
  }, [])

  const addMessage = (type, text) => {
    setMessages((prev) => [...prev, { type, text }])
  }

  const speak = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isSpeaking) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleUserInput = (input) => {
    addMessage("user", input)

    const lowerInput = input.toLowerCase()

    if (
      lowerInput.includes("help") ||
      lowerInput.includes("what can you do") ||
      lowerInput.includes("operations") ||
      lowerInput.includes("list")
    ) {
      const operationsList = OPERATIONS.map((op) => op.name).join(", ")
      const response = `I can help you with: ${operationsList}. Just say any of these operations to get started!`
      addMessage("bot", response)
      speak(response)
      return
    }

    let matchedOperation = null
    let bestMatch = 0

    for (const op of OPERATIONS) {
      const opNameLower = op.name.toLowerCase()
      const similarity = calculateSimilarity(lowerInput, opNameLower)

      if (similarity > bestMatch && similarity > 0.6) {
        bestMatch = similarity
        matchedOperation = op
      }
    }

    if (matchedOperation) {
      setSelectedOperation(matchedOperation)
      setOperationInputs({})
      const response = `Great! I'll help you ${matchedOperation.name.toLowerCase()}. Let me collect the necessary information.`
      addMessage("bot", response)
      speak(response)
    } else {
      const response = 'I didn\'t understand that operation. Say "help" to hear what I can do.'
      addMessage("bot", response)
      speak(response)
    }
  }

  const calculateSimilarity = (str1, str2) => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    const editDistance = getEditDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const getEditDistance = (s1, s2) => {
    const costs = []
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j
        } else if (j > 0) {
          let newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
      if (i > 0) costs[s2.length] = lastValue
    }
    return costs[s2.length]
  }

  const handleOperationComplete = (result) => {
    addMessage("bot", `Operation completed successfully! Your file is ready to download.`)
    speak("Operation completed successfully!")
    setSelectedOperation(null)
    setOperationInputs({})
  }

  const handleOperationError = (error) => {
    addMessage("bot", `Error: ${error.message}`)
    speak(`Error: ${error.message}`)
  }

  return (
    <div className="voice-bot">
      <div className="bot-container">
        <RobotAvatar isListening={isListening} isSpeaking={isSpeaking} />
        <ConversationView messages={messages} />
        {confidence > 0 && <div className="confidence-indicator">Confidence: {confidence}%</div>}
      </div>

      {selectedOperation ? (
        <InputCollector
          operation={selectedOperation}
          onComplete={handleOperationComplete}
          onError={handleOperationError}
          onCancel={() => {
            setSelectedOperation(null)
            addMessage("bot", "Operation cancelled. How else can I help?")
            speak("Operation cancelled. How else can I help?")
          }}
        />
      ) : (
        <div className="voice-controls">
          <button
            className={`mic-button ${isListening ? "listening" : ""}`}
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking}
            title={isListening ? "Click to stop listening" : "Click to start listening"}
          >
            {isListening ? "🎤 Listening..." : "🎤 Click to Speak"}
          </button>
        </div>
      )}
    </div>
  )
}
