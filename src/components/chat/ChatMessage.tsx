import { Sparkles } from "lucide-react";
import type { ChatTurn } from "../../lib/conversation.ts";

export default function ChatMessage({ turn }: { turn: ChatTurn }) {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-cobalt px-4 py-3 text-sm leading-6 break-words whitespace-pre-wrap text-white">
          <span className="sr-only">You: </span>
          {turn.question}
        </div>
      </div>
      <article aria-label="NOVA AI response" className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-pale text-cobalt">
          <Sparkles size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs font-semibold">NOVA AI</span>
            <span className="text-[9px] text-muted">
              {turn.days}-day snapshot · {turn.transactionCount} transactions
            </span>
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-line/80 bg-white p-4 sm:p-5">
            <h3 className="mb-2 flex items-start gap-2 text-sm font-semibold leading-6">
              <span
                className={`mt-2 size-1.5 shrink-0 rounded-full ${turn.answer.tone === "attention" ? "bg-amber-600" : turn.answer.tone === "positive" ? "bg-sage" : "bg-cobalt"}`}
              />
              {turn.answer.title}
            </h3>
            <p className="text-xs leading-6 break-words whitespace-pre-wrap text-muted">
              {turn.answer.text}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
