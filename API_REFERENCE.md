# API Reference

## Base URL

\`\`\`
https://zenpdf-backend-xxx.vercel.app/api
\`\`\`

## Authentication

Currently no authentication required. For production, implement API keys.

## Request Format

All endpoints accept `POST` requests with `multipart/form-data`:

\`\`\`bash
curl -X POST https://zenpdf-backend-xxx.vercel.app/api/compress \
  -F "pdfFile=@document.pdf" \
  -F "quality_level=High Quality"
\`\`\`

## Response Format

Success (200):
\`\`\`
Binary PDF file
\`\`\`

Error (400/500):
\`\`\`json
{
  "error": "Error message"
}
\`\`\`

## Endpoints

### Compress PDF

**POST** `/compress`

Reduce PDF file size.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `quality_level` (string, required): "High Quality", "Medium Quality", or "Low Quality"

**Example:**
\`\`\`bash
curl -X POST /api/compress \
  -F "pdfFile=@large.pdf" \
  -F "quality_level=Medium Quality"
\`\`\`

### Merge PDFs

**POST** `/merge`

Combine multiple PDFs into one.

**Parameters:**
- `pdfFile` (files, required): Multiple PDF files

**Example:**
\`\`\`bash
curl -X POST /api/merge \
  -F "pdfFile=@doc1.pdf" \
  -F "pdfFile=@doc2.pdf"
\`\`\`

### Split PDF

**POST** `/split`

Split PDF into individual pages (returns ZIP).

**Parameters:**
- `pdfFile` (file, required): PDF file

**Example:**
\`\`\`bash
curl -X POST /api/split \
  -F "pdfFile=@document.pdf"
\`\`\`

### Extract Pages

**POST** `/extract-pages`

Extract specific pages from PDF.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `pages` (string, required): Comma-separated page numbers (1-indexed)

**Example:**
\`\`\`bash
curl -X POST /api/extract-pages \
  -F "pdfFile=@document.pdf" \
  -F "pages=1,3,5"
\`\`\`

### Remove Pages

**POST** `/remove-pages`

Remove specific pages from PDF.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `pages` (string, required): Comma-separated page numbers to remove

**Example:**
\`\`\`bash
curl -X POST /api/remove-pages \
  -F "pdfFile=@document.pdf" \
  -F "pages=2,4"
\`\`\`

### Rotate PDF

**POST** `/rotate`

Rotate all pages in PDF.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `angle` (string, required): "90", "180", or "270"

**Example:**
\`\`\`bash
curl -X POST /api/rotate \
  -F "pdfFile=@document.pdf" \
  -F "angle=90"
\`\`\`

### Reorder Pages

**POST** `/reorder`

Rearrange pages in PDF.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `order` (string, required): Comma-separated page numbers in new order

**Example:**
\`\`\`bash
curl -X POST /api/reorder \
  -F "pdfFile=@document.pdf" \
  -F "order=3,1,2"
\`\`\`

### Add Watermark

**POST** `/watermark`

Add text watermark to all pages.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `text` (string, required): Watermark text
- `opacity` (number, required): 0-1 (0.3 recommended)

**Example:**
\`\`\`bash
curl -X POST /api/watermark \
  -F "pdfFile=@document.pdf" \
  -F "text=CONFIDENTIAL" \
  -F "opacity=0.3"
\`\`\`

### Add Page Numbers

**POST** `/page-numbers`

Add page numbers to PDF.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `position` (string, required): "bottom-center", "bottom-right", or "top-left"
- `start_number` (number, required): Starting page number

**Example:**
\`\`\`bash
curl -X POST /api/page-numbers \
  -F "pdfFile=@document.pdf" \
  -F "position=bottom-center" \
  -F "start_number=1"
\`\`\`

### Insert Blank Page

**POST** `/insert-blank`

Insert blank page at position.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `position` (number, required): Page position (0-indexed)

**Example:**
\`\`\`bash
curl -X POST /api/insert-blank \
  -F "pdfFile=@document.pdf" \
  -F "position=0"
\`\`\`

### Insert PDF

**POST** `/insert-pdf`

Insert one PDF into another.

**Parameters:**
- `pdfFile` (file, required): Main PDF file
- `pdfFile` (file, required): PDF to insert
- `position` (number, required): Insert position

**Example:**
\`\`\`bash
curl -X POST /api/insert-pdf \
  -F "pdfFile=@main.pdf" \
  -F "pdfFile=@insert.pdf" \
  -F "position=0"
\`\`\`

### Unlock PDF

**POST** `/unlock`

Remove encryption from PDF.

**Parameters:**
- `pdfFile` (file, required): Encrypted PDF file

**Example:**
\`\`\`bash
curl -X POST /api/unlock \
  -F "pdfFile=@encrypted.pdf"
\`\`\`

### Add Signature

**POST** `/sign`

Add signature text to PDF.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `signature_text` (string, required): Signature text
- `position` (string, required): "bottom-center", "bottom-right", or "bottom-left"

**Example:**
\`\`\`bash
curl -X POST /api/sign \
  -F "pdfFile=@document.pdf" \
  -F "signature_text=John Doe" \
  -F "position=bottom-right"
\`\`\`

### Password Protect

**POST** `/password-protect`

Encrypt PDF with password.

**Parameters:**
- `pdfFile` (file, required): PDF file
- `password` (string, required): Password
- `output_filename` (string, optional): Output filename

**Example:**
\`\`\`bash
curl -X POST /api/password-protect \
  -F "pdfFile=@document.pdf" \
  -F "password=secret123"
\`\`\`

### Health Check

**GET** `/health`

Check API status.

**Example:**
\`\`\`bash
curl https://zenpdf-backend-xxx.vercel.app/api/health
\`\`\`

**Response:**
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

## Error Codes

- `400`: Bad Request (missing required parameters)
- `500`: Server Error (processing failed)

## Rate Limiting

Currently unlimited. For production, implement rate limiting.

## File Size Limits

- Maximum file size: 50MB
- Recommended: < 10MB for best performance

## Timeout

- Request timeout: 30 seconds
- Processing timeout: 60 seconds
