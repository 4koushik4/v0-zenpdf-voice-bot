import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/extract-pages", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { pages } = req.body
    const pageIndices = pages.split(",").map((p) => Number.parseInt(p.trim()) - 1)

    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const newPdf = await PDFDocument.create()

    for (const index of pageIndices) {
      if (index >= 0 && index < pdf.getPageCount()) {
        const [page] = await newPdf.copyPages(pdf, [index])
        newPdf.addPage(page)
      }
    }

    const pdfBytes = await newPdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="extracted.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Extract pages error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
