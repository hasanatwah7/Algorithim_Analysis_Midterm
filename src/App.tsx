import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { Compass } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/Button";
import { DashboardPage } from "@/pages/DashboardPage";
import { StudyPage } from "@/pages/StudyPage";
import { PatternsPage } from "@/pages/PatternsPage";
import { SolvePage } from "@/pages/SolvePage";
import { MockPage } from "@/pages/MockPage";
import { SpeedrunPage } from "@/pages/SpeedrunPage";

function NotFoundPage() {
  return (
    <div className="glass mx-auto flex max-w-[520px] flex-col items-center rounded-[22px] px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-ember/25 bg-ember/[0.07] text-ember">
        <Compass size={22} />
      </span>
      <div className="font-mono text-[10px] tracking-[0.16em] text-dim">404 · LOST</div>
      <h1 className="mt-2 text-[20px] font-bold tracking-[-0.03em] text-chalk">
        This page doesn't exist
      </h1>
      <p className="mt-2 max-w-[40ch] text-[12px] leading-6 text-mist">
        The link may be old or mistyped. Head back home and pick one of the three
        departments.
      </p>
      <Link to="/" className="mt-5">
        <Button variant="primary">Back home</Button>
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="study" element={<StudyPage />} />
          <Route path="patterns" element={<PatternsPage />} />
          <Route path="solve" element={<SolvePage />} />
          <Route path="mock" element={<MockPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="speedrun" element={<SpeedrunPage />} />
      </Routes>
    </HashRouter>
  );
}
