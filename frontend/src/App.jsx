import VoiceBot from "./components/VoiceBot"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>ZenPDF Voice Assistant</h1>
          <p>Say "Hey ZenPDF" to start</p>
        </div>
      </header>
      <main className="app-main">
        <VoiceBot />
      </main>
    </div>
  )
}

export default App
