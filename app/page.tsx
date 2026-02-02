"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const SuperAIBalance = dynamic(() => import("./components/fake-services/SuperAIBalance"), { ssr: false });
const PremierMemberAuth = dynamic(() => import("./components/fake-services/PremierMemberAuth"), { ssr: false });
const ReiwaAntivirusDiagnosis = dynamic(() => import("./components/fake-services/ReiwaAntivirusDiagnosis"), { ssr: false });
const SNSFlameRiskScore = dynamic(() => import("./components/fake-services/SNSFlameRiskScore"), { ssr: false });
const DarkWebLeakCheck = dynamic(() => import("./components/fake-services/DarkWebLeakCheck"), { ssr: false });
const InternetAptitudeDiagnosis = dynamic(() => import("./components/fake-services/InternetAptitudeDiagnosis"), { ssr: false });

const FAKE_SERVICES = [
  SuperAIBalance,
  PremierMemberAuth,
  ReiwaAntivirusDiagnosis,
  SNSFlameRiskScore,
  DarkWebLeakCheck,
  InternetAptitudeDiagnosis,
];

export default function Home() {
  const [selectedIndex] = useState(() => {
    // This runs only once on mount, client-side only due to ssr: false
    return Math.floor(Math.random() * FAKE_SERVICES.length);
  });
  
  const SelectedService = FAKE_SERVICES[selectedIndex];
  return <SelectedService />;
}
