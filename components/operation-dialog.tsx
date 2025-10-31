"use client"

import { useState, useRef } from "react"
import { PDF_OPERATIONS } from "@/lib/pdf-operations"

interface OperationDialogProps {
  operation: string
  isOpen: boolean
  onClose: () => void
  onExecute: (operationName: string, params: Record<string, any>, file: File) => void
  isProcessing: boolean
}

export default function OperationDialog({ operation, isOpen, onClose, onExecute, isProcessing }: OperationDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [params, setParams] = useState<Record<string, string>>({})
  const [password, setPassword] = useState("")
  const [pages, setPages] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const operationConfig = PDF_OPERATIONS[operation as keyof typeof PDF_OPERATIONS]

  if (!isOpen || !operationConfig) return null

  const handleExecute = () => {
    if (!selectedFile) {
      alert("Please select a PDF file")
      return
    }

    const allParams: Record<string, any> = { ...params }
    if (operationConfig.requiresPassword) {
      allParams.password = password
    }
    if (operationConfig.requiresPages) {
      allParams.pages = pages
    }

    onExecute(operation, allParams, selectedFile)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border/40 rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold capitalize">{operationConfig.name}</h2>
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
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setSelectedFile(file)
            }}
            className="hidden"
          />
        </div>

        {/* Password Field */}
        {operationConfig.requiresPassword && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Password (if applicable)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PDF password"
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
            />
          </div>
        )}

        {/* Pages Field */}
        {operationConfig.requiresPages && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Page Numbers</label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 1-5 or 1,3,5"
              className="w-full px-3 py-2 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-border/80 transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              Enter page numbers separated by commas or use ranges like 1-5
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 rounded-lg border border-border/40 font-medium hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={isProcessing || !selectedFile}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Execute"}
          </button>
        </div>
      </div>
    </div>
  )
}
