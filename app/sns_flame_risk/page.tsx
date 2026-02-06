'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SNSFlameRisk() {
  const router = useRouter();
  const [riskScore] = useState(() => Math.floor(Math.random() * 40) + 60);
  const [flameCount] = useState(() => Math.floor(Math.random() * 15) + 5);
  const [countdown, setCountdown] = useState(4);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

  // Pre-generate particle positions
  const [particles] = useState(() => {
    return [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 2}s`
    }));
  });

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

  const riskLevel = riskScore > 80 ? '極めて高い' : riskScore > 60 ? '高い' : '中程度';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated flame particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-70 animate-ping"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Alert header */}
        <div className="bg-yellow-400 text-red-900 px-6 py-4 rounded-t-3xl text-center font-black text-xl border-4 border-red-800 shadow-2xl">
          ⚠️ 炎上リスク警告 ⚠️
        </div>

        {/* Main card */}
        <div className="bg-white rounded-b-3xl border-x-4 border-b-4 border-red-800 shadow-2xl overflow-hidden">
          {/* Flame animation header */}
          <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 p-8 text-center">
            <div className="text-7xl mb-4 animate-bounce">🔥</div>
            <h1 className="text-4xl font-black text-white mb-2">
              SNS炎上リスク診断
            </h1>
            <p className="text-red-100 font-semibold">
              AI分析による炎上予測システム【精度99.8%】
            </p>
          </div>

          <div className="p-8">
            {/* Risk score display */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 mb-6 border-4 border-red-300">
              <div className="text-center">
                <div className="text-6xl mb-4">🔥</div>
                <div className="text-2xl font-bold text-red-700 mb-2">炎上リスク度</div>
                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4">
                  {riskScore}%
                </div>
                <div className="inline-block px-6 py-3 bg-red-600 text-white rounded-full text-xl font-black shadow-lg">
                  判定: {riskLevel}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-xl p-4 border-2 border-orange-300">
                <div className="text-orange-800 text-sm font-semibold mb-1">危険な投稿数</div>
                <div className="text-4xl font-black text-red-600">{flameCount}件</div>
              </div>

              <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-4 border-2 border-red-300">
                <div className="text-red-800 text-sm font-semibold mb-1">拡散予測人数</div>
                <div className="text-3xl font-black text-red-600">{(flameCount * 1234).toLocaleString()}人</div>
              </div>
            </div>

            {/* SNS platforms */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6 border-2 border-orange-200">
              <div className="text-sm text-orange-900 font-semibold mb-2">📱 分析対象SNS</div>
              <div className="text-orange-800 font-bold">
                Twitter(X), Instagram, Facebook, TikTok
              </div>
            </div>

            {/* Risk factors */}
            <div className="bg-red-50 rounded-xl p-4 mb-6 border-2 border-red-200">
              <div className="text-sm font-bold text-red-900 mb-3">【検出されたリスク要因】</div>
              <div className="space-y-2">
                {[
                  '過激な発言パターンの検出',
                  '論争的なトピックへの言及',
                  '不適切な表現の使用',
                  '拡散されやすいキーワードの含有'
                ].map((risk, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">⚠️</span>
                    <span className="text-red-800 text-sm font-medium">{risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => router.push('/billing')}
              className="w-full py-5 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xl font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-red-800"
            >
              🔍 詳細レポートを確認
            </button>

            {/* Countdown */}
            <div className="text-center mt-4 text-red-600 text-sm font-mono font-bold">
              自動的に次のページへ移動します... ({countdown}秒)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-xs font-mono">
          Session ID: {sessionId} | FlamePredictor 2026 Pro
        </div>
      </div>
    </div>
  );
}
