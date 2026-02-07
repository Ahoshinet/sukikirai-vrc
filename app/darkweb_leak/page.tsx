'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EXPOSED_DATA_TYPES = [
  'メールアドレス',
  'パスワード',
  '電話番号',
  'クレジットカード情報',
  '住所',
  '銀行口座情報',
  'SNSアカウント',
  '個人識別番号'
];

export default function DarkwebLeak() {
  const router = useRouter();
  const [leakData, setLeakData] = useState<{
    leakCount: number;
    randomLeaks: string[];
    leakDate: string;
    sessionId: string;
    particles: { left: string; top: string; delay: string; text: string }[];
  } | null>(null);

  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    // Generate random data on client-side only
    const getSecureRandomValues = (count: number) => {
      const array = new Uint32Array(count);
      crypto.getRandomValues(array);
      return array;
    };

    const randomValues = getSecureRandomValues(50); // Batch random values
    let randIdx = 0;
    const nextRand = () => {
      const val = randomValues[randIdx++] / 0xFFFFFFFF;
      if (randIdx >= randomValues.length) randIdx = 0; // Wrap around if exhausted (unlikely for this usage)
      return val;
    };

    const generatedLeakCount = Math.floor(nextRand() * 8) + 3;

    // Shuffle array using secure random
    const shuffledExposed = [...EXPOSED_DATA_TYPES]
      .map(value => ({ value, sort: nextRand() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, Math.floor(nextRand() * 8) + 3);

    const generatedLeakData = {
      leakCount: generatedLeakCount,
      randomLeaks: shuffledExposed,
      leakDate: new Date(Date.now() - nextRand() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'),
      sessionId: Math.floor(nextRand() * 16777215).toString(16).toUpperCase(), // proper hex
      particles: [...Array(30)].map(() => ({
        left: `${nextRand() * 100}%`,
        top: `${nextRand() * 100}%`,
        delay: `${nextRand() * 3}s`,
        text: Math.floor(nextRand() * 16777215).toString(16).substring(0, 6)
      }))
    };

    setLeakData(generatedLeakData);
  }, []); // Run once on mount

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/billing');
    }, 8000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  if (!leakData) return null; // Prevent hydration mismatch by rendering nothing initially or a loader

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {leakData.particles.map((particle, i) => (
          <div
            key={i}
            className="absolute text-purple-500 font-mono text-xs animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay
            }}
          >
            {particle.text}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        {/* Glitch header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-purple-950/50 backdrop-blur-xl border-2 border-purple-500 rounded-2xl px-8 py-4 shadow-2xl shadow-purple-500/50">
            <div className="text-5xl animate-pulse">🕵️</div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-purple-400 font-mono">DARK WEB SCAN</h1>
              <p className="text-purple-300 text-sm">情報漏えいチェックシステム</p>
            </div>
          </div>
        </div>

        {/* Main terminal-style card */}
        <div className={cn(
          "bg-purple-950/30 backdrop-blur-xl border-2 border-purple-500 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30",
          "transition-all duration-500"
        )}>
          {/* Terminal header */}
          <div className="bg-purple-900/50 px-6 py-3 flex items-center gap-2 border-b border-purple-500">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-purple-300 text-sm font-mono ml-4">darkweb_scanner.exe</div>
          </div>

          <div className="p-8">
            {/* Skull and warning */}
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">💀</div>
              <div className="text-red-500 text-2xl font-black font-mono mb-2">
                ⚠️ {leakData.leakCount}件の情報漏えいを検出
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <StatsCard label="LEAK_COUNT" value={leakData.leakCount} unit="件" color="red" />
              <StatsCard label="MARKET_VALUE" value={`$${leakData.leakCount * 150}`} unit="推定取引額" color="yellow" />
              <StatsCard label="LAST_SEEN" value={leakData.leakDate} unit="最新漏えい" color="orange" />
            </div>

            {/* Leaked data list */}
            <div className="bg-red-950/30 border-2 border-red-600 rounded-xl p-6 mb-6">
              <div className="text-red-400 font-mono font-bold mb-4">🔓 EXPOSED_DATA:</div>
              <div className="space-y-2">
                {leakData.randomLeaks.map((leak, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-black/50 border border-red-900 rounded-lg">
                    <div className="text-red-500 font-mono">▸</div>
                    <div className="text-red-300 font-mono text-sm">{leak}</div>
                    <div className="ml-auto text-red-500 text-xs font-mono bg-red-950 px-2 py-1 rounded">
                      CONFIRMED
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terminal info */}
            <div className="bg-purple-950/50 border border-purple-700 rounded-xl p-4 mb-6 font-mono text-xs">
              <div className="flex justify-between mb-2">
                <span className="text-purple-400">SCAN_RANGE:</span>
                <span className="text-purple-200">Tor Network / Darknet Markets</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-purple-400">DATABASE:</span>
                <span className="text-purple-200">1.5B leaked records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">THREAT_LEVEL:</span>
                <span className="text-red-500 font-bold">CRITICAL</span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => router.push('/billing')}
              className={cn(
                "w-full py-5 px-6 rounded-xl shadow-lg border-2 font-mono text-xl font-black text-white",
                "bg-linear-to-r from-purple-600 to-pink-600",
                "hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-[1.02]",
                "active:scale-[0.98]",
                "shadow-purple-500/50 border-purple-500",
                "transition-all duration-300"
              )}
            >
              &gt; ACCESS_FULL_REPORT
            </button>

            {/* Countdown */}
            <div className="text-center mt-4 text-purple-400 text-sm font-mono">
              AUTO_REDIRECT... [{countdown}s]
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-purple-500/60 text-xs font-mono">
          SESSION_{leakData.sessionId} | SECURE_CONN | DARKWEB_SCANNER_v2026
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, unit, color }: { label: string, value: string | number, unit: string, color: 'red' | 'yellow' | 'orange' }) {
  const variants = {
    red: {
      value: "text-red-500",
      unit: "text-red-400",
    },
    yellow: {
      value: "text-yellow-500",
      unit: "text-yellow-400",
    },
    orange: {
      value: "text-orange-500",
      unit: "text-orange-400",
    }
  };

  const styles = variants[color];

  return (
    <div className="bg-purple-900/50 backdrop-blur border-2 border-purple-600 rounded-xl p-4">
      <div className="text-purple-300 text-xs font-mono mb-2">{label}</div>
      <div className={cn("text-3xl font-black", styles.value)}>{value}</div>
      <div className={cn("text-xs font-bold mt-1", styles.unit)}>{unit}</div>
    </div>
  );
}
