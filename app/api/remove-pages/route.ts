import { PDFDocument } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const pages = formData.get("pages") as string

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    const pageNumbers = pages
      .split(",")
      .map((p) => Number.parseInt(p.trim()) - 1)
      .filter((p) => p >= 0 && p < pdf.getPageCount())
      .sort((a, b) => b - a)

    pageNumbers.forEach((pageNum) => {
      pdf.removePage(pageNum)
    })

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="removed.pdf"',
      },
    })
  } catch (error) {
    console.error("Remove pages error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Remove failed" }, { status: 500 })
  }
}
