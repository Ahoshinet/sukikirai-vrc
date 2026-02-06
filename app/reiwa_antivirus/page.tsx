'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReiwaAntivirus() {
  const router = useRouter();
  const [scanProgress, setScanProgress] = useState(0);
  const [threatsFound] = useState(() => Math.floor(Math.random() * 20) + 15);
  const [infectedFiles] = useState(() => Math.floor(Math.random() * 50) + 30);
  const [countdown, setCountdown] = useState(4);

  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/billing');
    }, 4000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with shield logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-lg mb-6">
            <div className="text-4xl">🛡️</div>
            <div>
              <div className="text-2xl font-black">令和セキュリティ 2026</div>
              <div className="text-sm opacity-90">次世代AIアンチウイルス</div>
            </div>
          </div>
        </div>

        {/* Main scan container */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-2xl border-4 border-green-500 mb-8">
          {/* Scan status */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-green-800">🔍 スキャン実行中</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 font-bold">ACTIVE</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>スキャン進行中...</span>
                <span className="font-mono font-bold">{Math.min(scanProgress, 100)}%</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(scanProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Threats found */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-lg">
              <div className="text-red-600 text-sm font-semibold mb-2">検出された脅威</div>
              <div className="text-5xl font-black text-red-600 mb-2">{threatsFound}</div>
              <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                重大
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500 shadow-lg">
              <div className="text-orange-600 text-sm font-semibold mb-2">感染ファイル</div>
              <div className="text-5xl font-black text-orange-600 mb-2">{infectedFiles}</div>
              <div className="text-xs text-orange-600 font-bold">個のファイル</div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-red-600 shadow-lg">
              <div className="text-red-700 text-sm font-semibold mb-2">危険度レベル</div>
              <div className="text-3xl font-black text-red-700 mb-2">最高</div>
              <div className="text-xs text-red-700 font-bold">即時対応必要</div>
            </div>
          </div>

          {/* Threat list */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200 mb-6">
            <div className="text-lg font-bold text-gray-800 mb-4">【検出された脅威の例】</div>
            <div className="space-y-2">
              {[
                'Trojan.GenericKD.12345678',
                'Backdoor.Reiwa.2026',
                'Ransomware.CryptoLocker.V5',
                'Spyware.DataMiner.Premium'
              ].map((threat, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-red-600">🦠</div>
                  <div className="text-sm font-mono text-red-700 font-semibold">{threat}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="bg-green-100 rounded-xl p-4 mb-6 border-2 border-green-300">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-green-700 font-semibold">スキャンエンジン:</div>
                <div className="text-green-900 font-bold">Reiwa Security AI v12.6</div>
              </div>
              <div>
                <div className="text-green-700 font-semibold">データベース:</div>
                <div className="text-green-900 font-bold">最新版 (2026/02/06)</div>
              </div>
              <div>
                <div className="text-green-700 font-semibold">対応必要:</div>
                <div className="text-red-600 font-bold">即時駆除推奨</div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => router.push('/billing')}
            className="w-full py-5 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            🔍 詳細を確認して駆除する
          </button>

          {/* Countdown */}
          <div className="text-center mt-4 text-green-600 text-sm font-mono">
            自動的に次のページへ移動します... ({countdown}秒)
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs font-mono">
          Session ID: {sessionId} | Secure Connection | 2026 Latest Version
        </div>
      </div>
    </div>
  );
}
