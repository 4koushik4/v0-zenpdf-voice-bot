import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/unlock", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const pdf = await PDFDocument.load(req.files.pdfFile.data, { ignoreEncryption: true })
    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="unlocked.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Unlock error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
