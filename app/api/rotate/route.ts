import { PDFDocument, degrees } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const angle = Number.parseInt(formData.get("angle") as string) || 90

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    const pages = pdf.getPages()
    pages.forEach((page) => {
      page.setRotation(degrees(angle))
    })

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated.pdf"',
      },
    })
  } catch (error) {
    console.error("Rotate error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Rotation failed" }, { status: 500 })
  }
}
