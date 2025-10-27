import { PDFDocument, rgb } from "pdf-lib"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdfFile") as File
    const signatureName = (formData.get("signatureName") as string) || "Signed"

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = pdf.getPages()
    const lastPage = pages[pages.length - 1]
    const { height } = lastPage.getSize()

    lastPage.drawText(`Digitally signed by: ${signatureName}`, {
      x: 50,
      y: height - 100,
      size: 12,
      color: rgb(0, 0, 0),
    })

    lastPage.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: height - 120,
      size: 10,
      color: rgb(0.5, 0.5, 0.5),
    })

    const pdfBytes = await pdf.save()

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="signed.pdf"',
      },
    })
  } catch (error) {
    console.error("Sign error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signing failed" }, { status: 500 })
  }
}
