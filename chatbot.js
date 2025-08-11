// ----------------- CONFIG -----------------
const suggestions = [
    "Earthquake safety tips",
    "Flood safety tips",
    "Cyclone safety tips",
    "Fire safety tips",
    "First Aid guide"
];

const responses = {
    "hello": "Hi there! How can I assist you today?",
    "help": "Sure! I can provide safety tips for earthquakes, floods, cyclones, fires, and more.",
    "earthquake": "During an earthquake: Drop, Cover, and Hold On. Stay away from windows. If outdoors, move to an open area.",
    "flood": "During a flood: Move to higher ground immediately. Avoid walking or driving through flood waters.",
    "cyclone": "During a cyclone: Stay indoors, keep away from windows, and listen to official weather updates.",
    "fire": "If there is a fire: Stop, Drop, and Roll if your clothes catch fire. Call emergency services immediately.",
    "first aid": "First Aid Tip: For bleeding, apply pressure to the wound and seek medical help.",
};

// ----------------- DOM ELEMENTS -----------------
const chatBody = document.getElementById("chat-body");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const suggestionsBox = document.getElementById("suggestions");

// ----------------- FUNCTIONS -----------------
function addMessage(content, sender) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.textContent = content;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botResponse(userMsg) {
    userMsg = userMsg.toLowerCase();
    let reply = "Sorry, I don't have information on that. Try asking about earthquakes, floods, cyclones, fires, or first aid.";

    for (let key in responses) {
        if (userMsg.includes(key)) {
            reply = responses[key];
            break;
        }
    }

    addMessage(reply, "bot");
    speak(reply);
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN"; // Indian English accent
    synth.speak(utter);
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support voice recognition");
        return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, "user");
        botResponse(transcript);
    };
}

// ----------------- EVENT LISTENERS -----------------
sendBtn.addEventListener("click", () => {
    const msg = chatInput.value.trim();
    if (msg) {
        addMessage(msg, "user");
        botResponse(msg);
        chatInput.value = "";
    }
});

chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

voiceBtn.addEventListener("click", startVoiceRecognition);

// ----------------- SUGGESTIONS -----------------
suggestions.forEach(text => {
    const btn = document.createElement("button");
    btn.className = "suggestion-btn";
    btn.textContent = text;
    btn.addEventListener("click", () => {
        addMessage(text, "user");
        botResponse(text);
    });
    suggestionsBox.appendChild(btn);
});
