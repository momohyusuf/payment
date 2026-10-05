import { useState } from "react";
import type { Transaction } from "../lib/data.ts";
import { createChatTurn } from "../lib/conversation.ts";
import type { ChatTurn } from "../lib/conversation.ts";

export default function useNovaConversation(
  ledger: Transaction[],
  days: number,
) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);

  const ask = (question: string) => {
    if (!question.trim()) return;
    const id = crypto.randomUUID();
    setTurns((previous) => [
      ...previous,
      createChatTurn(question, id, ledger, days, previous.at(-1)),
    ]);
  };

  return { turns, ask, reset: () => setTurns([]) };
}
