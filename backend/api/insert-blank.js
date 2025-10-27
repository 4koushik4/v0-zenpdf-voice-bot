import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/insert-blank", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { position } = req.body
    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const firstPage = pdf.getPage(0)
    const { width, height } = firstPage.getSize()

    const blankPage = pdf.insertPage(Number.parseInt(position) || 0, [width, height])

    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="with_blank.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Insert blank error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
