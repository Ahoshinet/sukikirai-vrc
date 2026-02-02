"use client";

import { useState } from "react";
import SuperAIBalance from "./components/fake-services/SuperAIBalance";
import PremierMemberAuth from "./components/fake-services/PremierMemberAuth";
import ReiwaAntivirusDiagnosis from "./components/fake-services/ReiwaAntivirusDiagnosis";
import SNSFlameRiskScore from "./components/fake-services/SNSFlameRiskScore";
import DarkWebLeakCheck from "./components/fake-services/DarkWebLeakCheck";
import InternetAptitudeDiagnosis from "./components/fake-services/InternetAptitudeDiagnosis";

const FAKE_SERVICES = [
  SuperAIBalance,
  PremierMemberAuth,
  ReiwaAntivirusDiagnosis,
  SNSFlameRiskScore,
  DarkWebLeakCheck,
  InternetAptitudeDiagnosis,
];

export default function Home() {
  const [selectedIndex] = useState(() => Math.floor(Math.random() * FAKE_SERVICES.length));
  const SelectedService = FAKE_SERVICES[selectedIndex];

  if (!SelectedService) {
    // Show loading state while determining which service to show
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a0000'
      }}>
        <div style={{ color: '#ff3333', fontSize: '1.5rem', fontFamily: 'monospace' }}>
          LOADING...
        </div>
      </div>
    );
  }

  return <SelectedService />;
}
