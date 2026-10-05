import { ArrowRight, ArrowUpRight } from "lucide-react";
import Brand from "./ui/Brand.tsx";
import Button from "./ui/Button.tsx";
export default function Footer({ onJoin }: { onJoin: () => void }) {
  return (
    <>
      <section id="join" className="mx-auto max-w-[1320px] px-6 pb-16 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-cobalt px-7 py-14 text-white md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-20 size-[500px] rounded-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 right-0 size-[350px] rounded-full border border-white/15"
          />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="mb-6 text-[10px] tracking-[.15em] text-white/60">
                THE FUTURE DOESN’T WAIT.
              </p>
              <h2 className="text-[clamp(2.8rem,5.7vw,5rem)] leading-[1.02] tracking-[-.06em]">
                Built for what’s next.
                <br />
                <span className="font-editorial italic">Built for you.</span>
              </h2>
              <p className="mt-6 max-w-96 text-sm leading-6 text-white/70">
                Africa is moving forward. Your finances should too.
                <br />
                Be part of the next chapter.
              </p>
            </div>
            <div>
              <Button variant="light" onClick={onJoin} className="px-7">
                Get early access <ArrowRight size={17} />
              </Button>
              <p className="mt-3 text-[9px] text-white/60">
                Explore a local demo waitlist. No real signup.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="mx-auto max-w-[1320px] px-6 pb-8 lg:px-12">
        <div className="flex flex-col justify-between gap-6 border-t border-line pt-7 sm:flex-row sm:items-center">
          <Brand />
          <p className="text-[10px] text-muted">
            Africa’s financial operating system.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-[10px]"
          >
            Back to the beginning <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="mt-7 flex flex-col justify-between gap-2 text-[9px] text-muted sm:flex-row">
          <span>© 2026 NOVA · A fictional frontend experience.</span>
          <span>
            Made for a continent of possibility. All financial activity is
            simulated.
          </span>
        </div>
      </footer>
    </>
  );
}
