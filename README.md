# CEM Chatbot — NestJS + Anthropic

A CEM (Certified Energy Manager) exam study chatbot built with NestJS on the backend
and React on the frontend, using the Anthropic Claude API.

---

## Project Structure

```
cem-chatbot/
├── src/
│   ├── config/
│   │   └── anthropic.provider.ts   # Registers Anthropic as an injectable provider
│   ├── chat/
│   │   ├── chat.dto.ts             # Request/response data shapes
│   │   ├── chat.service.ts         # Core logic — calls the Anthropic API
│   │   ├── chat.controller.ts      # POST /chat endpoint
│   │   └── chat.module.ts          # Wires everything together
│   ├── app.module.ts               # Root module
│   └── main.ts                     # App entry point
├── frontend/
│   └── src/
│       └── CEMChatbot.tsx          # React chat UI component
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your .env file

```bash
cp .env.example .env
```

Then edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3000
```

Get your key at: https://console.anthropic.com

### 3. Run the backend

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

---

## API Usage

### POST /chat

Send a message and receive a response.

**Request body:**
```json
{
  "messages": [],
  "newMessage": "What are the core domains of the CEM exam?",
  "mode": "chat"
}
```

**Response:**
```json
{
  "response": "The CEM exam covers several key domains...",
  "messages": [
    { "role": "user", "content": "What are the core domains of the CEM exam?" },
    { "role": "assistant", "content": "The CEM exam covers several key domains..." }
  ]
}
```

**Available modes:**
- `chat` — general Q&A (default)
- `quiz` — the AI asks exam questions one at a time and grades your answers
- `explain` — deep explanations of specific CEM topics with formulas and examples
- `scenario` — realistic energy management scenarios to work through

**Conversation history pattern:**
On each request, pass the full `messages` array from the previous response.
This gives the AI full context of the conversation. On the first message, pass `[]`.

```js
// Turn 1
const res1 = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({ messages: [], newMessage: 'Quiz me on HVAC', mode: 'quiz' })
});
const data1 = await res1.json();

// Turn 2 — pass data1.messages as history
const res2 = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({ messages: data1.messages, newMessage: 'The answer is a chiller', mode: 'quiz' })
});
```

---

## Frontend

Copy `frontend/src/CEMChatbot.tsx` into your React app (Vite or Create React App).

```tsx
// App.tsx
import CEMChatbot from './CEMChatbot';

export default function App() {
  return <CEMChatbot />;
}
```

The component calls `http://localhost:3000/chat` — update this URL for production.

---

## How it maps to the article

| Article (OpenAI/NestJS)         | This project                          |
|---------------------------------|---------------------------------------|
| `new OpenAI()`                  | `new Anthropic()`                     |
| `provide: 'OPEN_AI'`            | `provide: 'ANTHROPIC'`                |
| `OPENAI_API_KEY` env var        | `ANTHROPIC_API_KEY` env var           |
| `role: 'system'` message        | Top-level `system:` parameter         |
| `gpt-3.5-turbo`                 | `claude-sonnet-4-20250514`            |
| `chat.completions.create()`     | `messages.create()`                   |
| `response.choices[0].message`   | `response.content[].text`             |
| `react-chatbot-kit`             | Custom `CEMChatbot.tsx` component     |
