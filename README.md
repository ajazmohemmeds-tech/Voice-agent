# Riverwood AI Voice Agent

A multilingual voice assistant for construction project management with real-time speech recognition, AI-powered responses, and natural voice synthesis.

## Project Overview

This application provides an intelligent voice interface for construction projects, supporting both Hindi and English languages. Users can interact through voice or text to get project updates, ask questions, and receive contextual AI-generated responses with human-like voice output.

## Technology Stack

### Backend Framework

- Flask 3.0.0 - Lightweight Python web framework
- Python 3.8 or higher

### AI and Natural Language Processing

- OpenAI GPT-4o-mini for intelligent response generation
- Model processes last 10 conversation messages for context
- Temperature set to 0.7 for balanced creativity
- Maximum 150 tokens per response

### Voice Processing

- ElevenLabs API for text-to-speech synthesis
- Model: eleven_multilingual_v2
- Voice: Rachel (customizable to other voices)
- Supports 29 plus languages including Hindi and English
- Web Speech API for browser-based speech recognition
- Uses webkitSpeechRecognition for Chrome and Edge browsers
- Supports hi-IN for Hindi and en-US for English

### Frontend Technologies

- HTML5 for semantic markup
- CSS3 for dark theme with animations including gradients, particles, and floating effects
- Vanilla JavaScript ES6 plus with async/await and Fetch API

### Supporting Libraries

- python-dotenv for environment variable management
- flask-cors for Cross-Origin Resource Sharing support

## System Architecture

### Logic Flow

1. User provides input via voice or text
2. Web Speech API captures voice and converts to text in real-time
3. Flask backend receives text via POST request to /chat endpoint
4. System stores message in conversation history
5. OpenAI GPT-4o-mini processes request with context from last 10 messages
6. AI generates contextual response based on construction domain knowledge
7. ElevenLabs converts response text to natural speech audio in MP3 format
8. Audio is preloaded completely before playback
9. Voice plays and text types simultaneously on screen
10. User sees and hears the response at the same time

### Key Features

#### Conversation Memory

- Stores last 10 messages including both user and assistant
- Maintains context across multiple conversation turns
- Enables reference to previous discussions

#### Language Support

- User selects Hindi or English preference
- System prompt adjusts based on language selection
- Voice recognition switches between hi-IN and en-US

#### Construction Updates

- Detects keywords: update, progress, construction, status
- Cycles through predefined construction progress updates
- Can be replaced with real API integration

#### Synchronization

- Fetches text-to-speech audio from ElevenLabs first
- Preloads audio using audio.load() method
- Waits for canplaythrough event to ensure audio is ready
- Starts audio playback and typing animation at exact same moment
- Results in zero perceived delay between voice and text display

## Installation and Setup

### Prerequisites

- Python 3.8 or higher installed
- OpenAI API account with credits
- ElevenLabs API account

### Step 1: Install Dependencies
