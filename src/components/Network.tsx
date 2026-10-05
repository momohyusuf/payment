import { ArrowRight, ArrowUpRight, Clock3, Globe2 } from "lucide-react";
import type { Route } from "../lib/data.ts";
import { ROUTES } from "../lib/data.ts";
import SectionHeading from "./ui/SectionHeading.tsx";
import Button from "./ui/Button.tsx";
import Status from "./ui/Status.tsx";
import NetworkMap from "./NetworkMap.tsx";
export default function Network({
  route,
  onRoute,
  onTransfer,
  celebrating,
}: {
  route: Route;
  onRoute: (r: Route) => void;
  onTransfer: () => void;
  celebrating: boolean;
}) {
  return (
    <section
      id="network"
      className="mx-auto max-w-[1320px] px-6 py-20 lg:px-12 lg:py-24"
    >
      <SectionHeading
        number="01"
        label="A continent connected"
        title={
          <>
            Local roots.
            <br />
            <span className="font-editorial italic">Global reach.</span>
          </>
        }
        description="From a team in Lagos to a partner in London. Your money should move as freely as your ideas."
      />
      <div className="grid overflow-hidden rounded-3xl border border-line bg-[#f0f1ee] lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-[370px] sm:min-h-[500px]">
          <div className="absolute top-5 left-5 z-10">
            <Status>
              {celebrating
                ? "Demo payment delivered"
                : "Explore the demo network"}
            </Status>
          </div>
          <div className="h-[390px] sm:h-[510px]">
            <NetworkMap
              selected={route}
              onSelect={onRoute}
              celebrating={celebrating}
            />
          </div>
          <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between text-[9px] tracking-wider text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-cobalt" />
              SELECT A CITY TO EXPLORE
            </span>
            <span>ILLUSTRATIVE NETWORK</span>
          </div>
        </div>
        <div className="border-t border-line bg-white p-7 lg:border-t-0 lg:border-l lg:p-8">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[.12em] text-muted">
              YOUR NEXT CONNECTION
            </span>
            <Globe2 size={18} className="text-muted" />
          </div>
          <div className="flex items-center gap-4">
            <div className="grid size-10 place-items-center rounded-full bg-sage/10 text-[11px] font-semibold text-sage">
              NG
            </div>
            <div>
              <p className="text-lg font-medium tracking-tight">Lagos</p>
              <p className="text-[11px] text-muted">Nigeria · NGN</p>
            </div>
          </div>
          <div className="ml-5 my-3 h-8 border-l border-dashed border-line" />
          <div className="flex items-center gap-4">
            <div className="grid size-10 place-items-center rounded-full bg-pale text-[11px] font-semibold text-cobalt">
              {route.flag}
            </div>
            <div>
              <p className="text-lg font-medium tracking-tight">{route.city}</p>
              <p className="text-[11px] text-muted">
                {route.country} · {route.currency}
              </p>
            </div>
          </div>
          <div className="my-7 space-y-3 border-y border-line py-5 text-xs">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-muted">
                <Clock3 size={13} />
                Simulated arrival
              </span>
              <span>{route.arrival}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Demo transfer fee</span>
              <span>₦100</span>
            </div>
          </div>
          <Button onClick={onTransfer} className="w-full">
            Try this route <ArrowRight size={16} />
          </Button>
          <p className="mt-3 text-center text-[10px] text-muted">
            A simulation. No real money moves.
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ROUTES.map((r) => (
          <button
            type="button"
            key={r.id}
            aria-pressed={route.id === r.id}
            onClick={() => onRoute(r)}
            className={`flex min-h-14 items-center justify-between gap-2 rounded-xl border px-4 text-[11px] transition ${route.id === r.id ? "border-cobalt bg-pale text-cobalt" : "border-line hover:border-cobalt"}`}
          >
            <span>
              Lagos <span className="mx-1 text-muted">↔</span> {r.city}
            </span>
            <ArrowUpRight size={13} />
          </button>
        ))}
      </div>
    </section>
  );
}
