import { useRef, useState } from "react";
import { ArrowRight, Check, Globe2 } from "lucide-react";
import type { Route } from "../lib/data.ts";
import { TRANSFER_FEE } from "../lib/data.ts";
import {
  money,
  parseAmount,
  recipientAmount,
  validateTransfer,
} from "../lib/finance.ts";
import Button from "./ui/Button.tsx";
import Modal from "./ui/Modal.tsx";
export default function TransferDialog({
  route,
  balance,
  onConfirm,
  onClose,
}: {
  route: Route;
  balance: number;
  onConfirm: (amount: number) => boolean;
  onClose: () => void;
}) {
  const [value, setValue] = useState("250000"),
    [error, setError] = useState(""),
    [completed, setCompleted] = useState<number | null>(null);
  const locked = useRef(false),
    amount = parseAmount(value),
    receives = amount ? recipientAmount(amount, route.rate) : 0;
  return (
    <Modal
      title={
        completed !== null
          ? "A new connection. Made."
          : "Move your next idea forward."
      }
      onClose={onClose}
    >
      {completed !== null ? (
        <div className="text-center">
          <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-sage/10 text-sage">
            <Check size={28} />
          </span>
          <h3 className="mb-3 text-lg">
            Demo payment delivered to {route.city}
          </h3>
          <p className="text-3xl tracking-tight">
            {money(recipientAmount(completed, route.rate), route.currency, 2)}
          </p>
          <p className="my-5 text-xs leading-6 text-muted">
            {money(completed, "NGN", 2)} plus a {money(TRANSFER_FEE)} demo fee
            was deducted from your simulated balance. Your dashboard and NOVA AI
            now reflect this payment.
          </p>
          <Button
            className="w-full"
            onClick={() => {
              onClose();
              document
                .getElementById("workspace")
                ?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "instant"
                    : "smooth",
                });
            }}
          >
            See updated activity <ArrowRight size={16} />
          </Button>
          <p className="mt-4 text-[10px] text-muted">
            Simulation complete. No real money was moved.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (locked.current) return;
            const result = validateTransfer(value, balance);
            if (result.error || !result.amount) {
              setError(result.error);
              return;
            }
            if (recipientAmount(result.amount, route.rate) <= 0) {
              setError(
                "This amount is too small for the destination currency. Please increase it.",
              );
              return;
            }
            locked.current = true;
            if (onConfirm(result.amount)) setCompleted(result.amount);
            else {
              locked.current = false;
              setError(
                "Your available balance changed. Please review the amount.",
              );
            }
          }}
          noValidate
        >
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="text-[10px] text-muted">From</p>
              <p className="mt-1 text-sm">Lagos · NGN</p>
            </div>
            <ArrowRight size={16} className="text-cobalt" />
            <div className="text-right">
              <p className="text-[10px] text-muted">To</p>
              <p className="mt-1 text-sm">
                {route.city} · {route.currency}
              </p>
            </div>
          </div>
          <label
            htmlFor="transfer-amount"
            className="mb-2 block text-xs font-medium"
          >
            You send (NGN)
          </label>
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-line bg-white px-4">
            <span className="text-lg text-muted">₦</span>
            <input
              autoFocus
              id="transfer-amount"
              inputMode="decimal"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              aria-describedby="transfer-error transfer-balance"
              aria-invalid={!!error}
              className="min-w-0 flex-1 bg-transparent py-4 text-xl outline-none"
            />
          </div>
          <p id="transfer-balance" className="text-[10px] text-muted">
            Available: {money(balance, "NGN", 2)}
          </p>
          <div className="my-6 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">Recipient gets</span>
              <strong className="font-medium">
                {money(receives, route.currency, 2)}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Demo fee</span>
              <span>{money(TRANSFER_FEE)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span>Total deducted</span>
              <strong className="font-medium">
                {money((amount ?? 0) + TRANSFER_FEE, "NGN", 2)}
              </strong>
            </div>
          </div>
          <p className="mb-5 flex items-start gap-2 rounded-xl bg-pale p-3 text-[10px] leading-5 text-cobalt">
            <Globe2 size={14} className="mt-0.5 shrink-0" />
            <span>
              Mock rate: {route.rate.toLocaleString("en-NG")} NGN = 1{" "}
              {route.currency}. Recipient amounts round to the nearest minor
              unit. Arrival: {route.arrival}. These are illustrative rates.
            </span>
          </p>
          {error && (
            <p
              id="transfer-error"
              role="alert"
              className="mb-4 text-xs leading-5 text-red-700"
            >
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Confirm demo payment <ArrowRight size={16} />
          </Button>
          <p className="mt-3 text-center text-[10px] text-muted">
            No real money moves. State resets on refresh.
          </p>
        </form>
      )}
    </Modal>
  );
}
