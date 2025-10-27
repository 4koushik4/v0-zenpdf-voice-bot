import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/remove-pages", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { pages } = req.body
    const pageIndices = pages
      .split(",")
      .map((p) => Number.parseInt(p.trim()) - 1)
      .sort((a, b) => b - a)

    const pdf = await PDFDocument.load(req.files.pdfFile.data)

    for (const index of pageIndices) {
      if (index >= 0 && index < pdf.getPageCount()) {
        pdf.removePage(index)
      }
    }

    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="removed.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Remove pages error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
