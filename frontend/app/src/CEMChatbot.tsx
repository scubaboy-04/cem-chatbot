import { useState, useRef, useEffect } from 'react';

type Role = 'user' | 'assistant';
type Mode = 'chat' | 'quiz' | 'explain' | 'scenario';

interface Message {
  role: Role;
  content: string;
}

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: 'chat',     label: 'Chat',              emoji: '💬' },
  { id: 'quiz',     label: 'Quiz me',            emoji: '📝' },
  { id: 'explain',  label: 'Explain a concept',  emoji: '📖' },
  { id: 'scenario', label: 'Scenario practice',  emoji: '🏢' },
];

const QUICK_PROMPTS = [
  { label: 'Nevada regs',     text: 'What are the key Nevada environmental regulations I need to know?' },
  { label: 'Hazardous waste', text: 'Explain RCRA hazardous waste requirements.' },
  { label: 'Clean Water Act', text: 'Explain the Clean Water Act and NPDES permits.' },
  { label: 'Quiz me',         text: 'Quiz me on Nevada environmental compliance.' },
];
export default function CEMChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('chat');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string, overrideMode?: Mode) => {
    if (!text.trim() || loading) return;
    setInput('');
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      // POST to the NestJS backend at /chat
      // This is the frontend equivalent of the article's ActionProvider call
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,               // history BEFORE the new message
          newMessage: text,       // the new message
          mode: overrideMode ?? mode,
        }),
      });

      const data = await res.json();
      // The backend returns { response, messages } — use the full updated history
      setMessages(data.messages);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: 'Sorry, something went wrong. Is the server running?' },
      ]);
    }

    setLoading(false);
  };

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    if (newMode !== 'chat') {
      sendMessage(`Switch to ${newMode} mode.`, newMode);
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
          CEM
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>CEM Study Assistant</h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Powered by Claude via NestJS</p>
        </div>
      </div>

      {/* Mode buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeSwitch(m.id)}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
              border: '1px solid',
              borderColor: mode === m.id ? '#185FA5' : '#ddd',
              background: mode === m.id ? '#185FA5' : 'white',
              color: mode === m.id ? 'white' : '#555',
            }}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div
        ref={chatRef}
        style={{ border: '1px solid #e5e5e5', borderRadius: 12, height: 380, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12, background: '#fafafa' }}
      >
        {messages.length === 0 && (
          <p style={{ color: '#aaa', fontSize: 14, margin: 'auto', textAlign: 'center' }}>
            Select a mode above or type a question to get started.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? '#eee' : '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0, color: msg.role === 'user' ? '#555' : '#185FA5' }}>
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 14, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap', background: msg.role === 'user' ? '#185FA5' : '#fff', color: msg.role === 'user' ? 'white' : '#222', border: msg.role === 'assistant' ? '1px solid #e5e5e5' : 'none' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#185FA5' }}>AI</div>
            <div style={{ padding: '10px 14px', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 14, fontSize: 14, color: '#aaa' }}>Thinking…</div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {QUICK_PROMPTS.map((q) => (
          <button key={q.label} onClick={() => sendMessage(q.text)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer', color: '#555' }}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask anything about the CEM exam..."
          style={{ flex: 1, padding: '10px 14px', fontSize: 14, border: '1px solid #ddd', borderRadius: 8, outline: 'none' }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading}
          style={{ padding: '10px 20px', background: '#185FA5', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
