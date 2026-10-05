import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import SectionHeading from "./ui/SectionHeading.tsx";
const controls = [
  {
    title: "Access protection",
    subtitle: "The right people. The right access.",
    text: "Imagine a workspace where every person has a clear role. Device checks and access controls are designed to keep sensitive actions in the right hands.",
    icon: Fingerprint,
    stages: ["Device recognized", "Identity verified", "Workspace unlocked"],
  },
  {
    title: "Payment review",
    subtitle: "Confidence before confirmation.",
    text: "See your destination, exchange rate, and fee before sending. In this demo, the payment review catches invalid amounts and checks your available balance.",
    icon: ShieldCheck,
    stages: ["Destination checked", "Balance confirmed", "Ready for review"],
  },
  {
    title: "Activity monitoring",
    subtitle: "A second set of eyes.",
    text: "NOVA AI compares payments with typical activity and brings unusual amounts into focus. An alert is a reason to review, never a claim of fraud.",
    icon: Activity,
    stages: ["Activity compared", "Outliers identified", "You stay in control"],
  },
];
export default function Security() {
  const [selected, setSelected] = useState(0),
    control = controls[selected],
    ControlIcon = control.icon;
  return (
    <section
      id="security"
      className="mx-auto max-w-[1320px] px-6 py-20 lg:px-12 lg:py-24"
    >
      <SectionHeading
        number="03"
        label="Built on trust"
        title={
          <>
            Ambition moves fast.
            <br />
            <span className="font-editorial italic">Confidence keeps up.</span>
          </>
        }
        description="Your business deserves a clear view of every decision. Explore the controls behind the NOVA vision."
      />
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative flex min-h-[370px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-line bg-[#f0f1ec] p-7">
          <div className="absolute size-[310px] rounded-full border border-line" />
          <div className="absolute size-[230px] rounded-full border border-line" />
          <div className="absolute size-[150px] rounded-full border border-line" />
          <div
            key={selected}
            className="relative flex animate-enter flex-col items-center"
          >
            <div className="mb-5 grid size-20 place-items-center rounded-[23px] bg-ink text-white shadow-xl">
              <ControlIcon size={35} strokeWidth={1.25} />
            </div>
            <div className="mb-5 flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-[10px]">
              <LockKeyhole size={12} className="text-sage" />
              Youâ€™re in control
            </div>
            <div className="space-y-2">
              {control.stages.map((stage, i) => (
                <div
                  key={stage}
                  className="flex min-w-56 items-center gap-3 rounded-xl border border-white bg-white/90 px-4 py-2.5 text-[11px]"
                >
                  <span className="grid size-5 place-items-center rounded-full bg-sage/10 text-sage">
                    <Check size={11} />
                  </span>
                  {stage}
                  <span className="ml-auto font-mono text-[9px] text-muted">
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <span className="absolute right-4 bottom-4 text-[8px] tracking-widest text-muted">
            ILLUSTRATIVE PRODUCT CONTROLS
          </span>
        </div>
        <div>
          {controls.map((c, i) => (
            <button
              type="button"
              key={c.title}
              aria-expanded={selected === i}
              aria-controls={`security-panel-${i}`}
              onClick={() => setSelected(i)}
              className="block w-full border-b border-line py-6 text-left"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${selected === i ? "bg-pale text-cobalt" : "bg-white text-muted"}`}
                >
                  <c.icon size={19} />
                </span>
                <div className="flex-1">
                  <h3 className="text-base tracking-tight">{c.title}</h3>
                  <p className="mt-1 text-[11px] text-muted">{c.subtitle}</p>
                </div>
                <ArrowUpRight
                  size={17}
                  className={selected === i ? "text-cobalt" : "text-muted"}
                />
              </div>
              {selected === i && (
                <p
                  id={`security-panel-${i}`}
                  className="mt-4 pl-14 text-xs leading-6 text-muted"
                >
                  {c.text}
                </p>
              )}
            </button>
          ))}
          <p className="mt-5 text-[9px] leading-5 text-muted">
            NOVA is a fictional product. These are illustrative controls, not
            banking certifications or guarantees.
          </p>
        </div>
      </div>
    </section>
  );
}
