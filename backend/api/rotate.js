import express from "express"
import { PDFDocument, degrees } from "pdf-lib"

const router = express.Router()

router.post("/rotate", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { angle } = req.body
    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const pages = pdf.getPages()

    pages.forEach((page) => {
      page.setRotation(degrees(Number.parseInt(angle)))
    })

    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="rotated.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Rotate error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
