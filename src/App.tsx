import { useRef, useState } from "react";
import Hero from "./components/Hero.tsx";
import Network from "./components/Network.tsx";
import Dashboard from "./components/Dashboard.tsx";
import Security from "./components/Security.tsx";
import Footer from "./components/Footer.tsx";
import TransferDialog from "./components/TransferDialog.tsx";
import WaitlistDialog from "./components/WaitlistDialog.tsx";
import { ROUTES, TRANSFER_FEE, seedTransactions } from "./lib/data.ts";
import { balanceOf } from "./lib/finance.ts";
import type { Transaction } from "./lib/data.ts";
import { Sparkles } from "lucide-react";
import ChatDialog from "./components/chat/ChatDialog.tsx";
import useNovaConversation from "./hooks/useNovaConversation.ts";

export default function App() {
  const [ledger, setLedger] = useState(seedTransactions);
  const ledgerRef = useRef(ledger);
  const [days, setDays] = useState(30);
  const [route, setRoute] = useState(ROUTES[0]);
  const [modal, setModal] = useState<"transfer" | "waitlist" | "ai" | null>(
    null,
  );
  const conversation = useNovaConversation(ledger, days);
  const [celebrating, setCelebrating] = useState(false);
  const close = () => setModal(null);
  const openAI = (question?: string) => {
    if (question) conversation.ask(question);
    setModal("ai");
  };
  const confirm = (amount: number) => {
    if (
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      amount + TRANSFER_FEE > balanceOf(ledgerRef.current)
    )
      return false;
    const id = crypto.randomUUID();
    const timestamp = "2026-10-05T12:00:00+01:00";
    const transfer: Transaction = {
      id,
      timestamp,
      merchant: `Payment to ${route.city}`,
      category: "Transfers",
      direction: "outgoing",
      amountMinor: amount,
      currency: "NGN",
      route: `Lagos → ${route.city}`,
    };
    const fee: Transaction = {
      id: `${id}-fee`,
      timestamp,
      merchant: "NOVA demo transfer fee",
      category: "Fees",
      direction: "outgoing",
      amountMinor: TRANSFER_FEE,
      currency: "NGN",
    };
    const next = [transfer, fee, ...ledgerRef.current];
    ledgerRef.current = next;
    setLedger(next);
    setCelebrating(true);
    return true;
  };
  return (
    <>
      <a
        href="#workspace"
        className="fixed top-2 left-2 z-50 -translate-y-24 rounded-xl bg-cobalt px-5 py-3 text-sm text-white focus:translate-y-0"
      >
        Skip to interactive demo
      </a>
      <Hero onJoin={() => setModal("waitlist")} />
      <main>
        <Network
          route={route}
          onRoute={(r) => {
            setRoute(r);
            setCelebrating(false);
          }}
          onTransfer={() => setModal("transfer")}
          celebrating={celebrating}
        />
        <Dashboard
          ledger={ledger}
          days={days}
          onDays={setDays}
          onOpenAI={openAI}
          onTransfer={() => setModal("transfer")}
        />
        <Security />
      </main>
      <Footer onJoin={() => setModal("waitlist")} />
      <button
        type="button"
        aria-label="Open NOVA AI"
        onClick={() => openAI()}
        className="fixed right-5 bottom-5 z-30 inline-flex min-h-14 items-center gap-2 rounded-full border border-white/30 bg-cobalt px-5 text-xs font-medium text-white shadow-[0_8px_35px_-8px_#3155ec90] transition hover:bg-cobalt-dark sm:right-7 sm:bottom-7"
      >
        <Sparkles size={20} />
        <span className="hidden sm:inline">NOVA AI</span>
      </button>
      {modal === "transfer" && (
        <TransferDialog
          route={route}
          balance={balanceOf(ledger)}
          onConfirm={confirm}
          onClose={close}
        />
      )}
      {modal === "waitlist" && <WaitlistDialog onClose={close} />}
      {modal === "ai" && (
        <ChatDialog
          ledger={ledger}
          days={days}
          turns={conversation.turns}
          onDays={setDays}
          onAsk={conversation.ask}
          onReset={conversation.reset}
          onClose={close}
        />
      )}
    </>
  );
}
