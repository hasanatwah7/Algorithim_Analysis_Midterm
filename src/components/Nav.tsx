import { NavLink, Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Layers, ListChecks, Timer, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { cn } from "@/lib/format";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/study", label: "Study", icon: BookOpen },
  { to: "/patterns", label: "Patterns", icon: Layers },
  { to: "/solve", label: "Solve", icon: ListChecks },
];

export function Nav() {
  const location = useLocation();

  return (
    <>
      <a
        href="#main"
        className="fixed right-4 top-4 z-[100] -translate-y-24 rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-[#1b1206] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="glass-strong mx-auto flex h-[58px] max-w-[1280px] items-center justify-between gap-4 rounded-[16px] px-3 sm:px-4">
          <Logo compact />

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-[12.5px] font-medium transition-colors",
                    active
                      ? "text-chalk"
                      : "text-dim hover:bg-white/[0.04] hover:text-mist",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full bg-ember" />
                  ) : null}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/mock" className="hidden sm:block">
              <Button variant="quiet" size="sm" className="gap-1.5">
                <Timer size={14} />
                <span>Mock Midterm</span>
              </Button>
            </Link>
            <Link to="/speedrun">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Zap size={14} />
                <span>Speedrun</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="glass-strong fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-[16px] px-1 py-1.5 lg:hidden"
      >
        {links.map((link) => {
          const active =
            link.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(link.to);
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-[58px] flex-col items-center gap-0.5 rounded-[10px] px-2 py-1.5 text-[9.5px] font-medium transition-colors",
                active ? "bg-white/[0.06] text-ember" : "text-dim",
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/mock"
          className={({ isActive }) =>
            cn(
              "flex min-w-[58px] flex-col items-center gap-0.5 rounded-[10px] px-2 py-1.5 text-[9.5px] font-medium transition-colors",
              isActive ? "bg-white/[0.06] text-ember" : "text-dim",
            )
          }
        >
          <Timer size={17} strokeWidth={1.8} />
          <span>Mock</span>
        </NavLink>
      </nav>
    </>
  );
}
