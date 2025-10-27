import { PDFDocument, rgb } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const text = (formData.get("text") as string) || "WATERMARK"

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = pdf.getPages()

    pages.forEach((page) => {
      const { width, height } = page.getSize()
      page.drawText(text, {
        x: width / 2 - 100,
        y: height / 2,
        size: 60,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.5,
      })
    })

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="watermarked.pdf"',
      },
    })
  } catch (error) {
    console.error("Watermark error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Watermark failed" }, { status: 500 })
  }
}
