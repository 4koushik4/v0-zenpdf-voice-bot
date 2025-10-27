"use client"

import { PDF_OPERATIONS } from "@/lib/pdf-operations"

interface OperationSuggestionsProps {
  onSelect: (operation: string) => void
}

export default function OperationSuggestions({ onSelect }: OperationSuggestionsProps) {
  const operations = Object.values(PDF_OPERATIONS).slice(0, 6)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <p className="text-sm text-slate-400 mb-3">Quick operations:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {operations.map((op) => (
          <button
            key={op.name}
            onClick={() => onSelect(op.name)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white text-xs rounded transition"
          >
            {op.name}
          </button>
        ))}
      </div>
    </div>
  )
}
