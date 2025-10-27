import express from "express"
import cors from "cors"
import fileUpload from "express-fileupload"
import passwordProtect from "./api/password-protect.js"
import compress from "./api/compress.js"
import merge from "./api/merge.js"
import split from "./api/split.js"
import extractPages from "./api/extract-pages.js"
import removePages from "./api/remove-pages.js"
import rotate from "./api/rotate.js"
import reorder from "./api/reorder.js"
import watermark from "./api/watermark.js"
import pageNumbers from "./api/page-numbers.js"
import insertBlank from "./api/insert-blank.js"
import insertPdf from "./api/insert-pdf.js"
import unlock from "./api/unlock.js"
import sign from "./api/sign.js"

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
)

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  }),
)

// API Routes
app.use("/api", passwordProtect)
app.use("/api", compress)
app.use("/api", merge)
app.use("/api", split)
app.use("/api", extractPages)
app.use("/api", removePages)
app.use("/api", rotate)
app.use("/api", reorder)
app.use("/api", watermark)
app.use("/api", pageNumbers)
app.use("/api", insertBlank)
app.use("/api", insertPdf)
app.use("/api", unlock)
app.use("/api", sign)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({ error: err.message })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
