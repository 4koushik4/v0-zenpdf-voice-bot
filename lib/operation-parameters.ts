export interface OperationParams {
  password?: string
  pages?: string
  quality?: string
  text?: string
  position?: string
}

export function parsePageRange(input: string): number[] {
  const pages: number[] = []

  if (!input.trim()) return pages

  // Handle formats like "1-5" or "1,3,5" or mixed "1-3,5,7-9"
  const parts = input.split(",").map((p) => p.trim())

  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map((p) => Number.parseInt(p.trim(), 10))
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) {
            pages.push(i)
          }
        }
      }
    } else {
      const page = Number.parseInt(part, 10)
      if (!isNaN(page) && !pages.includes(page)) {
        pages.push(page)
      }
    }
  }

  return pages.sort((a, b) => a - b)
}

export function validatePassword(password: string): boolean {
  return password.length > 0 && password.length <= 255
}

export function validatePageRange(pages: number[], totalPages: number): boolean {
  return pages.length > 0 && pages.every((p) => p >= 1 && p <= totalPages)
}

export function operationRequiresDialog(operation: string): boolean {
  const requiresDialog = ["extract-pages", "remove-pages", "unlock", "password-protect", "watermark", "sign"]
  return requiresDialog.includes(operation)
}

export function getOperationPrompt(operation: string): string {
  const prompts: Record<string, string> = {
    compress: "Select quality level (High/Medium/Low)",
    merge: "Upload additional PDFs to merge",
    split: "Split into individual pages",
    "extract-pages": "Enter page numbers (e.g., 1-5 or 1,3,5)",
    "remove-pages": "Enter page numbers to remove",
    rotate: "Select rotation angle (90/180/270)",
    reorder: "Specify new page order",
    watermark: "Enter watermark text",
    "page-numbers": "Choose numbering style",
    "insert-blank": "Enter number of blank pages",
    "insert-pdf": "Upload PDF to insert",
    unlock: "Enter PDF password",
    sign: "Add your signature",
    "password-protect": "Enter password to protect PDF",
  }

  return prompts[operation] || "Processing your PDF..."
}
