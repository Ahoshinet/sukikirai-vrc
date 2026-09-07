"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', 'Noto Sans JP', sans-serif",
          background: "#fff",
          color: "#212529",
        }}
      >
        <main style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 20, margin: "0 0 8px" }}>
            問題が発生しました
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#868e96" }}>
            一時的な不具合の可能性があります。時間をおいて再度お試しください。
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              fontSize: 14,
              borderRadius: 8,
              border: "1px solid #ced4da",
              background: "#f8f9fa",
              cursor: "pointer",
            }}
          >
            再読み込み
          </button>
        </main>
      </body>
    </html>
  );
}
