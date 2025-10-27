import { PDFDocument } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const order = formData.get("order") as string

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const newPdf = await PDFDocument.create()

    const pageOrder = order
      .split(",")
      .map((p) => Number.parseInt(p.trim()) - 1)
      .filter((p) => p >= 0 && p < pdf.getPageCount())

    const copiedPages = await newPdf.copyPages(pdf, pageOrder)
    copiedPages.forEach((page) => newPdf.addPage(page))

    const pdfBytes = await newPdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="reordered.pdf"',
      },
    })
  } catch (error) {
    console.error("Reorder error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Reorder failed" }, { status: 500 })
  }
}
