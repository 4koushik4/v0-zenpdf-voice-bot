# ZenPDF Voice Bot - Complete Implementation Guide

A full-stack voice-controlled PDF manipulation application with 14+ PDF operations.

## Features

- Voice-controlled interface using Web Speech API
- 14 PDF operations (compress, merge, split, extract, remove, rotate, reorder, watermark, page numbers, insert, unlock, sign, password protect)
- Real-time conversation with bot
- Responsive design
- Serverless deployment ready

## Project Structure

\`\`\`
zenpdf-voice-bot/
├── backend/
│   ├── api/
│   │   ├── password-protect.js
│   │   ├── compress.js
│   │   ├── merge.js
│   │   ├── split.js
│   │   ├── extract-pages.js
│   │   ├── remove-pages.js
│   │   ├── rotate.js
│   │   ├── reorder.js
│   │   ├── watermark.js
│   │   ├── page-numbers.js
│   │   ├── insert-blank.js
│   │   ├── insert-pdf.js
│   │   ├── unlock.js
│   │   └── sign.js
│   ├── index.js
│   ├── package.json
│   ├── vercel.json
│   └── .gitignore
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceBot.jsx
│   │   │   ├── RobotAvatar.jsx
│   │   │   ├── ConversationView.jsx
│   │   │   └── InputCollector.jsx
│   │   ├── utils/
│   │   │   ├── apiClient.js
│   │   │   └── operations.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── App.css
│   │   └── components/
│   │       ├── VoiceBot.css
│   │       ├── RobotAvatar.css
│   │       ├── ConversationView.css
│   │       └── InputCollector.css
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── .env
│   └── .gitignore
└── README.md
\`\`\`

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)

### Local Development

#### Backend Setup

\`\`\`bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:3000
\`\`\`

#### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
\`\`\`

### Environment Variables

#### Backend (.env)
\`\`\`
PORT=3000
FRONTEND_URL=http://localhost:3000
\`\`\`

#### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:3000
\`\`\`

## Deployment to Vercel

### Step 1: Deploy Backend

\`\`\`bash
cd backend
npm install -g vercel
vercel deploy --prod
\`\`\`

Note the backend URL: `https://zenpdf-backend-xxx.vercel.app`

### Step 2: Deploy Frontend

\`\`\`bash
cd frontend
# Update .env with backend URL
echo "VITE_API_URL=https://zenpdf-backend-xxx.vercel.app" > .env
vercel deploy --prod
\`\`\`

Note the frontend URL: `https://zenpdf-bot-xxx.vercel.app`

### Step 3: Update Backend CORS

Update backend `index.js` with frontend URL:
\`\`\`javascript
app.use(cors({
  origin: 'https://zenpdf-bot-xxx.vercel.app',
  credentials: true
}));
\`\`\`

Redeploy backend:
\`\`\`bash
vercel deploy --prod
\`\`\`

## API Endpoints

All endpoints accept POST requests with multipart/form-data:

- `/api/compress` - Compress PDF
- `/api/merge` - Merge multiple PDFs
- `/api/split` - Split PDF into individual pages
- `/api/extract-pages` - Extract specific pages
- `/api/remove-pages` - Remove specific pages
- `/api/rotate` - Rotate PDF pages
- `/api/reorder` - Reorder PDF pages
- `/api/watermark` - Add watermark to PDF
- `/api/page-numbers` - Add page numbers
- `/api/insert-blank` - Insert blank page
- `/api/insert-pdf` - Insert PDF into another
- `/api/unlock` - Remove PDF encryption
- `/api/sign` - Add signature text
- `/api/password-protect` - Protect PDF with password

## Voice Commands

- "Help" - List available operations
- "Compress PDF" - Start compress operation
- "Merge PDFs" - Start merge operation
- "Split PDF" - Start split operation
- And more for each operation...

## Browser Support

- Chrome/Edge 25+
- Firefox 25+
- Safari 14.1+
- Opera 27+

Web Speech API required for voice features.

## Embedding in ZENPDF

Add this iframe to your ZENPDF site:

\`\`\`html
<iframe 
  src="https://zenpdf-bot-xxx.vercel.app" 
  width="100%" 
  height="800px" 
  allow="microphone"
  style="border: none; border-radius: 8px;"
></iframe>
\`\`\`

## Troubleshooting

### Voice not working
- Check browser microphone permissions
- Ensure HTTPS is used (required for Web Speech API)
- Try a different browser

### PDF operations failing
- Check file size (max 50MB)
- Ensure PDF is valid
- Check browser console for errors

### CORS errors
- Verify backend CORS configuration
- Check frontend API URL in .env
- Ensure both are deployed to HTTPS

## Technologies Used

- **Backend**: Express.js, pdf-lib, jszip
- **Frontend**: React, Vite, Web Speech API
- **Deployment**: Vercel
- **Styling**: CSS3 with CSS Variables

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact support.
