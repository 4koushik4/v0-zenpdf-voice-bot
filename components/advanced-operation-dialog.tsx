"use client"

import { useState, useRef } from "react"
import { PDF_OPERATIONS } from "@/lib/pdf-operations"
import { parsePageRange, validatePassword } from "@/lib/operation-parameters"

interface AdvancedOperationDialogProps {
  operation: string
  isOpen: boolean
  onClose: () => void
  onExecute: (operation: string, params: Record<string, any>, file: File) => void
  isProcessing: boolean
}

export default function AdvancedOperationDialog({
  operation,
  isOpen,
  onClose,
  onExecute,
  isProcessing,
}: AdvancedOperationDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [pages, setPages] = useState("")
  const [quality, setQuality] = useState("Medium")
  const [watermarkText, setWatermarkText] = useState("")
  const [rotationAngle, setRotationAngle] = useState("90")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const operationConfig = PDF_OPERATIONS[operation as keyof typeof PDF_OPERATIONS]

  if (!isOpen || !operationConfig) return null

  const handleExecute = () => {
    if (!selectedFile) {
      alert("Please select a PDF file")
      return
    }

    const params: Record<string, any> = {}

    if (operation === "extract-pages" || operation === "remove-pages") {
      if (!pages.trim()) {
        alert("Please enter page numbers")
        return
      }
      params.pages = parsePageRange(pages)
    }

    if (operation === "unlock" || operation === "password-protect") {
      if (!password.trim()) {
        alert("Please enter a password")
        return
      }
      if (!validatePassword(password)) {
        alert("Password must be between 1-255 characters")
        return
      }
      params.password = password
    }

    if (operation === "compress") {
      params.quality = quality
    }

    if (operation === "watermark") {
      if (!watermarkText.trim()) {
        alert("Please enter watermark text")
        return
      }
      params.text = watermarkText
    }

    if (operation === "rotate") {
      params.angle = Number.parseInt(rotationAngle, 10)
    }

    onExecute(operation, params, selectedFile)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border/40 rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold capitalize">{operation}</h2>
          <p className="text-muted-foreground text-sm">{operationConfig.description}</p>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">PDF File</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center cursor-pointer hover:border-border/80 transition-colors"
          >
            {selectedFile ? (
              <div className="space-y-1">
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-medium text-sm">Click to upload PDF</p>
                <p className="text-xs text-muted-foreground">Max 50MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        {/* Operation-specific fields */}
        {(operation === "extract-pages" || operation === "remove-pages") && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Page Numbers</label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 1-5 or 1,3,5"
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
            />
          </div>
        )}

        {(operation === "unlock" || operation === "password-protect") && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              {operation === "unlock" ? "PDF Password" : "New Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
            />
          </div>
        )}

        {operation === "compress" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Quality Level</label>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground focus:outline-none focus:border-border/80 transition-colors"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        )}

        {operation === "watermark" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Watermark Text</label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
            />
          </div>
        )}

        {operation === "rotate" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Rotation Angle</label>
            <select
              value={rotationAngle}
              onChange={(e) => setRotationAngle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground focus:outline-none focus:border-border/80 transition-colors"
            >
              <option>90</option>
              <option>180</option>
              <option>270</option>
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 rounded-lg border border-border/40 font-medium hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={isProcessing || !selectedFile}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Execute"}
          </button>
        </div>
      </div>
    </div>
  )
}
