# Security Policy

## Reporting Security Issues

Please email security@zenpdf.com with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

Do not open public issues for security vulnerabilities.

## Security Features

### Data Protection
- Files processed in memory only
- No persistent file storage
- Automatic cleanup after processing
- HTTPS encryption for all transfers

### Input Validation
- File type validation
- File size limits (50MB)
- Input sanitization
- Error handling

### Access Control
- CORS protection
- Origin validation
- No authentication required (add for production)
- Rate limiting (recommended for production)

### Encryption
- HTTPS/TLS for all connections
- PDF password encryption support
- Secure password handling

## Best Practices

### For Users
1. Use strong passwords for protected PDFs
2. Don't share sensitive PDFs via public links
3. Verify file integrity after processing
4. Use HTTPS connections only
5. Keep browser updated

### For Developers
1. Keep dependencies updated
2. Use environment variables for secrets
3. Implement authentication for production
4. Add rate limiting
5. Monitor for suspicious activity
6. Use security headers
7. Implement logging and monitoring
8. Regular security audits

## Compliance

- GDPR compliant (no data storage)
- CCPA compliant (no data collection)
- No third-party tracking
- No cookies (except session)

## Dependencies

All dependencies are regularly updated for security patches:
- express
- pdf-lib
- jszip
- cors

## Deployment Security

### Vercel
- Automatic HTTPS
- DDoS protection
- Automatic backups
- Security monitoring

### Environment Variables
- Never commit .env files
- Use Vercel dashboard for secrets
- Rotate keys regularly
- Use strong, unique values

## Incident Response

1. Identify and isolate issue
2. Assess impact
3. Notify affected users
4. Implement fix
5. Deploy patch
6. Post-incident review

## Security Updates

- Subscribe to security advisories
- Update dependencies regularly
- Monitor GitHub security alerts
- Test updates before deployment

## Contact

- Security issues: security@zenpdf.com
- General questions: support@zenpdf.com
