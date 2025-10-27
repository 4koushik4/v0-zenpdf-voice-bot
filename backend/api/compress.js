import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/compress", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { quality_level } = req.body
    const pdfDoc = await PDFDocument.load(req.files.pdfFile.data)

    const options = {
      useObjectStreams: true,
      objectsPerTick: quality_level === "High Quality" ? 10 : quality_level === "Medium Quality" ? 50 : 100,
    }

    const pdfBytes = await pdfDoc.save(options)

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="compressed.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Compress error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
