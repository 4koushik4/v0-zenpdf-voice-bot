# ZenPDF Voice Bot - Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (free tier available)
3. Node.js 18+ installed locally
4. Backend API deployed (see Backend Deployment section)

## Quick Start - Deploy to Vercel

### Option 1: Deploy Frontend (Recommended)

The frontend is a Next.js application that connects to your backend API.

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app" > .env.local

# 3. Test locally
npm run dev

# 4. Deploy to Vercel
npm install -g vercel
vercel login
vercel deploy --prod
\`\`\`

### Option 2: Deploy Backend Separately

If you want to deploy the backend separately:

\`\`\`bash
cd backend
npm install
vercel deploy --prod
\`\`\`

Save the backend URL for the frontend environment variable.

## Environment Variables

### Frontend (.env.local)

\`\`\`env
# Backend API URL - Update with your deployed backend
NEXT_PUBLIC_API_URL=https://zenpdf-backend-xxx.vercel.app
\`\`\`

### Backend (Vercel Dashboard)

1. Go to Vercel Dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Add:
   - `FRONTEND_URL`: Your frontend URL (for CORS)
   - `NODE_ENV`: production

## Step-by-Step Deployment

### Step 1: Deploy Backend

\`\`\`bash
cd backend
npm install
vercel deploy --prod
\`\`\`

Note the backend URL: `https://zenpdf-backend-xxx.vercel.app`

### Step 2: Update Backend CORS

Edit `backend/index.js` and update the CORS origin:

\`\`\`javascript
app.use(cors({
  origin: 'https://zenpdf-bot-xxx.vercel.app', // Your frontend URL
  credentials: true
}));
\`\`\`

Redeploy:
\`\`\`bash
vercel deploy --prod
\`\`\`

### Step 3: Deploy Frontend

\`\`\`bash
# Create environment file with backend URL
echo "NEXT_PUBLIC_API_URL=https://zenpdf-backend-xxx.vercel.app" > .env.local

# Deploy to Vercel
vercel deploy --prod
\`\`\`

Note the frontend URL: `https://zenpdf-bot-xxx.vercel.app`

## Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured for frontend URL
- [ ] Voice input works (microphone button)
- [ ] File upload works
- [ ] PDF operations process correctly
- [ ] Downloaded files are valid

## Testing

### Local Testing

\`\`\`bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev

# Visit http://localhost:3000
\`\`\`

### Production Testing

1. Visit your frontend URL
2. Click the microphone button to test voice input
3. Upload a PDF file
4. Request an operation (e.g., "compress this PDF")
5. Download and verify the processed file

## Troubleshooting

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Verify frontend URL in backend CORS config
2. Ensure both frontend and backend use HTTPS
3. Check browser console for exact error message
4. Redeploy backend after updating CORS

### Voice Control Not Working

**Error**: Microphone button doesn't respond

**Solution**:
1. Ensure HTTPS is used (required for Web Speech API)
2. Check browser microphone permissions
3. Try a different browser (Chrome, Edge, Safari)
4. Check browser console for errors

### File Upload Issues

**Error**: `Please select a valid PDF file`

**Solution**:
1. Ensure file is a valid PDF
2. Check file size (max 50MB)
3. Try a different PDF file
4. Check backend logs for errors

### 502 Bad Gateway

**Error**: Backend returns 502 error

**Solution**:
1. Check backend logs in Vercel Dashboard
2. Verify all dependencies are installed
3. Check for syntax errors in backend code
4. Ensure Node.js version is 18+

### API Connection Failed

**Error**: `Failed to connect to API`

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend is deployed and running
3. Verify CORS is configured
4. Check network tab in browser DevTools

## Performance Optimization

### Frontend

\`\`\`bash
# Build for production
npm run build

# Test production build locally
npm start
\`\`\`

### Backend

- Use serverless functions (Vercel handles this)
- Monitor function execution time
- Optimize PDF processing for large files

## Scaling Considerations

For production use:

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Implement user authentication
3. **File Size Limits**: Set appropriate limits (default 50MB)
4. **Monitoring**: Set up error tracking (Sentry, LogRocket)
5. **Analytics**: Track usage patterns
6. **Caching**: Implement caching for frequently used operations

## Cost Estimation

- **Vercel Free Tier**: 100GB bandwidth/month, unlimited deployments
- **PDF Processing**: Runs on serverless functions (included in free tier)
- **Storage**: No persistent storage needed
- **Estimated Cost**: $0-20/month for small to medium usage

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## Next Steps

1. Deploy to Vercel
2. Test all features
3. Share with users
4. Monitor performance
5. Gather feedback
6. Iterate and improve
