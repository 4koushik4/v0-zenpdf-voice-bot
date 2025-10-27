"use client"

import { useState } from "react"
import { processOperation, downloadBlob } from "../utils/apiClient"
import "./InputCollector.css"

export default function InputCollector({ operation, onComplete, onError, onCancel }) {
  const [inputs, setInputs] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleInputChange = (inputName, value) => {
    setInputs((prev) => ({
      ...prev,
      [inputName]: value,
    }))
  }

  const handleFileChange = (inputName, files) => {
    if (files && files.length > 0) {
      handleInputChange(inputName, files.length === 1 ? files[0] : Array.from(files))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsProcessing(true)
    setProgress(0)

    try {
      // Validate required inputs
      for (const input of operation.inputs) {
        if (input.required && !inputs[input.name]) {
          throw new Error(`${input.name} is required`)
        }
      }

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 30, 90))
      }, 500)

      const blob = await processOperation(operation, inputs)

      clearInterval(progressInterval)
      setProgress(100)

      const filename = `${operation.name.toLowerCase().replace(/\s+/g, "-")}.pdf`
      downloadBlob(blob, filename)

      setTimeout(() => {
        onComplete({ success: true })
      }, 500)
    } catch (err) {
      setError(err.message)
      onError(err)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="input-collector">
      <div className="collector-header">
        <h3>{operation.name}</h3>
        <button className="close-btn" onClick={onCancel}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="collector-form">
        {operation.inputs.map((input, idx) => (
          <div key={idx} className="form-group">
            <label>
              {input.name} {input.required && "*"}
            </label>

            {input.type === "file" && (
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(input.name, e.target.files)}
                required={input.required}
              />
            )}

            {input.type === "file-multiple" && (
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) => handleFileChange(input.name, e.target.files)}
                required={input.required}
              />
            )}

            {input.type === "text" && (
              <input
                type="text"
                placeholder={input.placeholder}
                value={inputs[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                required={input.required}
              />
            )}

            {input.type === "password" && (
              <input
                type="password"
                placeholder={input.placeholder}
                value={inputs[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                required={input.required}
              />
            )}

            {input.type === "number" && (
              <input
                type="number"
                min={input.min}
                max={input.max}
                step={input.step}
                placeholder={input.placeholder}
                value={inputs[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                required={input.required}
              />
            )}

            {input.type === "select" && (
              <select
                value={inputs[input.name] || ""}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                required={input.required}
              >
                <option value="">Select {input.name}</option>
                {input.options.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        {error && <div className="error-message">{error}</div>}

        {isProcessing && (
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">Processing... {Math.round(progress)}%</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isProcessing} className="submit-btn">
            {isProcessing ? "Processing..." : "Process"}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn" disabled={isProcessing}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
