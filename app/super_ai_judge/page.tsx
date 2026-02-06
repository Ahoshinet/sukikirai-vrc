'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAIJudge() {
  const router = useRouter();
  const [balance] = useState(() => Math.floor(Math.random() * 1000) - 500);
  const [aiScore] = useState(() => Math.floor(Math.random() * 100));
  const [countdown, setCountdown] = useState(4);
  const [scanning, setScanning] = useState(true);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/billing');
    }, 4000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const scanTimer = setTimeout(() => {
      setScanning(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
      clearTimeout(scanTimer);
    };
  }, [router]);

  const handleRedirect = () => {
    router.push('/billing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />
      
      <div className="relative z-10 max-w-6xl w-full">
        {/* Floating alert badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-cyan-500/20 border-2 border-cyan-400 rounded-full backdrop-blur-sm animate-pulse">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-cyan-400 rounded-full" />
            <span className="text-cyan-300 font-bold text-sm tracking-wider">AI SYSTEM ACTIVE</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - AI Scanner */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-950/80 to-cyan-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
                🤖 AI残高分析
              </h1>
              <p className="text-cyan-200/80 mb-8">
                最先端AIテクノロジーによる精密な財務分析
              </p>

              {/* Scanner animation */}
              <div className="relative h-48 bg-black/50 rounded-xl mb-6 overflow-hidden border border-cyan-500/30">
                {scanning ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 border-4 border-cyan-500/30 rounded-full" />
                      <div className="absolute inset-0 w-32 h-32 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-cyan-400 text-xs font-mono">SCANNING...</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-green-400 text-6xl animate-bounce">✓</div>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-cyan-300">
                  <span>分析進行状況</span>
                  <span className="font-mono">94%</span>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {/* AI Score Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-300 font-semibold">AI判定スコア</span>
                <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded-full text-yellow-300 text-xs font-bold">
                  要注意
                </div>
              </div>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {aiScore}
                <span className="text-2xl text-cyan-500">/100</span>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 shadow-xl">
              <div className="text-sm text-red-300 mb-2">推定残高</div>
              <div className="text-5xl font-black text-red-400 mb-2">
                ¥{balance.toLocaleString()}
              </div>
              {balance < 0 && (
                <div className="inline-block px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm font-bold animate-pulse">
                  ⚠️ 赤字検出
                </div>
              )}
            </div>

            {/* Risk Level */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">⚡</div>
                <div>
                  <div className="text-sm text-orange-300">リスクレベル</div>
                  <div className="text-2xl font-black text-orange-400">危険</div>
                </div>
              </div>
              <div className="text-xs text-orange-300/80">
                緊急対応が必要です
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleRedirect}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              🔍 詳細レポートを確認
            </button>

            {/* Countdown */}
            <div className="text-center text-cyan-400/60 text-sm font-mono">
              自動的に次のページへ... ({countdown}秒)
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-cyan-500/40 text-xs font-mono">
          Session: {sessionId} | Secure Connection | AI v2026.2
        </div>
      </div>
    </div>
  );
}
