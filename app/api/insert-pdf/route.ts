import { PDFDocument } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const insertFile = formData.get("insertFile") as File
    const position = Number.parseInt(formData.get("position") as string) || 1

    if (!file || !insertFile) {
      return NextResponse.json({ error: "Both PDF files required" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const insertArrayBuffer = await insertFile.arrayBuffer()

    const pdf = await PDFDocument.load(arrayBuffer)
    const insertPdf = await PDFDocument.load(insertArrayBuffer)

    const copiedPages = await pdf.copyPages(insertPdf, insertPdf.getPageIndices())

    copiedPages.forEach((page, index) => {
      pdf.insertPage(position - 1 + index, page)
    })

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="inserted.pdf"',
      },
    })
  } catch (error) {
    console.error("Insert PDF error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Insert PDF failed" }, { status: 500 })
  }
}
