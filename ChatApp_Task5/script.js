const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const typingIndicator = document.getElementById('typing-indicator');
const clearBtn = document.getElementById('clear-btn');
const statusText = document.getElementById('status-text');

const STORAGE_KEY = 'internee_chat_messages';

// Predefined Bot Responses
const botReplies = {
    hello: "Hello! How can I help you today?",
    hi: "Hey there! How's your day going?",
    internship: "This project is part of the Internee.pk Virtual Internship tasks!",
    task: "This is Task 5: Real-Time Chat App built using HTML, CSS, and modern JavaScript.",
    help: "I can answer questions about the internship, JavaScript, or just chat with you!",
    default: "That sounds interesting! Tell me more about it."
};

// Initial state / Load from LocalStorage
window.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

// Submit Message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    // 1. Send User Message
    const userMsg = {
        sender: 'sent',
        text: text,
        time: getCurrentTime()
    };
    appendMessage(userMsg);
    saveMessageToStorage(userMsg);
    messageInput.value = '';

    // 2. Trigger Bot Response
    triggerBotResponse(text);
});

// Append Message Node to DOM
function appendMessage({ sender, text, time }) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);

    msgDiv.innerHTML = `
        <div class="message-bubble">${escapeHTML(text)}</div>
        <span class="message-time">${time}</span>
    `;

    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

// Bot logic with typing delay
function triggerBotResponse(userText) {
    typingIndicator.classList.remove('hidden');
    statusText.textContent = 'Typing...';
    scrollToBottom();

    setTimeout(() => {
        typingIndicator.classList.add('hidden');
        statusText.textContent = 'Online';

        const replyText = getBotReply(userText);
        const botMsg = {
            sender: 'received',
            text: replyText,
            time: getCurrentTime()
        };

        appendMessage(botMsg);
        saveMessageToStorage(botMsg);
    }, 1200);
}

// Find appropriate bot response
function getBotReply(inputText) {
    const clean = inputText.toLowerCase();
    for (const key in botReplies) {
        if (clean.includes(key) && key !== 'default') {
            return botReplies[key];
        }
    }
    return botReplies.default;
}

// Time Helper
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Scroll feed to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// LocalStorage helpers
function saveMessageToStorage(message) {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    current.push(message);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

function loadChatHistory() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.length > 0) {
        saved.forEach(msg => appendMessage(msg));
    } else {
        // Default greeting if empty
        const welcome = {
            sender: 'received',
            text: "Hi there! Welcome to the chat interface. Feel free to type a message!",
            time: getCurrentTime()
        };
        appendMessage(welcome);
        saveMessageToStorage(welcome);
    }
}

// Clear chat history
clearBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    chatMessages.innerHTML = '';
    loadChatHistory();
});

// Escape HTML for XSS prevention
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}