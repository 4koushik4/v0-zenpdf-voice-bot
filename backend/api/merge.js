import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/merge", async (req, res) => {
  try {
    const files = Object.values(req.files || {}).flat()
    if (files.length < 2) {
      return res.status(400).json({ error: "At least 2 PDF files required" })
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of files) {
      const pdf = await PDFDocument.load(file.data)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }

    const pdfBytes = await mergedPdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="merged.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Merge error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
