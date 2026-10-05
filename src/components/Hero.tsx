import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Globe2, Menu, X } from "lucide-react";
import Button from "./ui/Button.tsx";
import Brand from "./ui/Brand.tsx";
import Status from "./ui/Status.tsx";
import NetworkMap from "./NetworkMap.tsx";
import { ROUTES } from "../lib/data.ts";

const links = [
  { href: "#network", label: "The network" },
  { href: "#workspace", label: "Financial intelligence" },
  { href: "#security", label: "Built on trust" },
];
export default function Hero({ onJoin }: { onJoin: () => void }) {
  const [menu, setMenu] = useState(false),
    [route, setRoute] = useState(ROUTES[0]);
  return (
    <>
      <header className="relative z-20 mx-auto flex max-w-[1320px] items-center justify-between border-b border-line px-6 py-6 lg:px-12">
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-9 text-xs text-muted lg:flex"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-cobalt"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button
            variant="dark"
            onClick={onJoin}
            className="hidden min-h-10 px-5 py-2 text-xs sm:inline-flex"
          >
            Get early access <ArrowUpRight size={15} />
          </Button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menu && (
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="absolute top-full right-4 left-4 flex flex-col rounded-2xl border border-line bg-paper p-4 shadow-xl lg:hidden"
          >
            {links.map((l) => (
              <a
                className="rounded-xl p-4 text-sm hover:bg-white"
                key={l.href}
                href={l.href}
                onClick={() => setMenu(false)}
              >
                {l.label}
              </a>
            ))}
            <Button
              onClick={() => {
                setMenu(false);
                onJoin();
              }}
            >
              Get early access <ArrowRight size={16} />
            </Button>
          </nav>
        )}
      </header>
      <section
        id="home"
        className="mx-auto max-w-[1320px] px-6 pt-14 pb-8 lg:px-12 lg:pt-20"
      >
        <div className="grid items-center gap-8 lg:grid-cols-[1.18fr_1fr] lg:gap-4">
          <div className="relative z-10 animate-enter">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-[10px] font-medium tracking-[.06em]">
              <span className="size-1.5 rounded-full bg-cobalt" />
              THE NEXT CHAPTER, BUILT HERE <ArrowUpRight size={12} />
            </p>
            <h1 className="text-[clamp(3.5rem,6.9vw,6.35rem)] leading-[1.01] tracking-[-.075em]">
              Africa’s financial
              <br />
              <span className="font-editorial font-normal italic tracking-[-.065em]">
                operating system.
              </span>
            </h1>
            <p className="mt-7 max-w-[390px] text-[15px] leading-7 text-muted">
              Move money. See the bigger picture. Make your next move.
              <br className="hidden sm:block" /> One intelligent platform for a
              continent going places.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#workspace"
                className="inline-flex min-h-12 items-center gap-5 rounded-full bg-cobalt px-6 py-3 text-sm text-white transition hover:bg-cobalt-dark"
              >
                Explore the demo <ArrowRight size={17} />
              </a>
              <a
                href="#network"
                className="inline-flex min-h-12 items-center gap-3 rounded-full border border-line px-6 py-3 text-sm transition hover:border-ink"
              >
                See the network <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="mt-9 flex items-center gap-3 text-[11px] text-muted">
              <div className="flex -space-x-1.5">
                {["NG", "GH", "KE"].map((country, i) => (
                  <span
                    key={country}
                    className={`grid size-7 place-items-center rounded-full border-2 border-paper text-[8px] font-semibold ${i === 1 ? "bg-[#dfd9bd]" : "bg-[#d9e4d8]"}`}
                  >
                    {country}
                  </span>
                ))}
              </div>
              Built for ambition. Rooted in Africa.
            </div>
          </div>
          <div
            className="relative mx-auto h-[440px] w-full max-w-[490px] lg:h-[535px]"
            aria-label="Explore the interactive miniature network"
          >
            <div className="absolute top-4 right-0 size-[340px] rounded-full border border-line sm:size-[420px]" />
            <div className="absolute top-12 right-8 size-[270px] rounded-full border border-line sm:size-[350px]" />
            <span className="absolute top-5 right-12 text-[80px] font-editorial leading-none text-line">
              ✳
            </span>
            <div className="absolute top-9 right-6 h-[330px] w-[280px] animate-float overflow-hidden rounded-[22px] bg-cobalt shadow-[0_25px_70px_-30px_#3155ec90] sm:top-12 sm:right-9 sm:h-[390px] sm:w-[330px]">
              <div className="flex items-center justify-between px-6 pt-6 text-white">
                <span className="text-sm font-semibold tracking-[-.02em]">
                  NOVA NETWORK
                </span>
                <Globe2 size={18} />
              </div>
              <div className="h-[260px] sm:h-[315px]">
                <NetworkMap selected={route} onSelect={setRoute} compact />
              </div>
              <div className="absolute right-6 bottom-5 left-6 flex items-center justify-between text-[9px] tracking-[.12em] text-white/60">
                <span>ONE CONTINENT. NO LIMITS.</span>
                <span>01 / 05</span>
              </div>
            </div>
            <div className="absolute bottom-11 left-0 w-[260px] rotate-[3deg] rounded-2xl border border-white bg-white/95 p-5 shadow-[0_14px_60px_-20px_#171a2040] sm:bottom-14 sm:w-[300px]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-widest text-muted">
                  BORDERLESS BY DESIGN
                </span>
                <span className="grid size-7 place-items-center rounded-full bg-sage/10 text-sage">
                  <Check size={14} />
                </span>
              </div>
              <div className="flex items-center gap-4 text-xl tracking-[-.04em]">
                Lagos <ArrowRight size={18} className="text-cobalt" />
                {route.city}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="text-xs text-muted">
                  Select a city to explore
                </span>
                <Status>Demo network</Status>
              </div>
            </div>
            <div className="absolute right-0 bottom-4 flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-[10px] text-muted">
              <span className="size-1.5 rounded-full bg-sage" />A world of
              possibility
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-5 border-t border-line pt-6 text-[10px] tracking-[.1em] text-muted sm:flex-row sm:items-center">
          <span>YOUR BUSINESS, WITHOUT THE BORDERS.</span>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <span>PAYMENTS THAT CONNECT</span>
            <span>INTELLIGENCE THAT GUIDES</span>
            <span>CONTROL THAT EMPOWERS</span>
          </div>
          <a
            href="#network"
            className="inline-flex items-center gap-2 text-ink"
          >
            SCROLL TO EXPLORE <ArrowRight size={12} className="rotate-90" />
          </a>
        </div>
      </section>
    </>
  );
}
