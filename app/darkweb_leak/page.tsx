'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DarkwebLeak() {
  const router = useRouter();
  const [leakCount, setLeakCount] = useState(0);
  const [randomLeaks, setRandomLeaks] = useState<string[]>([]);
  const [leakDate, setLeakDate] = useState('');
  const [countdown, setCountdown] = useState(4);
  const [sessionId, setSessionId] = useState('');
  const [particles, setParticles] = useState<{ left: string, top: string, delay: string, text: string }[]>([]);

  useEffect(() => {
    // Client-side only generation to prevent hydration mismatch
    setLeakCount(Math.floor(Math.random() * 8) + 3);

    const exposedData = [
      'メールアドレス',
      'パスワード',
      '電話番号',
      'クレジットカード情報',
      '住所',
      '銀行口座情報',
      'SNSアカウント',
      '個人識別番号'
    ];
    setRandomLeaks(exposedData.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 3));

    setLeakDate(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'));

    setSessionId(Math.random().toString(36).substring(7).toUpperCase());

    setParticles([...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      text: Math.random().toString(16).substring(2, 8)
    })));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/billing');
    }, 4000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-20">
        {particles.map((particle, i) => (
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
        <div className="bg-purple-950/30 backdrop-blur-xl border-2 border-purple-500 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/30">
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
                ⚠️ {leakCount}件の情報漏えいを検出
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-900/50 backdrop-blur border-2 border-purple-600 rounded-xl p-4">
                <div className="text-purple-300 text-xs font-mono mb-2">LEAK_COUNT</div>
                <div className="text-4xl font-black text-red-500">{leakCount}</div>
                <div className="text-red-400 text-xs font-bold mt-1">件</div>
              </div>

              <div className="bg-purple-900/50 backdrop-blur border-2 border-purple-600 rounded-xl p-4">
                <div className="text-purple-300 text-xs font-mono mb-2">MARKET_VALUE</div>
                <div className="text-3xl font-black text-yellow-500">${leakCount * 150}</div>
                <div className="text-yellow-400 text-xs font-bold mt-1">推定取引額</div>
              </div>

              <div className="bg-purple-900/50 backdrop-blur border-2 border-purple-600 rounded-xl p-4">
                <div className="text-purple-300 text-xs font-mono mb-2">LAST_SEEN</div>
                <div className="text-lg font-black text-orange-500">{leakDate}</div>
                <div className="text-orange-400 text-xs font-bold mt-1">最新漏えい</div>
              </div>
            </div>

            {/* Leaked data list */}
            <div className="bg-red-950/30 border-2 border-red-600 rounded-xl p-6 mb-6">
              <div className="text-red-400 font-mono font-bold mb-4">🔓 EXPOSED_DATA:</div>
              <div className="space-y-2">
                {randomLeaks.map((leak, i) => (
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
              className="w-full py-5 px-6 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-black rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-purple-500 font-mono"
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
          SESSION_{sessionId} | SECURE_CONN | DARKWEB_SCANNER_v2026
        </div>
      </div>
    </div>
  );
}
