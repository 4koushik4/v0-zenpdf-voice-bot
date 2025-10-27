import express from "express"
import { PDFDocument, rgb } from "pdf-lib"

const router = express.Router()

router.post("/sign", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { signature_text, position } = req.body
    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const lastPage = pdf.getPage(pdf.getPageCount() - 1)
    const { width, height } = lastPage.getSize()

    let x, y
    if (position === "bottom-right") {
      x = width - 150
      y = 30
    } else if (position === "bottom-left") {
      x = 30
      y = 30
    } else {
      x = width / 2 - 50
      y = 30
    }

    lastPage.drawText(signature_text, {
      x,
      y,
      size: 14,
      color: rgb(0, 0, 0),
    })

    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="signed.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Sign error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
