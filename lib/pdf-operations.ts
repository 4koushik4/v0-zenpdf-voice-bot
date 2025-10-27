export interface PDFOperation {
  name: string
  keywords: string[]
  description: string
  requiresFile: boolean
  requiresPassword?: boolean
  requiresPages?: boolean
}

export const PDF_OPERATIONS: Record<string, PDFOperation> = {
  compress: {
    name: "compress",
    keywords: ["compress", "reduce", "smaller", "size"],
    description: "Reduce PDF file size",
    requiresFile: true,
  },
  merge: {
    name: "merge",
    keywords: ["merge", "combine", "join", "concatenate"],
    description: "Merge multiple PDFs into one",
    requiresFile: true,
  },
  split: {
    name: "split",
    keywords: ["split", "separate", "divide", "extract all"],
    description: "Split PDF into individual pages",
    requiresFile: true,
  },
  "extract-pages": {
    name: "extract-pages",
    keywords: ["extract", "get pages", "select pages", "specific pages"],
    description: "Extract specific pages from PDF",
    requiresFile: true,
    requiresPages: true,
  },
  "remove-pages": {
    name: "remove-pages",
    keywords: ["remove", "delete pages", "remove pages"],
    description: "Remove specific pages from PDF",
    requiresFile: true,
    requiresPages: true,
  },
  rotate: {
    name: "rotate",
    keywords: ["rotate", "turn", "orientation"],
    description: "Rotate PDF pages",
    requiresFile: true,
  },
  reorder: {
    name: "reorder",
    keywords: ["reorder", "rearrange", "reorganize"],
    description: "Reorder PDF pages",
    requiresFile: true,
  },
  watermark: {
    name: "watermark",
    keywords: ["watermark", "stamp", "mark"],
    description: "Add watermark to PDF",
    requiresFile: true,
  },
  "page-numbers": {
    name: "page-numbers",
    keywords: ["page numbers", "numbering", "add numbers"],
    description: "Add page numbers to PDF",
    requiresFile: true,
  },
  "insert-blank": {
    name: "insert-blank",
    keywords: ["insert blank", "add blank page", "blank page"],
    description: "Insert blank pages into PDF",
    requiresFile: true,
  },
  "insert-pdf": {
    name: "insert-pdf",
    keywords: ["insert pdf", "add pdf", "insert another"],
    description: "Insert another PDF into current PDF",
    requiresFile: true,
  },
  unlock: {
    name: "unlock",
    keywords: ["unlock", "remove password", "unprotect"],
    description: "Unlock password-protected PDF",
    requiresFile: true,
    requiresPassword: true,
  },
  sign: {
    name: "sign",
    keywords: ["sign", "signature", "add signature"],
    description: "Add digital signature to PDF",
    requiresFile: true,
  },
  "password-protect": {
    name: "password-protect",
    keywords: ["password", "protect", "secure", "lock"],
    description: "Protect PDF with password",
    requiresFile: true,
    requiresPassword: true,
  },
}

export function detectOperation(input: string): string | null {
  const lowerInput = input.toLowerCase()

  for (const [key, operation] of Object.entries(PDF_OPERATIONS)) {
    for (const keyword of operation.keywords) {
      if (lowerInput.includes(keyword)) {
        return key
      }
    }
  }

  return null
}

export function getOperationMessage(operation: string): string {
  const op = PDF_OPERATIONS[operation]
  if (!op) return "Processing your request..."

  const messages: Record<string, string> = {
    compress: "Compressing your PDF to reduce file size...",
    merge: "Merging PDFs together...",
    split: "Splitting PDF into individual pages...",
    "extract-pages": "Extracting selected pages...",
    "remove-pages": "Removing selected pages...",
    rotate: "Rotating PDF pages...",
    reorder: "Reordering PDF pages...",
    watermark: "Adding watermark to PDF...",
    "page-numbers": "Adding page numbers to PDF...",
    "insert-blank": "Inserting blank pages...",
    "insert-pdf": "Inserting PDF into document...",
    unlock: "Unlocking PDF...",
    sign: "Adding signature to PDF...",
    "password-protect": "Protecting PDF with password...",
  }

  return messages[operation] || "Processing your request..."
}

export function getSuccessMessage(operation: string): string {
  const messages: Record<string, string> = {
    compress: "PDF compressed successfully! Your file is ready to download.",
    merge: "PDFs merged successfully! Your combined file is ready.",
    split: "PDF split successfully! All pages are ready to download.",
    "extract-pages": "Pages extracted successfully! Your file is ready.",
    "remove-pages": "Pages removed successfully! Your file is ready.",
    rotate: "PDF rotated successfully! Your file is ready.",
    reorder: "PDF reordered successfully! Your file is ready.",
    watermark: "Watermark added successfully! Your file is ready.",
    "page-numbers": "Page numbers added successfully! Your file is ready.",
    "insert-blank": "Blank pages inserted successfully! Your file is ready.",
    "insert-pdf": "PDF inserted successfully! Your file is ready.",
    unlock: "PDF unlocked successfully! Your file is ready.",
    sign: "Signature added successfully! Your file is ready.",
    "password-protect": "PDF protected successfully! Your file is ready.",
  }

  return messages[operation] || "Operation completed successfully!"
}
