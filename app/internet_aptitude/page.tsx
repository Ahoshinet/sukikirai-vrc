'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InternetAptitude() {
  const router = useRouter();
  const [aptitudeScore] = useState(() => Math.floor(Math.random() * 40) + 30);
  const [countdown, setCountdown] = useState(8);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

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

  const questions = [
    { q: 'あなたのネット利用時間は？', a: '1日5時間以上' },
    { q: 'SNSでの発言頻度は？', a: '1日20回以上' },
    { q: '匿名掲示板の利用は？', a: '頻繁に利用' },
    { q: 'ネット上での議論は？', a: '積極的に参加' },
    { q: 'オンラインゲームは？', a: '毎日プレイ' }
  ];

  const getJudgment = (score: number) => {
    if (score < 40) return 'ネット利用注意';
    if (score < 60) return 'ネット依存傾向あり';
    return 'ネット中毒レベル';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-500 via-cyan-500 to-blue-500 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Header card */}
        <div className="bg-white rounded-t-3xl p-8 border-4 border-teal-600 shadow-2xl">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl">🧠</div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-cyan-600">
                ネット適性診断
              </h1>
              <p className="text-teal-700 font-semibold">
                科学的分析による利用適性判定
              </p>
            </div>
          </div>
        </div>

        {/* Results card */}
        <div className="bg-linear-to-br from-teal-50 to-cyan-50 border-x-4 border-teal-600 p-8">
          {/* Score display */}
          <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg border-4 border-teal-300 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-5xl">🧠</div>
              <div className="text-5xl">📊</div>
            </div>
            <div className="text-2xl font-bold text-teal-700 mb-4">診断結果</div>
            <div className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-cyan-600 mb-4">
              {aptitudeScore}
              <span className="text-4xl">点</span>
            </div>
            <div className="inline-block px-8 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-full text-xl font-black shadow-lg">
              判定: {getJudgment(aptitudeScore)}
            </div>
          </div>

          {/* Questions answered */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border-2 border-teal-300">
            <div className="text-lg font-bold text-teal-800 mb-4">📋 あなたの回答結果</div>
            <div className="space-y-3">
              {questions.map((item, i) => (
                <div key={i} className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500">
                  <div className="text-sm text-teal-700 font-semibold mb-1">{i + 1}. {item.q}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span className="text-teal-900 font-bold">{item.a}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-lg">
              <div className="text-orange-700 text-sm font-semibold mb-2">⚠ リスク評価</div>
              <div className="text-2xl font-black text-orange-600">
                {aptitudeScore < 50 ? '中程度' : '高い'}
              </div>
              <div className="text-xs text-orange-600 font-bold mt-1">要改善</div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-teal-300 shadow-lg">
              <div className="text-teal-700 text-sm font-semibold mb-2">🎯 適性カテゴリー</div>
              <div className="text-lg font-black text-teal-600">ネット中級者レベル</div>
            </div>

            <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow-lg">
              <div className="text-blue-700 text-sm font-semibold mb-2">📱 推奨利用時間</div>
              <div className="text-lg font-black text-blue-600">1日2時間以内</div>
            </div>
          </div>

          {/* Advice section */}
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-yellow-400">
            <div className="text-lg font-bold text-orange-800 mb-3">💡 専門家からのアドバイス</div>
            <ul className="space-y-2">
              {[
                '定期的なデジタルデトックスを推奨',
                'リアルな人間関係の構築が必要',
                '専門カウンセラーへの相談を検討',
                '健全なネット利用習慣の確立が急務'
              ].map((advice, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 font-bold">▸</span>
                  <span className="text-orange-900 font-medium">{advice}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Info panel */}
          <div className="bg-teal-100 rounded-xl p-4 mb-6 border-2 border-teal-400">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-teal-700 font-semibold">診断システム:</div>
                <div className="text-teal-900 font-bold">NetPsycho Analyzer 2026</div>
              </div>
              <div>
                <div className="text-teal-700 font-semibold">分析精度:</div>
                <div className="text-teal-900 font-bold">98.7%</div>
              </div>
              <div>
                <div className="text-teal-700 font-semibold">総受診者数:</div>
                <div className="text-teal-900 font-bold">12,456,789人</div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => router.push('/billing')}
            className="w-full py-5 px-6 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-teal-700"
          >
            🔍 詳細分析レポートを見る
          </button>

          {/* Countdown */}
          <div className="text-center mt-4 text-teal-700 text-sm font-mono font-bold">
            自動的に次のページへ移動します... ({countdown}秒)
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-3xl border-x-4 border-b-4 border-teal-600 p-4 shadow-2xl">
          <div className="text-center text-teal-600/60 text-xs font-mono">
            Session ID: {sessionId} | Secure Connection | 2026 Latest Version
          </div>
        </div>
      </div>
    </div>
  );
}
