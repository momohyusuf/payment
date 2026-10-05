import { useEffect, useId, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  layout?: "default" | "chat";
  eyebrow?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export default function Modal({
  title,
  onClose,
  children,
  layout = "default",
  eyebrow = "NOVA / INTERACTIVE DEMO",
  initialFocusRef,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    initialFocusRef?.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [initialFocusRef]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={`fixed inset-0 m-auto w-[calc(100%-2rem)] rounded-3xl border border-line bg-paper text-ink shadow-2xl backdrop:bg-ink/45 backdrop:backdrop-blur-sm ${layout === "chat" ? "h-[min(780px,92svh)] max-w-4xl overflow-hidden p-4 open:flex open:flex-col sm:p-6" : "max-h-[90svh] max-w-lg overflow-y-auto p-6 sm:p-9"}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Tab") return;
        const controls = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((control) => control.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          onClose();
      }}
    >
      <div
        className={`flex shrink-0 items-center justify-between ${layout === "chat" ? "mb-3" : "mb-7"}`}
      >
        <span className="text-[10px] font-semibold tracking-[.13em] text-muted">
          {eyebrow}
        </span>
        <button
          type="button"
          aria-label="Close dialog"
          className="grid size-10 place-items-center rounded-full border border-line hover:bg-white"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <h2
        id={titleId}
        className={`shrink-0 text-3xl tracking-[-.04em] ${layout === "chat" ? "mb-4" : "mb-6"}`}
      >
        {title}
      </h2>
      {children}
    </dialog>
  );
}
