# 🤖 Local AI Chatbot Setup Guide

This app now includes **local AI-powered chatbots** for fake profiles! Each fake profile can have conversations with users using precise initialization prompts, running entirely in the browser without external APIs.

## 🚀 Quick Setup

### 1. Install Dependencies

The local AI chatbot is already integrated! Just install the required package:

```bash
npm install @mlc-ai/web-llm
```

### 2. No Configuration Needed!

Unlike external APIs, the local AI chatbot works out of the box:

- ✅ No API keys required
- ✅ No external dependencies
- ✅ Complete privacy
- ✅ Works offline
- ✅ Free forever

## 🎯 How It Works

### Local AI Engine

- **WebLLM**: Runs Llama-3-8B-Instruct model entirely in the browser
- **WebGPU Acceleration**: Uses your device's GPU for fast inference
- **No Internet Required**: Works completely offline after initial model download
- **Privacy First**: All conversations stay on your device

### Personality System

Each fake profile has a unique personality based on:

- **Age**: Young profiles are energetic, older ones are more experienced
- **Category**: Transport workers, teachers, healthcare workers, etc.
- **Urgency**: Critical causes are more urgent, others are more patient
- **Strike Fund**: Each profile knows about their specific cause

### AI Responses

- Uses local Llama-3-8B-Instruct model for natural conversations
- Falls back to rule-based responses if AI fails
- Responses are in French and match the profile's personality
- Encourages support for the real strike fund

### Example Personalities

**Transport Worker (Alex, 26)**

- Energetic and modern language
- Knows about transportation issues
- Uses transport-related emojis and expressions

**Teacher (Sam, 29)**

- Pedagogical and explanatory
- Uses educational metaphors
- Patient but determined

**Healthcare Worker (Taylor, 24)**

- Empathetic and urgent
- Focuses on solidarity
- Uses medical/health terminology

## 🔧 Customization

### Adding New Personalities

Edit `src/lib/localChatbotService.ts` and modify the `generatePersonality` function:

```typescript
function generatePersonality(profile) {
  // Add your custom personality logic here
  // Based on age, bio, strike fund category, etc.
}
```

### Modifying System Prompts

Update the `generateSystemPrompt` function to change how profiles behave:

```typescript
function generateSystemPrompt(config) {
  // Customize the AI prompt for each profile
  // Include specific instructions, personality traits, etc.
}
```

### Adding New Response Patterns

Modify the `generateFallbackResponse` function for rule-based responses:

```typescript
function generateFallbackResponse(userMessage) {
  // Add new keyword patterns and responses
}
```

## 🎨 Features

- **Local AI responses** using WebLLM (Llama-3-8B-Instruct)
- **Fallback system** when AI fails
- **Loading indicators** for better UX
- **Personality consistency** across conversations
- **Strike fund knowledge** for each profile
- **French language support** throughout
- **Complete privacy** - no data leaves your device
- **Offline capability** - works without internet

## 🚨 Important Notes

1. **Model Download**: First load downloads ~4GB model (one-time)
2. **WebGPU Required**: Needs modern browser with WebGPU support
3. **Memory Usage**: Uses ~6-8GB RAM during inference
4. **Performance**: Responses take 2-5 seconds (local processing)

## 🔍 Troubleshooting

### AI Not Loading

- Check browser supports WebGPU (Chrome/Edge recommended)
- Ensure sufficient RAM (8GB+ recommended)
- Check browser console for errors
- App will fall back to rule-based responses

### Slow Responses

- Normal for local AI processing
- First response may be slower (model loading)
- Subsequent responses are faster
- Rule-based responses are instant

### Wrong Personality

- Check the profile data in `src/lib/fakeProfiles.ts`
- Modify personality logic in `localChatbotService.ts`
- Test with different profile types

### Model Download Issues

- Ensure stable internet connection for initial download
- Check available disk space (4GB+ needed)
- Try refreshing the page if download fails

## 🎉 Enjoy!

Your fake profiles can now have real conversations! Each one will:

- Respond naturally in French
- Stay in character
- Promote their specific strike fund
- Encourage user engagement

The chatbot makes the app much more engaging while still directing users to real causes!
