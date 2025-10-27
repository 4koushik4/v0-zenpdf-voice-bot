# Voice Commands Reference

## Getting Started

1. Click the microphone button
2. Say a command
3. Follow the prompts

## Available Commands

### Help & Information

- "Help" - List all available operations
- "What can you do?" - List all operations
- "Show operations" - List all operations

### PDF Operations

#### Compression
- "Compress PDF" - Start compression
- "Compress" - Start compression
- "Reduce size" - Start compression

#### Merging
- "Merge PDFs" - Start merge
- "Merge" - Start merge
- "Combine PDFs" - Start merge

#### Splitting
- "Split PDF" - Start split
- "Split" - Start split
- "Separate pages" - Start split

#### Extraction
- "Extract pages" - Start extraction
- "Extract" - Start extraction
- "Get pages" - Start extraction

#### Removal
- "Remove pages" - Start removal
- "Delete pages" - Start removal
- "Remove" - Start removal

#### Rotation
- "Rotate PDF" - Start rotation
- "Rotate" - Start rotation
- "Turn pages" - Start rotation

#### Reordering
- "Reorder pages" - Start reordering
- "Reorder" - Start reordering
- "Rearrange" - Start reordering

#### Watermarking
- "Add watermark" - Start watermarking
- "Watermark" - Start watermarking
- "Mark PDF" - Start watermarking

#### Page Numbers
- "Add page numbers" - Start numbering
- "Page numbers" - Start numbering
- "Number pages" - Start numbering

#### Blank Pages
- "Insert blank page" - Start insertion
- "Add blank page" - Start insertion
- "Insert page" - Start insertion

#### PDF Insertion
- "Insert PDF" - Start PDF insertion
- "Insert" - Start PDF insertion
- "Add PDF" - Start PDF insertion

#### Unlocking
- "Unlock PDF" - Start unlocking
- "Unlock" - Start unlocking
- "Remove password" - Start unlocking

#### Signing
- "Add signature" - Start signing
- "Sign PDF" - Start signing
- "Sign" - Start signing

#### Password Protection
- "Protect with password" - Start protection
- "Password protect" - Start protection
- "Protect" - Start protection

## Tips

- Speak clearly and naturally
- Wait for the bot to finish speaking before giving next command
- Use operation names as they appear in the interface
- Say "Cancel" to stop current operation
- Say "Help" anytime to see available operations

## Troubleshooting

### Voice not recognized
- Speak louder and clearer
- Check microphone is working
- Try a different browser
- Ensure microphone permissions are granted

### Wrong operation selected
- Be more specific with operation name
- Say the full operation name
- Try saying "Help" first to see exact names

### Microphone not working
- Check browser permissions
- Ensure microphone is connected
- Try refreshing the page
- Try a different browser

## Supported Languages

Currently English (US) is supported. Other languages can be added by modifying the `lang` property in `VoiceBot.jsx`.

## Custom Commands

To add custom commands, edit the `handleUserInput` function in `VoiceBot.jsx` and add new conditions for your commands.
