const chat = document.getElementById("chat");
const micBtn = document.getElementById("micBtn");
const stateText = document.getElementById("state");
const reactor = document.getElementById("reactor");

function addMessage(who, text) {
  const item = document.createElement("div");
  item.className = "message " + (who === "YOU" ? "user" : "jarvis");
  const label = document.createElement("b");
  label.textContent = who;
  const body = document.createElement("p");
  body.textContent = text;
  item.append(label, body);
  chat.appendChild(item);
  chat.scrollTop = chat.scrollHeight;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.96;
  utterance.pitch = 0.9;
  window.speechSynthesis.speak(utterance);
}

function reply(text) {
  addMessage("JARVIS", text);
  speak(text);
}

function handleCommand(raw) {
  const command = raw.trim();
  if (!command) return;
  addMessage("YOU", command);
  const q = command.toLowerCase();
  let answer;

  if (q.includes("time")) {
    answer = "The current time is " + new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) + ".";
  } else if (q.includes("date") || q.includes("today")) {
    answer = "Today is " + new Date().toLocaleDateString("en-IN", {weekday:"long", day:"numeric", month:"long", year:"numeric"}) + ".";
  } else if (q.includes("hello") || q.includes("hi jarvis") || q === "hello") {
    answer = "Hello. Systems are online. How may I help you?";
  } else if (q.includes("your name") || q.includes("who are you")) {
    answer = "I am JARVIS, your personal assistant prototype.";
  } else if (q.includes("how are you")) {
    answer = "All systems are functioning within normal parameters.";
  } else if (q.includes("open youtube")) {
    answer = "Opening YouTube.";
    window.open("https://www.youtube.com", "_blank");
  } else if (q.includes("open google")) {
    answer = "Opening Google.";
    window.open("https://www.google.com", "_blank");
  } else if (q.includes("open whatsapp")) {
    answer = "Trying to open WhatsApp.";
    window.location.href = "https://wa.me/";
  } else if (q.includes("joke")) {
    answer = "Why did the computer get cold? It left its Windows open.";
  } else if (q.includes("thank")) {
    answer = "You're welcome. Always at your service.";
  } else if (q.includes("stop") || q.includes("quiet")) {
    window.speechSynthesis.cancel();
    answer = "Voice output stopped.";
  } else {
    answer = "I heard you say: " + command + ". My basic prototype mode is active. A connected AI brain is needed for open-ended questions.";
  }
  reply(answer);
}

document.getElementById("chatForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.getElementById("textInput");
  handleCommand(input.value);
  input.value = "";
});

document.getElementById("clearBtn").addEventListener("click", () => {
  chat.replaceChildren();
  addMessage("JARVIS", "Conversation log cleared. Ready for your next command.");
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => {
    micBtn.classList.add("listening");
    stateText.textContent = "LISTENING...";
    reactor.style.filter = "brightness(1.4)";
  };
  recognition.onend = () => {
    micBtn.classList.remove("listening");
    stateText.textContent = "TAP THE MIC TO SPEAK";
    reactor.style.filter = "";
  };
  recognition.onresult = event => handleCommand(event.results[0][0].transcript);
  recognition.onerror = event => {
    stateText.textContent = "MIC ERROR: " + event.error.toUpperCase();
    addMessage("JARVIS", "I couldn't access speech input. Check microphone permission and try again.");
  };
  micBtn.addEventListener("click", () => {
    try { recognition.start(); } catch (error) { recognition.stop(); }
  });
} else {
  micBtn.disabled = true;
  stateText.textContent = "VOICE INPUT NOT SUPPORTED IN THIS BROWSER";
  addMessage("JARVIS", "Voice recognition is not supported here. You can still type commands.");
}
