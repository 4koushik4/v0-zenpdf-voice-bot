import express from "express"
import { PDFDocument, rgb } from "pdf-lib"

const router = express.Router()

router.post("/page-numbers", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { position, start_number } = req.body
    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const pages = pdf.getPages()
    const startNum = Number.parseInt(start_number) || 1

    pages.forEach((page, index) => {
      const { width, height } = page.getSize()
      const pageNum = startNum + index
      let x, y

      if (position === "bottom-center") {
        x = width / 2 - 10
        y = 20
      } else if (position === "bottom-right") {
        x = width - 50
        y = 20
      } else {
        x = 30
        y = height - 30
      }

      page.drawText(pageNum.toString(), {
        x,
        y,
        size: 12,
        color: rgb(0, 0, 0),
      })
    })

    const pdfBytes = await pdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="numbered.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Page numbers error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
