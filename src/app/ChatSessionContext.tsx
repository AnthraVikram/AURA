import { createContext, useContext, useState, type ReactNode } from "react";
import { handleChat } from "../chat/handleChat";
import type { ChatMessage } from "../domain/types";
import { useAppStore } from "./StoreContext";

type ChatSession = {
  messages: ChatMessage[];
  text: string;
  failedKeep: string;
  setText: (v: string) => void;
  send: () => void;
};

const ChatSessionContext = createContext<ChatSession | null>(null);

export function ChatSessionProvider({ children }: { children: ReactNode }) {
  const { store, bump } = useAppStore();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [failedKeep, setFailedKeep] = useState("");

  function updateText(v: string) {
    setText(v);
    setFailedKeep("");
  }

  function send() {
    const value = text.trim() || failedKeep.trim();
    if (!value) return;
    const result = handleChat(value, store);
    setMessages((m) => [...m, result.user, result.aura]);
    bump();
    if (result.aura.outcome === "clarification" || result.aura.outcome === "error") {
      setFailedKeep(value);
    } else {
      setFailedKeep("");
      setText("");
    }
  }

  return (
    <ChatSessionContext.Provider value={{ messages, text, failedKeep, setText: updateText, send }}>
      {children}
    </ChatSessionContext.Provider>
  );
}

export function useChatSession() {
  const ctx = useContext(ChatSessionContext);
  if (!ctx) throw new Error("ChatSessionProvider missing");
  return ctx;
}
