// voiceCommands.js
// Safeable — lightweight, flexible voice navigation & feedback

// Change to your local emergency number if needed
const EMERGENCY_NUMBER = "911";

// Speak helper
function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.cancel(); // stop any previous speech
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.warn("SpeechSynthesis error", e);
  }
}

// Handle recognized transcript with flexible matching
function handleCommand(transcript) {
  if (!transcript) return;
  const t = transcript.toLowerCase();

  // Priority order (more specific first)
  if (t.includes("chatbot") || t.includes("chat")) {
    speak("Opening chatbot");
    window.location.href = "chatbot.html";
    return;
  }
  if (t.includes("map") || t.includes("show map")) {
    speak("Opening map");
    window.location.href = "map.html";
    return;
  }
  if (t.includes("contact") || t.includes("contacts") || t.includes("phone book")) {
    speak("Opening emergency contacts");
    window.location.href = "contacts.html";
    return;
  }
  if (t.includes("setting") || t.includes("settings") || t.includes("privacy")) {
    speak("Opening settings");
    window.location.href = "settings.html";
    return;
  }
  if (t.includes("home") || t === "index") {
    speak("Going to home");
    window.location.href = "index.html";
    return;
  }
  if (t.includes("call") && t.includes("emergency") || t.includes("call emergency") || t.includes("emergency")) {
    speak("Calling emergency number");
    window.location.href = `tel:${EMERGENCY_NUMBER}`;
    return;
  }
  if (t.includes("help") || t.includes("what can I say")) {
    speak("Try saying: open map, open chatbot, open contacts, open settings, or call emergency.");
    return;
  }

  // If not recognized
  speak("Sorry, I didn't understand. Say help to hear commands.");
}

// Start voice recognition and auto-restart on end
function startRecognition() {
  if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
    console.warn("SpeechRecognition not supported");
    return;
  }

  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onstart = () => console.log("Voice: listening");
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    console.log("Voice Command:", transcript);
    handleCommand(transcript);
  };
  recognition.onerror = (e) => {
    console.warn("Voice recognition error", e);
  };
  recognition.onend = () => {
    // Try to restart after a short pause (keeps continuous behavior but avoids infinite loop on some errors)
    setTimeout(() => {
      try { recognition.start(); } catch (err) { console.warn("Restart recognition failed", err); }
    }, 500);
  };

  try {
    recognition.start();
  } catch (e) {
    console.warn("Could not start recognition", e);
  }

  // Expose control (useful for pages to stop recognition)
  window.safeableVoiceRecognition = {
    recognition
  };
}

// Start automatically (safe to remove if you want manual start)
try {
  startRecognition();
} catch (e) {
  console.warn("Voice commands init failed", e);
}
