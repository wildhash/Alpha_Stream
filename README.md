<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Alpha Stream - Advanced Trading Game

This is a merged version combining the original Alpha Stream with the trading-game-coreengine, creating a comprehensive trading simulation and educational platform.

## Features

### From Original Alpha_Stream
- Interactive trading game with momentum-based gameplay
- Multiple asset types (Crypto & Stocks)
- Real-time score tracking
- Lane-based trading mechanics
- Customizable game configurations

### From trading-game-coreengine
- **Alpaca Integration**: Connect with real market data via Alpaca API
- **AI-Powered Learning**: Gemini AI generates educational content and market analysis
- **Interactive Quizzes**: Test your trading knowledge
- **Market Events**: Real-time news and market event simulation
- **Advanced Visualizations**: Detailed charts with AI-generated annotations
- **Session Summaries**: Track your performance over time
- **Customizable UI**: Image editor for personalized backgrounds
- **Game Effects**: Power-ups and challenges to enhance gameplay
- **Investment Simulator**: Practice trading with simulated funds

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
   - Get your API key from https://aistudio.google.com/app/apikey

3. (Optional) Configure Alpaca API credentials for live market data
   - Sign up at https://alpaca.markets/

4. Run the app:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
Alpha_Stream/
├── components/        # React components
│   ├── HomePage.tsx          # Landing page
│   ├── GameView.tsx          # Main game interface
│   ├── Coach.tsx             # AI trading coach
│   ├── QuizModal.tsx         # Interactive quizzes
│   └── ...                   # Other UI components
├── services/          # External service integrations
│   ├── alpacaService.ts     # Alpaca market data
│   └── geminiService.ts     # Gemini AI integration
├── hooks/             # Custom React hooks
│   ├── useGameLogic.ts      # Game logic
│   └── useAlpacaMarketData.ts # Market data fetching
├── data/              # Static data
│   └── quizQuestions.ts     # Quiz question bank
├── utils/             # Utility functions
├── types.ts           # TypeScript type definitions
└── App.tsx            # Main application component
```

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI**: Google Gemini API
- **Market Data**: Alpaca API
- **Icons**: Lucide React

## View Your App

View your app in AI Studio: https://ai.studio/apps/drive/1glVrrpe-aFzoOm9Q1NrxBrNaylo6CSh2
