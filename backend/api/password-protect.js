import express from "express"
import { PDFDocument } from "pdf-lib"

const router = express.Router()

router.post("/password-protect", async (req, res) => {
  try {
    if (!req.files?.pdfFile) {
      return res.status(400).json({ error: "No PDF file uploaded" })
    }

    const { password, output_filename } = req.body
    const pdfDoc = await PDFDocument.load(req.files.pdfFile.data)

    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: "highResolution",
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
    })

    const pdfBytes = await pdfDoc.save()
    const filename = output_filename ? `${output_filename}.pdf` : "protected.pdf"

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.send(Buffer.from(pdfBytes))
  } catch (error) {
    console.error("Password protect error:", error)
    res.status(500).json({ error: error.message })
  }
})

export default router
