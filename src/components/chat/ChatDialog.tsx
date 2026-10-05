import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  ChevronDown,
  Lightbulb,
  PieChart,
  Radar,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChatTopic, ChatTurn } from "../../lib/conversation.ts";
import { GUIDED_TOPICS } from "../../lib/conversation.ts";
import type { Transaction } from "../../lib/data.ts";
import { inPeriod } from "../../lib/finance.ts";
import Modal from "../ui/Modal.tsx";
import ChatMessage from "./ChatMessage.tsx";
import ChatSuggestions from "./ChatSuggestions.tsx";

const topicIcons: Record<Exclude<ChatTopic, "help">, LucideIcon> = {
  cashflow: ChartNoAxesCombined,
  spending: PieChart,
  unusual: Radar,
  opportunities: Lightbulb,
};

type ChatDialogProps = {
  ledger: Transaction[];
  days: number;
  turns: ChatTurn[];
  onDays: (days: number) => void;
  onAsk: (question: string) => void;
  onReset: () => void;
  onClose: () => void;
};

export default function ChatDialog({
  ledger,
  days,
  turns,
  onDays,
  onAsk,
  onReset,
  onClose,
}: ChatDialogProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const lastTurn = turns.at(-1);
  const transactionCount = inPeriod(ledger, days).length;

  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [turns.length]);

  const ask = (question: string) => {
    if (!question.trim()) return;
    onAsk(question);
    setInput("");
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <Modal
      title="NOVA AI"
      eyebrow="YOUR FINANCIAL COPILOT / DEMO"
      layout="chat"
      initialFocusRef={inputRef}
      onClose={onClose}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-[10px] text-muted">
            <span className="size-1.5 rounded-full bg-sage" />
            <span>Kora Studio · {transactionCount} transactions</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center">
              <span className="sr-only">AI reporting period</span>
              <select
                aria-label="AI reporting period"
                value={days}
                onChange={(e) => onDays(Number(e.target.value))}
                className="appearance-none rounded-full border border-line bg-paper py-2 pr-7 pl-3 text-base md:text-[10px] [@media(pointer:coarse)]:text-base"
              >
                {[7, 30, 90].map((d) => (
                  <option key={d} value={d}>
                    Last {d} days
                  </option>
                ))}
              </select>
              <ChevronDown
                size={11}
                className="pointer-events-none absolute right-2.5"
              />
            </label>
            <button
              type="button"
              aria-label="Start a new conversation"
              disabled={!turns.length}
              onClick={() => {
                onReset();
                setInput("");
                inputRef.current?.focus();
              }}
              className="inline-flex min-h-9 items-center gap-1.5 text-[10px] text-muted transition hover:text-cobalt disabled:opacity-35"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">New conversation</span>
            </button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1">
          <aside
            aria-label="Conversation guide"
            className="hidden w-56 shrink-0 overflow-y-auto overscroll-contain border-r border-line bg-[#f2f3fa] p-5 md:block"
          >
            <p className="mb-4 text-[9px] font-semibold tracking-[.13em] text-muted">
              A GOOD PLACE TO START
            </p>
            <h3 className="mb-3 text-xl leading-tight tracking-[-.04em]">
              A little clarity.
              <br />
              <span className="font-editorial italic">One conversation.</span>
            </h3>
            <ol className="mb-7 space-y-2 text-[11px] leading-5 text-muted">
              <li>1. Choose a reporting period.</li>
              <li>2. Pick a topic or ask a question.</li>
              <li>3. Follow up to go a little deeper.</li>
            </ol>
            <div className="space-y-2">
              {GUIDED_TOPICS.map((topic) => {
                const TopicIcon = topicIcons[topic.id];
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => ask(topic.prompt)}
                    className="flex min-h-12 w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-3 text-left text-[11px] transition hover:border-cobalt/15 hover:bg-white"
                  >
                    <TopicIcon size={15} className="shrink-0 text-cobalt" />
                    <span>{topic.label}</span>
                    <ArrowUpRight
                      size={11}
                      className="ml-auto shrink-0 text-muted"
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-6 border-t border-line pt-4 text-[10px] leading-5 text-muted">
              Try “Explain that” after an insight. New answers use the current
              ledger; earlier messages remain snapshots.
            </p>
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <div
              ref={historyRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-paper/50 p-4 sm:p-6"
            >
              <div
                role="log"
                aria-label="Conversation with NOVA AI"
                aria-live="polite"
                aria-relevant="additions"
                className="space-y-7"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-pale text-cobalt">
                    <Sparkles size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-semibold">NOVA AI</p>
                    <h3 className="mb-2 text-base font-medium tracking-tight">
                      Hello, Kora Studio. What’s your next move?
                    </h3>
                    <p className="text-xs leading-6 text-muted">
                      I can help you understand your cash flow, explore
                      spending, review unusual payments, and find opportunities.
                      Choose a topic below or ask in your own words.
                    </p>
                  </div>
                </div>
                {!turns.length && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {GUIDED_TOPICS.map((topic) => {
                      const TopicIcon = topicIcons[topic.id];
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => ask(topic.prompt)}
                          className="group rounded-xl border border-line bg-white p-4 text-left transition hover:border-cobalt/40 hover:bg-pale/30"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <TopicIcon size={17} className="text-cobalt" />
                            <ArrowUpRight
                              size={13}
                              className="text-muted group-hover:text-cobalt"
                            />
                          </div>
                          <p className="mb-1 text-xs font-medium">
                            {topic.label}
                          </p>
                          <p className="text-[10px] leading-5 text-muted">
                            {topic.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
                {turns.map((turn) => (
                  <ChatMessage key={turn.id} turn={turn} />
                ))}
              </div>
              {lastTurn && (
                <div className="mt-5 sm:ml-11">
                  <p className="mb-2 text-[9px] font-medium tracking-wider text-muted">
                    TAKE THE NEXT STEP
                  </p>
                  <ChatSuggestions
                    suggestions={lastTurn.suggestions}
                    onAsk={ask}
                  />
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-line bg-white p-3 sm:p-4">
              <details className="mb-2 text-[10px] text-muted md:hidden">
                <summary className="cursor-pointer">
                  How to guide the conversation
                </summary>
                <p className="mt-2 leading-5">
                  Choose a period, pick a topic, then follow the suggested
                  questions. “Explain that” adds context. New answers use
                  current activity; previous messages are snapshots.
                </p>
              </details>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-end gap-2 rounded-2xl border border-line bg-paper p-2 pl-3 focus-within:border-cobalt/50"
              >
                <label htmlFor="ai-question" className="sr-only">
                  Ask NOVA AI
                </label>
                <textarea
                  ref={inputRef}
                  id="ai-question"
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      ask(input);
                    }
                  }}
                  maxLength={500}
                  aria-describedby="chat-instructions"
                  placeholder="Ask about your finances…"
                  className="max-h-28 min-w-0 flex-1 resize-none bg-transparent py-2 text-base leading-5 outline-none md:text-xs [@media(pointer:coarse)]:text-base"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send question"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-cobalt text-white transition hover:bg-cobalt-dark disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowRight size={17} />
                </button>
              </form>
              <div
                id="chat-instructions"
                className="mt-2 flex items-center justify-between gap-2 text-[9px] text-muted"
              >
                <span>Enter to send · Shift + Enter for a new line</span>
                <span>{input.length}/500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 shrink-0 text-center text-[9px] leading-4 text-muted">
        Simulated analysis of mock data. No live AI connection or financial
        advice.
      </p>
    </Modal>
  );
}
