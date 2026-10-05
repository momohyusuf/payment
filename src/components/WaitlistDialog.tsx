import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Button from "./ui/Button.tsx";
import Modal from "./ui/Modal.tsx";
export default function WaitlistDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState(""),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <Modal
      title={
        done
          ? "You’re part of the possibility."
          : "Your next chapter starts here."
      }
      onClose={onClose}
    >
      {done ? (
        <div className="text-center">
          <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-sage/10 text-sage">
            <Check size={27} />
          </span>
          <h3 className="text-lg">
            Demo registration complete—no email was submitted.
          </h3>
          <p className="my-5 text-xs leading-6 text-muted">
            This experience is a local preview of NOVA. Your email stays in this
            dialog’s memory and is discarded when it closes.
          </p>
          <Button className="w-full" onClick={onClose}>
            Keep exploring <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
              setError("Enter a valid email address, such as you@company.com.");
              return;
            }
            setDone(true);
          }}
        >
          <p className="mb-6 text-sm leading-7 text-muted">
            A continent of ambition deserves a financial platform that keeps up.
            Try the early-access experience.
          </p>
          <label
            htmlFor="waitlist-email"
            className="mb-2 block text-xs font-medium"
          >
            Your work email
          </label>
          <input
            autoFocus
            id="waitlist-email"
            type="email"
            maxLength={254}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="you@company.com"
            aria-invalid={!!error}
            aria-describedby="waitlist-note waitlist-error"
            className="mb-4 w-full rounded-xl border border-line bg-white p-4 text-sm"
          />
          {error && (
            <p
              id="waitlist-error"
              role="alert"
              className="mb-4 text-xs text-red-700"
            >
              {error}
            </p>
          )}
          <Button type="submit" className="w-full">
            Join the demo waitlist <ArrowRight size={16} />
          </Button>
          <p
            id="waitlist-note"
            className="mt-4 text-[10px] leading-5 text-muted"
          >
            Local demo only. No real signup, email submission, account creation,
            or persistent storage.
          </p>
        </form>
      )}
    </Modal>
  );
}
