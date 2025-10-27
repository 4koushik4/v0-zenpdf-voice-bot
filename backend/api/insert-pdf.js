import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/insert-pdf", async (req, res) => {
  try {
    const files = Object.values(req.files || {}).flat()
    if (files.length < 2) {
      return res.status(400).json({ error: "At least 2 PDF files required" })
    }

    const { position } = req.body
    const mainPdf = await PDFDocument.load(files[0].data)
    const insertPdf = await PDFDocument.load(files[1].data)

    const copiedPages = await mainPdf.copyPages(insertPdf, insertPdf.getPageIndices())
    const insertPos = Number.parseInt(position) || 0

    copiedPages.forEach((page, index) => {
      mainPdf.insertPage(insertPos + index, page)
    })

    const pdfBytes = await mainPdf.save()

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", 'attachment; filename="inserted.pdf"')
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Insert PDF error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
