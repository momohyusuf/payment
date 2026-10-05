import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Button from "./ui/Button.tsx";
import { GUIDED_TOPICS } from "../lib/conversation.ts";

export default function Assistant({
  onOpen,
}: {
  onOpen: (question?: string) => void;
}) {
  return (
    <aside
      className="flex h-full flex-col rounded-2xl bg-[#eef0fb] p-6 lg:p-7"
      aria-label="NOVA AI financial assistant"
    >
      <div className="mb-8 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles size={17} className="text-cobalt" />
          NOVA AI
        </span>
        <span className="rounded-full bg-white/70 px-2 py-1 text-[9px] tracking-wider text-cobalt">
          DEMO
        </span>
      </div>
      <h3 className="mb-2 text-[27px] leading-tight tracking-[-.05em]">
        A little clarity.
        <br />
        <span className="font-editorial italic">A lot of possibility.</span>
      </h3>
      <p className="mb-6 text-xs leading-6 text-muted">
        Meet your financial copilot. One conversation to see what matters and
        decide what comes next.
      </p>
      <div className="mb-7 rounded-2xl border border-white bg-white p-5">
        <span className="mb-4 grid size-11 place-items-center rounded-xl bg-pale text-cobalt">
          <MessageCircle size={21} strokeWidth={1.5} />
        </span>
        <h4 className="mb-2 text-sm font-semibold">
          Start with a question.
          <br />
          Leave with a clearer picture.
        </h4>
        <p className="text-xs leading-6 text-muted">
          Pick a guided topic, explore the details, and ask a follow-up. Your
          conversation stays with you while you explore.
        </p>
        <Button onClick={() => onOpen()} className="mt-5 w-full text-xs">
          Chat with NOVA AI <ArrowRight size={15} />
        </Button>
      </div>
      <div className="mt-auto">
        <p className="mb-2 text-[9px] font-medium tracking-wider text-muted">
          A GOOD PLACE TO START
        </p>
        <div className="space-y-1">
          {GUIDED_TOPICS.filter((topic) => topic.id !== "spending").map(
            (topic) => (
              <button
                type="button"
                key={topic.id}
                onClick={() => onOpen(topic.prompt)}
                className="flex min-h-11 w-full items-center justify-between gap-2 border-b border-cobalt/10 text-left text-[11px] transition hover:text-cobalt"
              >
                {topic.prompt}
                <ArrowUpRight size={13} className="shrink-0" />
              </button>
            ),
          )}
        </div>
        <p className="mt-5 text-[9px] leading-4 text-muted">
          Simulated analysis of mock data. No live AI connection or financial
          advice.
        </p>
      </div>
    </aside>
  );
}
