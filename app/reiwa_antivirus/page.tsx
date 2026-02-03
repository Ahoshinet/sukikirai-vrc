'use client';

import { useState, useEffect } from 'react';
import FakeServiceLayout from '../components/shared/FakeServiceLayout';
import styles from './styles.module.css';

export default function ReiwaAntivirus() {
  const [scanProgress, setScanProgress] = useState(0);
  const [threatsFound] = useState(() => Math.floor(Math.random() * 20) + 15);
  const [infectedFiles] = useState(() => Math.floor(Math.random() * 50) + 30);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 10, 100));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <FakeServiceLayout
      title="🛡️ 令和最新版・超高性能アンチウイルス診断"
      subtitle="2026年最新AI搭載！次世代セキュリティスキャン【話題沸騰中】"
    >
      <div style={{ 
        background: '#000', 
        padding: '20px', 
        border: '3px solid #ff0000',
        marginBottom: '20px'
      }}>
        <div style={{ 
          color: '#ff0000', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          ⚠ 緊急スキャン実行中 ⚠
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ 
              width: `${scanProgress}%`,
              animation: 'none'
            }}
          ></div>
        </div>
        <div style={{ 
          color: '#0f0', 
          textAlign: 'center', 
          marginTop: '10px',
          fontFamily: 'monospace' 
        }}>
          スキャン進行中: {scanProgress}%
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>🦠 検出された脅威</span>
          <span className={styles.resultValue}>{threatsFound}件</span>
          <span className={styles.warningBadge}>重大</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>🚨 危険度レベル</span>
          <span className={styles.resultValue}>最高</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>💾 感染ファイル数</span>
          <span className={styles.resultValue}>{infectedFiles}個</span>
        </div>
      </div>

      <div style={{ 
        background: '#ffe4e4', 
        padding: '15px', 
        border: '2px solid #ff0000',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <div style={{ fontWeight: 'bold', color: '#cc0000', marginBottom: '10px' }}>
          【検出された脅威の例】
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
          <li>Trojan.GenericKD.12345678</li>
          <li>Backdoor.Reiwa.2026</li>
          <li>Ransomware.CryptoLocker.V5</li>
          <li>Spyware.DataMiner.Premium</li>
        </ul>
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusLine}>
          <span>スキャンエンジン:</span>
          <span>Reiwa Security AI v12.6 (2026)</span>
        </div>
        <div className={styles.statusLine}>
          <span>データベース:</span>
          <span style={{ color: '#ff0000' }}>最新版 (更新: 2026/02/02)</span>
        </div>
        <div className={styles.statusLine}>
          <span>対応必要:</span>
          <span style={{ color: '#ff0000' }}>即時駆除推奨</span>
        </div>
      </div>
    </FakeServiceLayout>
  );
}
