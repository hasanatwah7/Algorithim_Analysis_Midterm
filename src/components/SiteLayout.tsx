import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { LogoMark } from "@/components/Logo";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function SiteLayout() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <Nav />
      <main id="main" className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-[86px] sm:px-6 lg:pb-20">
        <Outlet />
      </main>
      <footer className="mx-auto w-full max-w-[1280px] px-4 pb-24 sm:px-6 lg:pb-8">
        <div className="flex flex-col gap-4 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={26} />
            <div>
              <div dir="ltr" className="font-mono text-[10.5px] tracking-[0.12em] text-mist">
                VECTR // ALGO
              </div>
              <div className="mt-0.5 text-[10.5px] text-dim">
                Algorithms study — all progress stays on your device.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-dim">
            <span>6 chapters</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />
            <span>87 questions</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />
            <span>143 cards</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/15 sm:block" />
            <span>No server · No sign-up</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
