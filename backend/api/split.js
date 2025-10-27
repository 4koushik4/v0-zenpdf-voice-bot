import express from "express"
import { PDFDocument } from "pdf-lib"
import JSZip from "jszip"

const router = express.Router()

router.post("/split", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const pdf = await PDFDocument.load(req.files.pdfFile.data)
    const zip = new JSZip()

    for (let i = 0; i < pdf.getPageCount(); i++) {
      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(pdf, [i])
      newPdf.addPage(page)
      const pdfBytes = await newPdf.save()
      zip.file(`page_${i + 1}.pdf`, pdfBytes)
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" })

    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", 'attachment; filename="split_pdfs.zip"')
    res.send(zipBuffer)
  } catch (error) {
    console.error("Split error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
