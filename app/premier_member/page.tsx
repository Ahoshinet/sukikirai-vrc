'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PremierMember() {
  const router = useRouter();
  const [memberScore] = useState(() => Math.floor(Math.random() * 30) + 70);
  const [countdown, setCountdown] = useState(4);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-8 flex items-center justify-center relative overflow-hidden">
      {/* Luxury pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #d97706 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Crown header */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4 animate-bounce">👑</div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 mb-4">
            プレミア厳選会員
          </h1>
          <p className="text-amber-800 text-lg font-medium">
            選ばれし者のための特別プログラム
          </p>
        </div>

        {/* Main membership card */}
        <div className="bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-900 rounded-3xl p-1 shadow-2xl mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl p-8">
            {/* Membership badge */}
            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl p-6 mb-8 text-center shadow-xl">
              <div className="text-6xl mb-3">👑</div>
              <div className="text-3xl font-black text-white mb-2 tracking-wider">
                PREMIER ELITE
              </div>
              <div className="text-yellow-200 text-xl font-bold">
                MEMBERSHIP
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 border-2 border-amber-300 shadow-lg">
                <div className="text-amber-700 text-sm font-semibold mb-2">会員適合度</div>
                <div className="text-4xl font-black text-amber-600">{memberScore}%</div>
                <div className="text-xs text-amber-600 mt-2 font-bold">✓ 資格あり</div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-6 border-2 border-amber-300 shadow-lg">
                <div className="text-amber-700 text-sm font-semibold mb-2">ステータス</div>
                <div className="text-2xl font-black text-amber-600">審査中</div>
                <div className="text-xs text-amber-600 mt-2">処理進行中</div>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-6 border-2 border-amber-300 shadow-lg">
                <div className="text-amber-700 text-sm font-semibold mb-2">特典レベル</div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  💎 Diamond
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="bg-amber-100/50 rounded-xl p-6 mb-6 border border-amber-300">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-amber-800 font-semibold">認証システム:</span>
                  <span className="text-amber-900 font-bold">プレミア会員管理センター</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-800 font-semibold">登録状況:</span>
                  <span className="text-green-600 font-bold">✓ 自動登録完了</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-800 font-semibold">年会費:</span>
                  <span className="text-red-600 font-bold text-xl">¥480,000</span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-4 mb-6 border-2 border-yellow-600 shadow-lg">
              <div className="text-center text-amber-900 font-bold">
                ⚠️ あなたは既に会員登録されています
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={() => router.push('/billing')}
              className="w-full py-5 px-8 bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 hover:from-yellow-500 hover:via-amber-400 hover:to-yellow-500 text-white text-xl font-black rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-amber-700"
            >
              🔍 詳細を確認する
            </button>

            {/* Countdown */}
            <div className="text-center mt-6 text-amber-700 text-sm font-mono">
              自動的に次のページへ移動します... ({countdown}秒)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-amber-700/60 text-xs font-mono">
          Session ID: {sessionId} | Secure Connection | 2026 Latest Version
        </div>
      </div>
    </div>
  );
}
