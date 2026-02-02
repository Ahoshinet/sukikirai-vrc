'use client';

import { useState } from 'react';
import FakeServiceLayout from './FakeServiceLayout';
import styles from './DarkWebLeakCheck.module.css';

export default function DarkWebLeakCheck() {
  const [leakCount] = useState(() => Math.floor(Math.random() * 8) + 3);
  const [randomLeaks] = useState(() => {
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
    return exposedData.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 8) + 3);
  });
  const [leakDate] = useState(() => new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP'));

  return (
    <FakeServiceLayout
      title="🕵️ ダークウェブ情報漏えいチェック"
      subtitle="あなたの個人情報は闇市場で売買されている？【緊急確認】"
    >
      <div style={{ 
        background: '#1a0033', 
        padding: '30px',
        color: '#ff00ff',
        textAlign: 'center',
        border: '4px solid #660066',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(102,0,102,0.1) 10px, rgba(102,0,102,0.1) 20px)',
          pointerEvents: 'none'
        }}></div>
        <div style={{ fontSize: '2.5rem', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
          🌐💀
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
          DARK WEB SCAN
        </div>
        <div style={{ 
          fontSize: '1.2rem', 
          marginTop: '15px',
          background: 'rgba(255,0,0,0.2)',
          padding: '10px',
          borderRadius: '5px',
          position: 'relative',
          zIndex: 1
        }}>
          ⚠ {leakCount}件の情報漏えいを検出
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>🚨 漏えい件数</span>
          <span className={styles.resultValue}>{leakCount}件</span>
          <span className={styles.warningBadge}>危険</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>💰 闇市場取引額（推定）</span>
          <span className={styles.resultValue}>
            ${(leakCount * 150).toLocaleString()}
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>📅 最新漏えい日</span>
          <span className={styles.resultValue} style={{ fontSize: '1.2rem', color: '#ff6600' }}>
            {leakDate}
          </span>
        </div>
      </div>

      <div style={{ 
        background: '#2b0000', 
        padding: '20px', 
        border: '2px solid #ff0000',
        borderRadius: '5px',
        marginTop: '20px',
        color: '#fff'
      }}>
        <div style={{ fontWeight: 'bold', color: '#ff6666', marginBottom: '15px', fontSize: '1.1rem' }}>
          🔓 漏えいした情報の内訳
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          {randomLeaks.map((leak, index) => (
            <div key={index} style={{ 
              background: 'rgba(255,0,0,0.1)', 
              padding: '10px', 
              borderLeft: '4px solid #ff0000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>• {leak}</span>
              <span style={{ 
                background: '#ff0000', 
                color: 'white', 
                padding: '2px 8px', 
                borderRadius: '3px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                漏えい確認
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusLine}>
          <span>スキャン範囲:</span>
          <span>Tor Network / Darknet Markets</span>
        </div>
        <div className={styles.statusLine}>
          <span>データベース:</span>
          <span style={{ color: '#ff0000' }}>15億件の漏えい情報</span>
        </div>
        <div className={styles.statusLine}>
          <span>危険度:</span>
          <span style={{ color: '#ff0000' }}>最高レベル</span>
        </div>
      </div>
    </FakeServiceLayout>
  );
}
