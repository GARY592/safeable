const commands = {
    "go to home": () => window.location.href = "index.html",
    "open map": () => window.location.href = "map.html",
    "open chatbot": () => window.location.href = "chatbot.html",
    "open contacts": () => window.location.href = "contacts.html",
    "open settings": () => window.location.href = "settings.html",
    "call emergency": () => window.location.href = "tel:911",  // Change to local emergency number
    "help": () => speak("Say 'open chatbot' to chat, 'open contacts' to see emergency numbers."),
};

// Initialize voice recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = true;
recognition.start();

recognition.onresult = function(event) {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    console.log("Voice Command:", transcript);
    if (commands[transcript]) {
        commands[transcript]();
    }
};
