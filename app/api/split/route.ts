import { PDFDocument } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const zip = new JSZip()

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(pdf, [i])
      newPdf.addPage(page)
      const pdfBytes = await newPdf.save()
      zip.file(`page_${i + 1}.pdf`, pdfBytes)
    }

    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" })

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="split_pdfs.zip"',
      },
    })
  } catch (error) {
    console.error("Split error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Split failed" }, { status: 500 })
  }
}
