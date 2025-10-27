# Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/zenpdf-voice-bot.git
cd zenpdf-voice-bot

# Setup backend
cd backend
npm install
npm run dev

# In another terminal, setup frontend
cd frontend
npm install
npm run dev
\`\`\`

## Code Style

- Use ES6+ syntax
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns
- Use consistent indentation (2 spaces)

## Commit Messages

- Use clear, descriptive messages
- Start with verb (Add, Fix, Update, etc.)
- Keep messages concise
- Reference issues when applicable

Example:
\`\`\`
Add watermark feature to PDF operations
Fix CORS error in backend
Update voice command handling
\`\`\`

## Pull Request Process

1. Update documentation
2. Add tests if applicable
3. Ensure code passes linting
4. Provide clear PR description
5. Link related issues
6. Wait for review

## Adding New Features

### New PDF Operation

1. Create new file in `backend/api/operation-name.js`
2. Implement operation using pdf-lib
3. Add route to `backend/index.js`
4. Add operation to `frontend/src/utils/operations.js`
5. Test thoroughly
6. Update documentation

### New Voice Command

1. Edit `frontend/src/components/VoiceBot.jsx`
2. Add command pattern to `handleUserInput`
3. Test voice recognition
4. Update voice commands documentation

## Testing

\`\`\`bash
# Test backend
cd backend
npm test

# Test frontend
cd frontend
npm test

# Manual testing
# 1. Start backend: npm run dev
# 2. Start frontend: npm run dev
# 3. Test in browser
\`\`\`

## Documentation

- Update README.md for major changes
- Add comments to complex code
- Update API documentation
- Add troubleshooting tips
- Include examples

## Reporting Issues

Include:
- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages
- Screenshots if applicable

## Feature Requests

Include:
- Clear description
- Use case/motivation
- Proposed implementation
- Examples

## License

By contributing, you agree your code will be licensed under MIT.

## Questions?

Open an issue or contact the maintainers.
