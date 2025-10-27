# ZENPDF Backend - Render Deployment Guide

## Complete Step-by-Step Instructions for Deploying on Render

### Prerequisites
- GitHub account with the repository pushed
- Render account (free tier available at render.com)
- Frontend URL (you'll get this after deploying the frontend)

---

## Step 1: Prepare Your Repository

Make sure your backend code is pushed to GitHub with this structure:

\`\`\`
backend/
├── api/
│   ├── compress.js
│   ├── extract-pages.js
│   ├── insert-blank.js
│   ├── insert-pdf.js
│   ├── merge.js
│   ├── page-numbers.js
│   ├── password-protect.js
│   ├── remove-pages.js
│   ├── reorder.js
│   ├── rotate.js
│   ├── sign.js
│   ├── split.js
│   ├── unlock.js
│   └── watermark.js
├── index.js
├── package.json
└── .gitignore
\`\`\`

---

## Step 2: Create Render Service

### 2.1 Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Click "New +" button
3. Select "Web Service"

### 2.2 Connect GitHub Repository
1. Click "Connect account" (if not already connected)
2. Authorize Render to access your GitHub
3. Select your repository: `v0-zenpdf-voice-bot`
4. Select branch: `main`
5. Click "Connect"

### 2.3 Configure Service Settings

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `zenpdf-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon (US West)` (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 2.4 Environment Variables

Click "Advanced" and add these environment variables:

\`\`\`
FRONTEND_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
PORT=3000
\`\`\`

**Important:** Replace `https://your-frontend-url.vercel.app` with your actual frontend URL after you deploy it.

---

## Step 3: Deploy

1. Click "Create Web Service"
2. Render will automatically start building and deploying
3. Wait for the deployment to complete (usually 2-3 minutes)
4. You'll see a green checkmark when deployment is successful
5. Your backend URL will be displayed at the top (e.g., `https://zenpdf-backend.onrender.com`)

---

## Step 4: Verify Deployment

Test your backend is working:

\`\`\`bash
curl https://zenpdf-backend.onrender.com/api/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
\`\`\`

---

## Step 5: Update Frontend Configuration

After getting your backend URL, update your frontend:

1. Go to your frontend project in v0
2. Update the environment variable:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://zenpdf-backend.onrender.com
   \`\`\`
3. Redeploy the frontend to Vercel

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `FRONTEND_URL` | CORS origin - allows requests from your frontend | `https://zenpdf-bot.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Render assigns this) | `3000` |

---

## API Endpoints Available

Once deployed, these endpoints will be available:

### PDF Operations
- `POST /api/compress` - Compress PDF
- `POST /api/merge` - Merge multiple PDFs
- `POST /api/split` - Split PDF into individual pages
- `POST /api/extract-pages` - Extract specific pages
- `POST /api/remove-pages` - Remove specific pages
- `POST /api/rotate` - Rotate pages
- `POST /api/reorder` - Reorder pages
- `POST /api/watermark` - Add watermark
- `POST /api/page-numbers` - Add page numbers
- `POST /api/password-protect` - Password protect PDF
- `POST /api/insert-blank` - Insert blank pages
- `POST /api/insert-pdf` - Insert another PDF
- `POST /api/unlock` - Unlock password-protected PDF
- `POST /api/sign` - Sign PDF

### Health Check
- `GET /api/health` - Check if backend is running

---

## Request Format

All POST endpoints expect:
- **Content-Type:** `multipart/form-data`
- **File field:** `pdfFile` (the PDF to process)
- **Additional fields:** Operation-specific parameters

### Example: Compress PDF

\`\`\`bash
curl -X POST https://zenpdf-backend.onrender.com/api/compress \
  -F "pdfFile=@document.pdf" \
  -F "quality_level=High Quality" \
  -o compressed.pdf
\`\`\`

### Example: Merge PDFs

\`\`\`bash
curl -X POST https://zenpdf-backend.onrender.com/api/merge \
  -F "pdfFile=@file1.pdf" \
  -F "pdfFile=@file2.pdf" \
  -o merged.pdf
\`\`\`

---

## Troubleshooting

### Issue: "Failed to fetch" error in frontend

**Solution:** 
1. Check that `FRONTEND_URL` environment variable is set correctly
2. Verify your frontend URL is accessible
3. Check CORS is enabled (it should be by default)

### Issue: Backend deployment fails

**Solution:**
1. Check that `backend/package.json` exists
2. Verify all dependencies are listed in package.json
3. Check that `backend/index.js` is the main entry point
4. Look at Render logs for specific error messages

### Issue: File upload fails

**Solution:**
1. Check file size is under 50MB
2. Verify `express-fileupload` is in package.json
3. Check that `FRONTEND_URL` allows your frontend domain

### Issue: PDF operations return errors

**Solution:**
1. Verify the PDF file is valid
2. Check that all required parameters are sent
3. Look at backend logs in Render dashboard
4. Test with the health endpoint first

---

## Monitoring & Logs

### View Logs in Render
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. See real-time logs of requests and errors

### Common Log Messages
- `Server running on port 3000` - Backend started successfully
- `CORS enabled for: https://your-frontend.vercel.app` - CORS configured
- `Error: No PDF file uploaded` - Client didn't send PDF file

---

## Performance Tips

1. **File Size Limits:** Currently set to 50MB per file
2. **Timeout:** Render has a 30-second timeout for requests
3. **Memory:** Free tier has 512MB RAM - sufficient for most PDFs
4. **Scaling:** If you need more power, upgrade to paid plan

---

## Cost Estimation

- **Free Tier:** $0/month (includes 750 hours/month)
- **Paid Tier:** $7/month (unlimited hours)
- **Bandwidth:** Included in plan

---

## Next Steps

1. Deploy backend on Render
2. Get your backend URL
3. Update frontend with backend URL
4. Deploy frontend to Vercel
5. Test the complete application

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Test health endpoint: `curl https://your-backend.onrender.com/api/health`
3. Verify environment variables are set correctly
4. Check that frontend URL is in CORS whitelist
