import { ArrowUpRight } from "lucide-react";

export default function ChatSuggestions({
  suggestions,
  onAsk,
}: {
  suggestions: string[];
  onAsk: (question: string) => void;
}) {
  return (
    <div
      className="flex flex-wrap gap-2"
      aria-label="Suggested follow-up questions"
    >
      {suggestions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onAsk(question)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-cobalt/15 bg-white px-3 py-2 text-left text-[11px] text-cobalt transition hover:border-cobalt hover:bg-pale"
        >
          {question}
          <ArrowUpRight size={12} className="shrink-0" />
        </button>
      ))}
    </div>
  );
}
