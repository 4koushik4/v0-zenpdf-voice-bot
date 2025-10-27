import { PDFDocument } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Compress route called")
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File

    console.log("[v0] File received:", file?.name, file?.size)

    if (!file) {
      console.error("[v0] No file provided")
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    console.log("[v0] ArrayBuffer created, size:", arrayBuffer.byteLength)

    const pdfDoc = await PDFDocument.load(arrayBuffer)
    console.log("[v0] PDF loaded, pages:", pdfDoc.getPageCount())

    const pdfBytes = await pdfDoc.save()
    console.log("[v0] PDF saved, size:", pdfBytes.length)

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
      },
    })
  } catch (error) {
    console.error("[v0] Compress error:", error)
    const errorMessage = error instanceof Error ? error.message : "Compression failed"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
