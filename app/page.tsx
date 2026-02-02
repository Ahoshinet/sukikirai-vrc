"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  const bouncingText = "VRChatは最高！".split("");
  const features = [
    "🌍 無限のワールドを探検",
    "👥 世界中の人と友達に",
    "🎭 好きなアバターになれる",
    "🎉 毎日イベント開催中",
    "🎨 自分で創作もできる",
    "💃 一緒に踊ろう！",
  ];

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>

      {/* パーティクル */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            ...styles.particle,
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {["✨", "⭐", "💫", "🌟", "💖", "🎮"][p.id % 6]}
        </div>
      ))}

      {/* メインタイトル */}
      <h1 style={styles.mainTitle}>
        {bouncingText.map((char, i) => (
          <span
            key={i}
            style={{
              ...styles.bouncingChar,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      {/* サブタイトル */}
      <div style={styles.subtitle}>
        🎮 バーチャルの世界で、本当の自分になろう 🎮
      </div>

      {/* 回転するVRChatロゴ風 */}
      <div style={styles.logoContainer}>
        <div style={styles.spinningLogo}>VR</div>
        <div style={styles.pulsingLogo}>Chat</div>
      </div>

      {/* 特徴カード */}
      <div style={styles.featuresGrid}>
        {features.map((feature, i) => (
          <div
            key={i}
            style={{
              ...styles.featureCard,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {feature}
          </div>
        ))}
      </div>

      {/* 揺れるCTAボタン */}
      <a
        href="https://hello.vrchat.com/"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.ctaButton}
      >
        🚀 今すぐ始める 🚀
      </a>

      {/* 踊る絵文字たち */}
      <div style={styles.dancingEmojis}>
        {["🕺", "💃", "🎉", "🎊", "🥳", "🤖", "👾", "🎭"].map((emoji, i) => (
          <span
            key={i}
            style={{
              ...styles.dancingEmoji,
              animationDelay: `${i * 0.15}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* 流れるテキスト */}
      <div style={styles.marqueeContainer}>
        <div style={styles.marquee}>
          {"★ VRChatで会おう ★ 無料でプレイ可能 ★ PC・VR対応 ★ 友達と冒険 ★ アバター無限大 ★ "
            .repeat(5)}
        </div>
      </div>

      {/* 波打つ背景 */}
      <div style={styles.wave1}></div>
      <div style={styles.wave2}></div>

      {/* フッター */}
      <div style={styles.footer}>
        <span style={styles.glitchText}>JOIN THE METAVERSE</span>
      </div>
    </div>
  );
}

const keyframes = `
  @keyframes rainbow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-30px) rotate(-10deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-15px) rotate(10deg); }
  }

  @keyframes spin3d {
    0% { transform: rotateY(0deg) rotateX(0deg); }
    100% { transform: rotateY(360deg) rotateX(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.8; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-10px) rotate(-5deg); }
    75% { transform: translateX(10px) rotate(5deg); }
  }

  @keyframes slideIn {
    0% { transform: translateX(-100%) rotate(-180deg); opacity: 0; }
    100% { transform: translateX(0) rotate(0deg); opacity: 1; }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px #ff0080, 0 0 40px #ff0080, 0 0 60px #ff0080; }
    50% { box-shadow: 0 0 40px #00ff80, 0 0 80px #00ff80, 0 0 120px #00ff80; }
  }

  @keyframes particleFloat {
    0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
  }

  @keyframes wave {
    0% { transform: translateX(0) translateZ(0) scaleY(1); }
    50% { transform: translateX(-25%) translateZ(0) scaleY(0.5); }
    100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  @keyframes glitch {
    0%, 100% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
    25% { text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
    50% { text-shadow: 2px 2px #ff0000, -2px -2px #00ffff; }
    75% { text-shadow: -2px 2px #ff0000, 2px -2px #00ffff; }
  }

  @keyframes disco {
    0% { background-color: #ff0000; }
    16% { background-color: #ff8800; }
    33% { background-color: #ffff00; }
    50% { background-color: #00ff00; }
    66% { background-color: #0088ff; }
    83% { background-color: #8800ff; }
    100% { background-color: #ff0000; }
  }

  @keyframes dance {
    0%, 100% { transform: translateY(0) scaleX(1); }
    25% { transform: translateY(-20px) scaleX(1.2); }
    50% { transform: translateY(0) scaleX(0.8); }
    75% { transform: translateY(-10px) scaleX(1.1); }
  }

  @keyframes crazy {
    0% { transform: rotate(0deg) scale(1); filter: hue-rotate(0deg); }
    25% { transform: rotate(90deg) scale(1.5); filter: hue-rotate(90deg); }
    50% { transform: rotate(180deg) scale(0.5); filter: hue-rotate(180deg); }
    75% { transform: rotate(270deg) scale(1.2); filter: hue-rotate(270deg); }
    100% { transform: rotate(360deg) scale(1); filter: hue-rotate(360deg); }
  }
`;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(-45deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff, #ff0088)",
    backgroundSize: "400% 400%",
    animation: "rainbow 3s ease infinite",
    overflow: "hidden",
    position: "relative",
    padding: "20px",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    textAlign: "center",
  },
  mainTitle: {
    fontSize: "clamp(2rem, 8vw, 5rem)",
    marginTop: "50px",
    textShadow: "4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  bouncingChar: {
    display: "inline-block",
    animation: "bounce 0.6s ease infinite, disco 2s linear infinite",
    color: "white",
    padding: "0 2px",
  },
  subtitle: {
    fontSize: "clamp(1rem, 4vw, 2rem)",
    color: "white",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    animation: "shake 0.5s ease infinite",
    margin: "20px 0",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    margin: "40px 0",
  },
  spinningLogo: {
    fontSize: "clamp(3rem, 10vw, 8rem)",
    fontWeight: "bold",
    color: "white",
    textShadow: "0 0 20px #fff",
    animation: "spin3d 2s linear infinite",
    display: "inline-block",
  },
  pulsingLogo: {
    fontSize: "clamp(3rem, 10vw, 8rem)",
    fontWeight: "bold",
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96e6a1)",
    backgroundSize: "300% 300%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "rainbow 2s ease infinite, pulse 1s ease infinite",
    display: "inline-block",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  featureCard: {
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    fontSize: "clamp(1rem, 3vw, 1.5rem)",
    color: "white",
    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
    animation: "slideIn 1s ease forwards, float 3s ease infinite",
    opacity: 0,
    border: "3px solid rgba(255,255,255,0.5)",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  ctaButton: {
    display: "inline-block",
    padding: "20px 60px",
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: "bold",
    color: "white",
    background: "linear-gradient(45deg, #ff0080, #8000ff)",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    textDecoration: "none",
    margin: "40px 0",
    animation: "shake 0.3s ease infinite, glow 1s ease infinite",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  dancingEmojis: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "20px",
    margin: "30px 0",
  },
  dancingEmoji: {
    fontSize: "clamp(2rem, 6vw, 4rem)",
    display: "inline-block",
    animation: "dance 0.5s ease infinite",
  },
  particle: {
    position: "fixed",
    fontSize: "2rem",
    animation: "particleFloat 5s linear infinite",
    pointerEvents: "none",
    zIndex: 1000,
  },
  marqueeContainer: {
    overflow: "hidden",
    background: "rgba(0,0,0,0.3)",
    padding: "15px 0",
    margin: "30px 0",
  },
  marquee: {
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "marquee 15s linear infinite",
    fontSize: "clamp(1rem, 3vw, 1.5rem)",
    color: "white",
    fontWeight: "bold",
  },
  wave1: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "200%",
    height: "100px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "1000% 1000% 0 0",
    animation: "wave 10s linear infinite",
    pointerEvents: "none",
  },
  wave2: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "200%",
    height: "80px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "1000% 1000% 0 0",
    animation: "wave 7s linear infinite reverse",
    pointerEvents: "none",
  },
  footer: {
    marginTop: "50px",
    paddingBottom: "150px",
  },
  glitchText: {
    fontSize: "clamp(1.5rem, 5vw, 3rem)",
    fontWeight: "bold",
    color: "white",
    animation: "glitch 0.3s ease infinite, crazy 5s ease infinite",
    display: "inline-block",
  },
};

export default Home;
