export async function callPDFAPI(
  operation: string,
  file: File,
  additionalData?: Record<string, string>,
): Promise<Blob> {
  const formData = new FormData()
  formData.append("pdfFile", file)

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  console.log("[v0] Calling API:", `/api/${operation}`)
  console.log("[v0] File:", file.name, file.size, file.type)

  try {
    const response = await fetch(`/api/${operation}`, {
      method: "POST",
      body: formData,
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", response.headers.get("content-type"))

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: response.statusText }
      }
      console.error("[v0] API error response:", errorData)
      throw new Error(errorData.error || `API error: ${response.statusText}`)
    }

    const blob = await response.blob()
    console.log("[v0] Success! Blob size:", blob.size)
    return blob
  } catch (error) {
    console.error("[v0] Fetch error:", error)
    throw error
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
