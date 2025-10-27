import "./RobotAvatar.css"

export default function RobotAvatar({ isListening, isSpeaking }) {
  return (
    <div className={`robot-avatar ${isListening ? "listening" : ""} ${isSpeaking ? "speaking" : ""}`}>
      <div className="robot-head">
        <div className="robot-eyes">
          <div className={`eye ${isListening || isSpeaking ? "active" : ""}`}></div>
          <div className={`eye ${isListening || isSpeaking ? "active" : ""}`}></div>
        </div>
        <div className={`robot-mouth ${isSpeaking ? "speaking" : ""}`}></div>
      </div>
      <div className="robot-body">
        <div className="antenna"></div>
      </div>
    </div>
  )
}
