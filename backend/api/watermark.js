import express from "express"
import { PDFDocument, rgb } from "pdf-lib"

const router = express.Router()

router.post("/watermark", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { text, opacity } = req.body
    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const pages = pdf.getPages()

    pages.forEach((page) => {
      const { width, height } = page.getSize()
      page.drawText(text, {
        x: width / 2 - 100,
        y: height / 2,
        size: 60,
        color: rgb(0.5, 0.5, 0.5),
        opacity: Number.parseFloat(opacity) || 0.3,
        rotate: -45,
      })
    })

    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="watermarked.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Watermark error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
