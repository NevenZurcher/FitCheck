# Wardrobe AI 👔✨

An AI-powered wardrobe management and outfit generation web app that helps you create perfect outfits based on your clothes, weather, and preferences.

## Features

- 📸 **Smart Wardrobe Management**: Upload photos of your clothes with automatic AI analysis
- 🤖 **AI-Powered Outfit Generation**: Get personalized outfit suggestions using Gemini AI
- 🌤️ **Weather Integration**: Generate weather-appropriate outfits
- 📱 **Mobile-First Design**: Optimized for use on your phone
- ⭐ **Outfit History**: Save and favorite your generated outfits
- 🔐 **Secure Authentication**: Email/password and Google sign-in

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- A Firebase account
- A Gemini API key
- (Optional) A weather API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up External Services

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication**: Enable Email/Password and Google sign-in
   - **Firestore Database**: Create a database in production mode
   - **Storage**: Enable Firebase Storage
4. Get your Firebase configuration from Project Settings

#### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key

#### Weather API (Optional)

Choose one:
- [OpenWeatherMap](https://openweathermap.org/api) - Free tier: 1000 calls/day
- [WeatherAPI.com](https://www.weatherapi.com/) - Free tier: 1M calls/month

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   VITE_GEMINI_API_KEY=your_gemini_api_key
   
   # Optional
   VITE_WEATHER_API_KEY=your_weather_api_key
   VITE_WEATHER_API_PROVIDER=openweathermap
   ```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with Google
2. **Add Clothes**: Tap the + button to upload photos of your clothing items
   - The AI will automatically analyze the item (category, colors, style, season)
3. **Generate Outfits**:
   - Get current weather (optional)
   - Select an occasion
   - Choose an anchor piece (optional)
   - Tap "Generate Outfit" to get AI suggestions
4. **View History**: See all your generated outfits and mark favorites

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Custom CSS with modern design system
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini (Vision + Text Generation)
- **Weather**: OpenWeatherMap or WeatherAPI
- **Routing**: React Router

## Mobile Installation

To install as a PWA on your mobile device:
1. Open the app in your mobile browser
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"

## Database Schema

### Collections

**users/{userId}**
- email, displayName, createdAt
- preferences: { location, style[] }

**wardrobe/{itemId}**
- userId, imageUrl, imagePath
- category, colors[], season[], style[]
- aiAnalysis, description
- createdAt

**outfits/{outfitId}**
- userId, items[]
- occasion, weather
- aiSuggestion, favorite
- createdAt

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT
