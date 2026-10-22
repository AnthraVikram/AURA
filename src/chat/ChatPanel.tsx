import { NOT_AI_NOTE } from "./supportedOperations";
import { useChatSession } from "../app/ChatSessionContext";

export function ChatPanel({ variant = "dock" }: { variant?: "hero" | "dock" }) {
  const { messages, text, failedKeep, setText, send } = useChatSession();
  const value = text || failedKeep;

  return (
    <section className={`card chat-col ${variant}`} aria-label="Universal chat">
      {variant === "dock" ? <h2>AURA chat</h2> : null}
      <p className="empty chat-note">{NOT_AI_NOTE}</p>
      <div className="transcript" aria-live="polite">
        {messages.map((m) => (
          <p key={m.id} className={`bubble ${m.role}`}>
            <strong>{m.role === "user" ? "You" : "AURA"}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div className="chat-composer">
        <textarea
          aria-label="Chat message"
          rows={1}
          placeholder="Ask AURA anything…"
          value={value}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="button" onClick={send}>
          Send
        </button>
      </div>
    </section>
  );
}
