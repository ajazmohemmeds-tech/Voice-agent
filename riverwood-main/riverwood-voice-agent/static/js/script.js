let selectedLanguage = "english";
let recognition;
let isRecording = false;

// Initialize speech recognition
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
} else if ("SpeechRecognition" in window) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";
}

// DOM elements
const chatMessages = document.getElementById("chatMessages");
const textInput = document.getElementById("textInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const status = document.getElementById("status");
const langBtns = document.querySelectorAll(".lang-btn");
const typingIndicator = document.getElementById("typingIndicator");
const historyToggle = document.getElementById("historyToggle");
const historySidebar = document.getElementById("historySidebar");
const closeHistory = document.getElementById("closeHistory");
const historyContent = document.getElementById("historyContent");

// Greeting on load
window.addEventListener("load", () => {
  setTimeout(() => {
    const greeting =
      selectedLanguage === "hindi"
        ? "Namaste! Main Riverwood AI hoon. Construction ke baare mein kuch bhi puchiye!"
        : "Hello! I am Riverwood AI. Ask me anything about the construction project!";
    addMessageWithVoice(greeting, "bot");
  }, 1000);
});

// Language selection
langBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    langBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedLanguage = btn.dataset.lang;

    if (recognition) {
      recognition.lang = selectedLanguage === "hindi" ? "hi-IN" : "en-US";
    }

    status.textContent = `Language: ${
      selectedLanguage === "hindi" ? "Hindi/English" : "English"
    } ✓`;
    setTimeout(() => (status.textContent = ""), 2000);
  });
});

// History sidebar toggle
historyToggle.addEventListener("click", () => {
  historySidebar.classList.add("open");
  loadHistory();
});

closeHistory.addEventListener("click", () => {
  historySidebar.classList.remove("open");
});

// Load conversation history
async function loadHistory() {
  try {
    const response = await fetch("/history");
    const data = await response.json();

    if (data.history.length === 0) {
      historyContent.innerHTML =
        '<p class="no-history">No conversations yet</p>';
      return;
    }

    historyContent.innerHTML = "";
    data.history.forEach((item) => {
      const historyItem = document.createElement("div");
      historyItem.className = `history-item ${item.type}`;
      historyItem.innerHTML = `
                <div class="time">${item.time}</div>
                <div class="message-text">${item.message}</div>
            `;
      historyContent.appendChild(historyItem);
    });
  } catch (error) {
    console.error("Error loading history:", error);
  }
}

// Send message
sendBtn.addEventListener("click", () => sendMessage());
textInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Voice input
voiceBtn.addEventListener("click", () => {
  if (!recognition) {
    status.textContent = "❌ Speech recognition not supported";
    return;
  }

  if (isRecording) {
    recognition.stop();
    voiceBtn.classList.remove("recording");
    isRecording = false;
    status.textContent = "";
  } else {
    recognition.start();
    voiceBtn.classList.add("recording");
    isRecording = true;
    status.textContent = "🎤 Listening...";
  }
});

if (recognition) {
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    textInput.value = transcript;
    sendMessage();
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("recording");
    isRecording = false;
    status.textContent = "";
  };

  recognition.onerror = (event) => {
    status.textContent = "❌ Error: " + event.error;
    voiceBtn.classList.remove("recording");
    isRecording = false;
  };
}

async function sendMessage() {
  const message = textInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  textInput.value = "";

  // Show typing indicator
  typingIndicator.style.display = "flex";
  chatMessages.scrollTop = chatMessages.scrollHeight;
  status.textContent = "💭 Thinking...";

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language: selectedLanguage }),
    });

    const data = await response.json();

    // Hide typing indicator
    typingIndicator.style.display = "none";

    // PRELOAD audio first, then start both together
    await addMessageWithVoice(data.response, "bot");
  } catch (error) {
    typingIndicator.style.display = "none";
    status.textContent = "❌ Error: " + error.message;
  }
}

function addMessage(text, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// FIXED: Preload audio FIRST, then start voice + typing together
async function addMessageWithVoice(text, type) {
  status.textContent = "⚡ Loading voice...";

  try {
    // Step 1: Fetch and preload audio COMPLETELY before doing anything
    const response = await fetch("/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Step 2: Preload the audio element
    audio.preload = "auto";
    audio.load();

    // Step 3: Wait for audio to be ready to play
    await new Promise((resolve) => {
      audio.oncanplaythrough = resolve;
      // Fallback timeout in case oncanplaythrough doesn't fire
      setTimeout(resolve, 100);
    });

    // Step 4: Create message div
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = "";
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    status.textContent = "🔊 Speaking...";

    // Step 5: START BOTH AT EXACT SAME TIME
    audio.play(); // Start audio
    startTypingAnimation(messageDiv, text); // Start typing

    // Clean up when audio ends
    audio.onended = () => {
      status.textContent = "";
    };

    audio.onerror = (error) => {
      console.error("Audio playback error:", error);
      status.textContent = "";
    };
  } catch (error) {
    // Fallback: show text immediately if audio fails
    console.error("Voice error:", error);
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    status.textContent = "❌ Voice unavailable";
    setTimeout(() => (status.textContent = ""), 3000);
  }
}

// Separate typing animation function
function startTypingAnimation(messageDiv, text) {
  let index = 0;
  const typingSpeed = 30; // 30ms per character

  const typeWriter = () => {
    if (index < text.length) {
      messageDiv.textContent += text.charAt(index);
      index++;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(typeWriter, typingSpeed);
    }
  };

  typeWriter();
}

// Create particles dynamically on mouse move (extra interactivity)
document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.95) {
    createMouseParticle(e.clientX, e.clientY);
  }
});

function createMouseParticle(x, y) {
  const particle = document.createElement("div");
  particle.style.position = "fixed";
  particle.style.width = "5px";
  particle.style.height = "5px";
  particle.style.borderRadius = "50%";
  particle.style.background = "rgba(0, 212, 255, 0.8)";
  particle.style.left = x + "px";
  particle.style.top = y + "px";
  particle.style.pointerEvents = "none";
  particle.style.zIndex = "999";
  particle.style.animation = "fade-out 1s forwards";

  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 1000);
}

// Add fade-out animation
const style = document.createElement("style");
style.textContent = `
    @keyframes fade-out {
        to {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
`;
document.head.appendChild(style);
// About Modal functionality
const aboutToggle = document.getElementById("aboutToggle");
const aboutModal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

// Open About modal
aboutToggle.addEventListener("click", () => {
  aboutModal.classList.add("show");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
});

// Close modal when X button is clicked
closeModal.addEventListener("click", () => {
  aboutModal.classList.remove("show");
  document.body.style.overflow = "auto"; // Restore scrolling
});

// Close modal when clicking outside the modal content
aboutModal.addEventListener("click", (e) => {
  if (e.target === aboutModal) {
    aboutModal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && aboutModal.classList.contains("show")) {
    aboutModal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
});
