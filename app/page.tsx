"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SuperAIJudge = dynamic(() => import("./super_ai_judge/page"), { ssr: false });
const PremierMember = dynamic(() => import("./premier_member/page"), { ssr: false });
const ReiwaAntivirus = dynamic(() => import("./reiwa_antivirus/page"), { ssr: false });
const SNSFlameRisk = dynamic(() => import("./sns_flame_risk/page"), { ssr: false });
const DarkwebLeak = dynamic(() => import("./darkweb_leak/page"), { ssr: false });
const InternetAptitude = dynamic(() => import("./internet_aptitude/page"), { ssr: false });

const FAKE_SERVICES = [
  SuperAIJudge,
  PremierMember,
  ReiwaAntivirus,
  SNSFlameRisk,
  DarkwebLeak,
  InternetAptitude,
];

export default function Home() {
  const [selectedIndex] = useState(() => {
    // This runs only once on mount, client-side only due to ssr: false
    return Math.floor(Math.random() * FAKE_SERVICES.length);
  });
  
  const SelectedService = FAKE_SERVICES[selectedIndex];
  return <SelectedService />;
}
