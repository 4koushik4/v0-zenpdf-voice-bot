import { PDFDocument, rgb } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = pdf.getPages()

    pages.forEach((page, index) => {
      const { height } = page.getSize()
      page.drawText(`${index + 1}`, {
        x: 50,
        y: height - 50,
        size: 12,
        color: rgb(0, 0, 0),
      })
    })

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="numbered.pdf"',
      },
    })
  } catch (error) {
    console.error("Page numbers error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Page numbering failed" },
      { status: 500 },
    )
  }
}
