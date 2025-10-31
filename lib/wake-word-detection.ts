export class WakeWordDetector {
  private recognition: any
  private isListening = false
  private onWakeWord: (() => void) | null = null

  constructor() {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = "en-US"
      }
    }
  }

  start(onWakeWord: () => void): void {
    if (!this.recognition || this.isListening) return

    this.onWakeWord = onWakeWord
    this.isListening = true

    this.recognition.onstart = () => {
      console.log("[v0] Wake word detection started")
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase()

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      // Check for wake word: "hey zenpdf" or just "zenpdf"
      if (finalTranscript.includes("hey zenpdf") || finalTranscript.includes("zenpdf")) {
        console.log("[v0] Wake word detected!")
        this.stop()
        if (this.onWakeWord) {
          this.onWakeWord()
        }
      }
    }

    this.recognition.onerror = (event: any) => {
      console.error("[v0] Wake word detection error:", event.error)
    }

    this.recognition.onend = () => {
      console.log("[v0] Wake word detection ended")
      if (this.isListening) {
        // Restart detection
        setTimeout(() => this.start(onWakeWord), 1000)
      }
    }

    try {
      this.recognition.start()
    } catch (error) {
      console.error("[v0] Failed to start wake word detection:", error)
    }
  }

  stop(): void {
    if (!this.recognition) return
    this.isListening = false
    try {
      this.recognition.stop()
    } catch (error) {
      console.error("[v0] Failed to stop wake word detection:", error)
    }
  }

  isSupported(): boolean {
    return !!this.recognition
  }
}
