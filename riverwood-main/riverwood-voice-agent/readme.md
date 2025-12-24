Perfect! I'll create a clean README.md without emojis and symbols, using only plain text with bullet points.

## Create `README.md`

```markdown
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
```

pip install -r requirements.txt

```

### Step 2: Get API Keys

#### OpenAI API Key
1. Visit platform.openai.com
2. Sign up or log in to your account
3. Navigate to your profile and click API keys
4. Click Create new secret key
5. Name the key (example: Riverwood-Agent)
6. Copy the key immediately as it shows only once
7. Add credits in Settings, Billing section

#### ElevenLabs API Key
1. Visit elevenlabs.io
2. Sign up or log in
3. Look at the left sidebar
4. Click Developers option near the bottom
5. Click API Keys tab at the top
6. Click Create API Key button
7. Give it a name (example: Riverwood)
8. Enable Text to Speech permission
9. Click Create Key
10. Copy the key immediately

### Step 3: Create Environment File

Create a file named .env in the project root:

```

OPENAI_API_KEY=your_openai_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

```

Replace the placeholder text with your actual API keys.

## How to Run the Application

### Method 1: Direct Python Execution

From the project root directory, run:

```

C:/Users/anand/OneDrive/Desktop/riverwood-voice-agent/.venv/Scripts/python.exe app.py

```

Advantages:
- Works immediately without environment activation
- Uses correct virtual environment
- Good for quick testing

Disadvantages:
- Long command path to type
- Must type full path every time

### Method 2: Activate Virtual Environment First (RECOMMENDED)

Step 1: Open terminal in VS Code using Ctrl plus backtick

Step 2: Activate the virtual environment

```

.venv\Scripts\activate

```

You will see (.venv) appear in your terminal prompt

Step 3: Run the application

```

python app.py

```

Step 4: Browser opens automatically at http://127.0.0.1:5000

To stop the server: Press Ctrl plus C in terminal

To deactivate virtual environment: Type deactivate

Advantages:
- Shorter commands to type
- Clear indication of active environment
- Standard Python workflow
- Easy to install new packages using pip install

### Method 3: Create Run Script

Create a file named run.bat in the project root:

```

@echo off
echo Starting Riverwood AI Voice Agent...
call .venv\Scripts\activate
python app.py
pause

```

Usage: Double-click the run.bat file to start the application

## Monthly Cost Estimates

### Cost Breakdown Based on Usage

#### OpenAI GPT-4o-mini Pricing
- Input tokens: 0.150 dollars per 1 million tokens
- Output tokens: 0.600 dollars per 1 million tokens

#### ElevenLabs Pricing Tiers
- Free tier: 10,000 characters per month
- Starter plan: 5 dollars per month for 30,000 characters
- Creator plan: 22 dollars per month for 100,000 characters

#### Flask Hosting
- Development (local): Free
- Production hobby tier: 0 to 7 dollars per month

### Usage Examples

Light Usage (100 conversations per month):
- OpenAI costs: approximately 1 to 2 dollars
- ElevenLabs: Free tier sufficient at 10,000 characters
- Total monthly cost: 1 to 2 dollars

Medium Usage (500 conversations per month):
- OpenAI costs: approximately 5 to 8 dollars
- ElevenLabs: Starter plan at 5 dollars
- Total monthly cost: 10 to 13 dollars

Heavy Usage (2000 conversations per month):
- OpenAI costs: approximately 15 to 25 dollars
- ElevenLabs: Creator plan at 22 dollars
- Total monthly cost: 37 to 47 dollars

### Cost Optimization Strategies
- Cache frequently requested responses to reduce API calls
- Implement rate limiting (example: 50 requests per user per day)
- Use shorter system prompts to minimize token usage
- Consider open-source alternatives for text-to-speech like Coqui TTS or Bark

## Performance Metrics

### Target Performance
- Speech recognition latency: under 500 milliseconds
- LLM response time: under 2 seconds
- Text-to-speech generation: under 1 second
- Total round-trip time: under 4 seconds
- Voice and text synchronization: 0 milliseconds delay

### Current Performance
- Speech recognition: approximately 200 to 300 milliseconds (browser-based)
- LLM response: approximately 1 to 2 seconds using GPT-4o-mini
- TTS generation: approximately 800 milliseconds to 1.5 seconds via ElevenLabs
- Total round-trip: approximately 3 to 4 seconds (optimized)
- Voice-text sync: under 50 milliseconds with preload strategy

## Project Structure

```

riverwood-voice-agent/
├── app.py Main Flask application with API routes
├── requirements.txt Python dependencies list
├── .env API keys configuration (do not commit)
├── .gitignore Ignore .env and .venv folders
├── run.bat Windows run script (optional)
├── README.md This documentation file
├── static/
│ ├── css/
│ │ └── style.css Dark theme styles and animations
│ └── js/
│ └── script.js Voice recognition and UI logic
└── templates/
└── index.html Main user interface with chat and modals

```

## Configuration Options

### Customizable Parameters in app.py

OpenAI Configuration:
- model: Change to gpt-4o for better quality responses
- max_tokens: Increase value for longer responses (default 150)
- temperature: Range 0.0 to 1.0 where lower equals more focused (default 0.7)

ElevenLabs Configuration:
- voice: Options include Adam, Bella, Charlotte, Daniel, Rachel
- model: Use eleven_multilingual_v2 or eleven_turbo_v2 for faster speed

Voice Settings:
- stability: Range 0.0 to 1.0 for voice consistency (default 0.5)
- similarity_boost: Range 0.0 to 1.0 for voice likeness (default 0.75)
- style: Range 0.0 to 1.0 for emotional range (default 0.5)

### Customizable Parameters in script.js

Typing speed: 30 milliseconds per character (adjust for faster or slower)
Recognition language: en-US for English or hi-IN for Hindi

## Security and Privacy

### API Key Management
- Store all keys in .env file
- Never commit .env file to version control
- Add .env to .gitignore file
- Use environment variables in production deployment

### Data Handling
- Conversation history stored in memory only
- Data resets when server restarts
- No persistent database in current implementation
- User audio not stored on server

### Production Recommendations
- Implement HTTPS and SSL encryption
- Add user authentication using OAuth or JWT
- Add rate limiting to prevent abuse
- Ensure GDPR compliance for European Union users
- Store conversations in secure database like PostgreSQL or MongoDB

## Troubleshooting

### Common Issues and Solutions

No microphone access:
- Enable microphone permissions in browser settings
- Check browser security settings

Audio not playing:
- Verify ElevenLabs API quota has not been exceeded
- Confirm API key is correct in .env file
- Check internet connection

OpenAI errors:
- Verify API key is correct
- Ensure account has sufficient credits
- Check OpenAI service status

Import errors:
- Run pip install -r requirements.txt in activated virtual environment
- Verify Python version is 3.8 or higher

Port 5000 already in use:
- Change port in app.py using app.run(port=5001)
- Or stop the other application using port 5000

## Future Enhancements

Planned features for future versions:
- Real-time construction database integration
- User authentication and personalized profiles
- Multi-user conversation history with PostgreSQL
- Sentiment analysis for customer satisfaction tracking
- WebSocket implementation for lower latency streaming
- Progressive Web App PWA for mobile devices
- Analytics dashboard for usage metrics
- Integration with construction management tools like Procore and PlanGrid

## Version Information

- Version: 1.0
- Last Updated: November 11, 2025
- Developer: Anand (Bengaluru, India)

## Support

For technical issues or questions:
- Email: support@riverwood.ai
- GitHub Issues: Project Repository
- Documentation: Project Wiki

## License

This is a prototype for demonstration purposes. For production deployment, implement proper security measures, authentication systems, database persistence, and scalability features.
```

This README.md is now clean and professional with:

- No emojis or decorative symbols
- Clear bullet points and numbered lists
- Professional structure with proper headings
- All technical information preserved
- Easy to read and understand
- Suitable for GitHub or corporate documentation
