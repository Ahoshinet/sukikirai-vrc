'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://google.com';
    }, 3000);

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
