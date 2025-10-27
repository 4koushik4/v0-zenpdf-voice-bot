import { PDFDocument } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const position = Number.parseInt(formData.get("position") as string) || 1

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)

    const blankPage = pdf.addPage([612, 792])
    const pages = pdf.getPages()

    if (position > 0 && position < pages.length) {
      const lastPage = pages.pop()
      if (lastPage) {
        pdf.insertPage(position - 1, lastPage)
      }
    }

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="with-blank.pdf"',
      },
    })
  } catch (error) {
    console.error("Insert blank error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Insert blank failed" }, { status: 500 })
  }
}
