// AZRYL AI - Vanilla Frontend Client
let sessionId = 'session_' + Math.random().toString(36).substring(2, 9);
const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const docsBtn = document.getElementById('docsBtn');
const docsModal = document.getElementById('docsModal');
const closeDocsBtn = document.getElementById('closeDocsBtn');

// Auto resize textarea
if (userInput) {
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
  });

  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

function appendMessage(role, content) {
  const row = document.createElement('div');
  row.className = `message-row ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerText = content;

  if (role === 'ai') {
    const footer = document.createElement('div');
    footer.className = 'bubble-footer';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '📋 Salin';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(content);
      copyBtn.innerHTML = '✅ Tersalin';
      setTimeout(() => { copyBtn.innerHTML = '📋 Salin'; }, 2000);
    };

    footer.appendChild(copyBtn);
    bubble.appendChild(footer);
  }

  row.appendChild(bubble);
  chatHistory.appendChild(row);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTypingIndicator() {
  const row = document.createElement('div');
  row.className = 'message-row ai';
  row.id = 'typingIndicatorRow';

  const bubble = document.createElement('div');
  bubble.className = 'bubble typing-indicator';
  bubble.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;

  row.appendChild(bubble);
  chatHistory.appendChild(row);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicatorRow');
  if (el) el.remove();
}

async function sendMessage(overrideText) {
  const text = (overrideText || userInput.value || '').trim();
  if (!text) return;

  if (!overrideText) {
    userInput.value = '';
    userInput.style.height = 'auto';
  }

  appendMessage('user', text);
  showTypingIndicator();
  sendBtn.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, sessionId })
    });

    const data = await res.json();
    removeTypingIndicator();

    if (data.success) {
      appendMessage('ai', data.message);
      if (data.sessionId) sessionId = data.sessionId;
    } else {
      appendMessage('ai', '⚠️ Error: ' + (data.error || 'Terjadi masalah saat memproses pesan.'));
    }
  } catch (err) {
    removeTypingIndicator();
    appendMessage('ai', '⚠️ Gagal terhubung ke server backend.');
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// Quick prompts
window.askPrompt = function(text) {
  sendMessage(text);
};

// Clear chat
if (clearBtn) {
  clearBtn.onclick = async () => {
    if (confirm('Bersihkan percakapan?')) {
      try {
        await fetch('/api/chat/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch (e) {}
      chatHistory.innerHTML = '';
      appendMessage('ai', 'Halo! Saya azrylasissten. Ada yang bisa saya bantu hari ini?');
    }
  };
}

// API Docs Modal Toggle
if (docsBtn && docsModal) {
  docsBtn.onclick = () => { docsModal.style.display = 'flex'; };
}
if (closeDocsBtn && docsModal) {
  closeDocsBtn.onclick = () => { docsModal.style.display = 'none'; };
}
