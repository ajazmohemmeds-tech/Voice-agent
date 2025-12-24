from flask import Flask, render_template, request, jsonify, send_file
from openai import OpenAI
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings
import os
from dotenv import load_dotenv
import io
import webbrowser
from threading import Timer
import time

load_dotenv()

app = Flask(__name__)

# Initialize clients
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
elevenlabs_client = ElevenLabs(api_key=os.getenv('ELEVENLABS_API_KEY'))

# Conversation memory with timestamps
conversation_history = []
conversation_sessions = []

# Construction updates simulation
construction_updates = [
    "Foundation work is 75% complete at Tower A",
    "Plumbing installation started on floors 1-3",
    "Electrical wiring is 60% done in the East wing",
    "Painting work scheduled to begin next week",
    "Roofing materials delivered yesterday"
]

update_index = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    global conversation_history, update_index, conversation_sessions
    
    data = request.json
    user_message = data.get('message', '')
    language = data.get('language', 'english')
    
    # Store message with timestamp
    timestamp = time.strftime('%I:%M %p')
    
    # Add user message to history
    conversation_history.append({
        "role": "user", 
        "content": user_message,
        "timestamp": timestamp
    })
    
    conversation_sessions.append({
        "type": "user",
        "message": user_message,
        "time": timestamp
    })
    
    # Check if user asks for construction update
    if any(word in user_message.lower() for word in ['update', 'progress', 'construction', 'status']):
        update = construction_updates[update_index % len(construction_updates)]
        update_index += 1
        assistant_message = f"Here's the latest update: {update}"
    else:
        # Generate response using OpenAI with full context
        system_prompt = f"""You are Riverwood AI, a friendly voice assistant for a construction project. 
        Respond in {'Hindi mixed with English' if language == 'hindi' else 'English'}. 
        Keep responses brief (2-3 sentences), conversational, and helpful. 
        Use casual greetings like 'Namaste' or 'Hello' based on language preference.
        Reference previous conversation when relevant."""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Include ALL conversation history for better context
        for msg in conversation_history[-10:]:  # Last 10 messages
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        
        assistant_message = response.choices[0].message.content
    
    # Add assistant response to history
    conversation_history.append({
        "role": "assistant", 
        "content": assistant_message,
        "timestamp": timestamp
    })
    
    conversation_sessions.append({
        "type": "bot",
        "message": assistant_message,
        "time": timestamp
    })
    
    return jsonify({'response': assistant_message})

@app.route('/history', methods=['GET'])
def get_history():
    """Get conversation history"""
    return jsonify({'history': conversation_sessions})

@app.route('/speak', methods=['POST'])
def speak():
    data = request.json
    text = data.get('text', '')
    
    # Generate audio using ElevenLabs
    audio = elevenlabs_client.generate(
        text=text,
        voice="Rachel",
        model="eleven_multilingual_v2",
        voice_settings=VoiceSettings(
            stability=0.5,
            similarity_boost=0.75,
            style=0.5,
            use_speaker_boost=True
        )
    )
    
    audio_bytes = b''.join(audio)
    
    return send_file(
        io.BytesIO(audio_bytes),
        mimetype='audio/mpeg',
        as_attachment=False
    )

@app.route('/reset', methods=['POST'])
def reset():
    global conversation_history, conversation_sessions
    conversation_history = []
    conversation_sessions = []
    return jsonify({'status': 'success'})

def open_browser():
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    Timer(1.5, open_browser).start()
    app.run(debug=True, use_reloader=False)
