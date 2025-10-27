export const OPERATIONS = [
  {
    name: "Compress PDF",
    route: "/compress",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      {
        name: "Quality Level",
        type: "select",
        options: ["High Quality", "Medium Quality", "Low Quality"],
        required: true,
      },
    ],
  },
  {
    name: "Merge PDFs",
    route: "/merge",
    inputs: [{ name: "PDF Files", type: "file-multiple", required: true }],
  },
  {
    name: "Split PDF",
    route: "/split",
    inputs: [{ name: "PDF File", type: "file", required: true }],
  },
  {
    name: "Extract Pages",
    route: "/extract-pages",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Pages", type: "text", placeholder: "1,3,5", required: true },
    ],
  },
  {
    name: "Remove Pages",
    route: "/remove-pages",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Pages", type: "text", placeholder: "2,4", required: true },
    ],
  },
  {
    name: "Rotate PDF",
    route: "/rotate",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Angle", type: "select", options: ["90", "180", "270"], required: true },
    ],
  },
  {
    name: "Reorder Pages",
    route: "/reorder",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Order", type: "text", placeholder: "3,1,2", required: true },
    ],
  },
  {
    name: "Add Watermark",
    route: "/watermark",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Text", type: "text", placeholder: "CONFIDENTIAL", required: true },
      { name: "Opacity", type: "number", min: 0, max: 1, step: 0.1, required: true },
    ],
  },
  {
    name: "Add Page Numbers",
    route: "/page-numbers",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Position", type: "select", options: ["bottom-center", "bottom-right", "top-left"], required: true },
      { name: "Start Number", type: "number", min: 1, required: true },
    ],
  },
  {
    name: "Insert Blank Page",
    route: "/insert-blank",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Position", type: "number", min: 0, required: true },
    ],
  },
  {
    name: "Insert PDF",
    route: "/insert-pdf",
    inputs: [
      { name: "Main PDF", type: "file", required: true },
      { name: "PDF to Insert", type: "file", required: true },
      { name: "Position", type: "number", min: 0, required: true },
    ],
  },
  {
    name: "Unlock PDF",
    route: "/unlock",
    inputs: [{ name: "PDF File", type: "file", required: true }],
  },
  {
    name: "Add Signature",
    route: "/sign",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Signature Text", type: "text", placeholder: "John Doe", required: true },
      { name: "Position", type: "select", options: ["bottom-center", "bottom-right", "bottom-left"], required: true },
    ],
  },
  {
    name: "Protect with Password",
    route: "/password-protect",
    inputs: [
      { name: "PDF File", type: "file", required: true },
      { name: "Password", type: "password", required: true },
    ],
  },
]
