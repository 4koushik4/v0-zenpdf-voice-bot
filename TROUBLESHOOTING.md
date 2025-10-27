# Troubleshooting Guide

## Common Issues

### Voice Features Not Working

**Problem**: Microphone button doesn't respond or voice input not recognized

**Solutions**:
1. Check browser compatibility (Chrome, Firefox, Safari, Edge)
2. Ensure HTTPS is used (required for Web Speech API)
3. Grant microphone permissions when prompted
4. Check microphone is connected and working
5. Try a different browser
6. Clear browser cache and cookies
7. Disable browser extensions that might interfere

### PDF Operations Failing

**Problem**: "Processing failed" error when trying to process PDF

**Solutions**:
1. Check file size (max 50MB)
2. Ensure PDF is valid and not corrupted
3. Try a different PDF file
4. Check browser console for detailed error
5. Verify backend is running/deployed
6. Check API URL in frontend .env file

### CORS Errors

**Problem**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
1. Verify backend CORS configuration in `index.js`
2. Ensure frontend URL is in CORS whitelist
3. Check both frontend and backend are using HTTPS
4. Verify API URL in frontend .env matches backend URL
5. Redeploy backend after CORS changes

### Microphone Permission Denied

**Problem**: Browser shows "Permission denied" for microphone

**Solutions**:
1. Check browser settings for microphone permissions
2. Allow microphone access for the website
3. Check system microphone settings
4. Try incognito/private browsing mode
5. Restart browser

### Backend Not Responding

**Problem**: "Failed to fetch" or timeout errors

**Solutions**:
1. Check backend is running locally: `npm run dev`
2. Verify backend URL in frontend .env
3. Check network connectivity
4. Verify backend is deployed to Vercel
5. Check Vercel deployment logs
6. Ensure all dependencies are installed

### File Download Not Working

**Problem**: PDF file doesn't download after processing

**Solutions**:
1. Check browser download settings
2. Disable browser extensions blocking downloads
3. Try a different browser
4. Check browser console for errors
5. Verify file size is reasonable
6. Try a different PDF operation

### Voice Synthesis Not Working

**Problem**: Bot doesn't speak responses

**Solutions**:
1. Check system volume is not muted
2. Verify browser allows audio playback
3. Check browser audio permissions
4. Try a different browser
5. Disable browser extensions
6. Check browser console for errors

### Slow Performance

**Problem**: Operations take too long or app feels sluggish

**Solutions**:
1. Use smaller PDF files
2. Close other browser tabs
3. Clear browser cache
4. Disable browser extensions
5. Check internet connection speed
6. Try a different browser
7. Restart browser

### Mobile Issues

**Problem**: App doesn't work well on mobile

**Solutions**:
1. Use a modern mobile browser (Chrome, Safari)
2. Ensure microphone permissions are granted
3. Use landscape orientation for better UI
4. Check mobile data connection
5. Try WiFi instead of mobile data
6. Restart browser

## Getting Help

### Check Logs

**Browser Console**:
1. Press F12 to open Developer Tools
2. Go to Console tab
3. Look for error messages
4. Copy error and search online

**Backend Logs** (Vercel):
1. Go to Vercel Dashboard
2. Select backend project
3. Go to Deployments
4. Click on latest deployment
5. Check logs for errors

### Debug Mode

Add this to browser console to enable debug logging:
\`\`\`javascript
localStorage.setItem('DEBUG', 'true');
location.reload();
\`\`\`

### Contact Support

- Check GitHub Issues
- Contact Vercel support
- Check pdf-lib documentation
- Search Stack Overflow

## Performance Tips

1. Use smaller PDF files (< 10MB)
2. Compress PDFs before uploading
3. Close unnecessary browser tabs
4. Use a wired internet connection
5. Use latest browser version
6. Disable browser extensions
7. Clear browser cache regularly

## Security Tips

1. Don't share your backend URL publicly
2. Use HTTPS for all connections
3. Implement authentication for production
4. Add rate limiting
5. Validate all user inputs
6. Use strong passwords for protected PDFs
7. Monitor API usage

## Optimization Tips

1. Enable browser caching
2. Use CDN for static files
3. Optimize PDF files
4. Implement lazy loading
5. Use compression
6. Monitor performance metrics
7. Set up error tracking (Sentry)
