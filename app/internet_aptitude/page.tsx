'use client';

import { useState } from 'react';
import FakeServiceLayout from '../components/shared/FakeServiceLayout';
import styles from './styles.module.css';

export default function InternetAptitude() {
  const [aptitudeScore] = useState(() => Math.floor(Math.random() * 40) + 30);
  const questions = [
    { q: '1. あなたのネット利用時間は？', a: '1日5時間以上' },
    { q: '2. SNSでの発言頻度は？', a: '1日20回以上' },
    { q: '3. 匿名掲示板の利用は？', a: '頻繁に利用' },
    { q: '4. ネット上での議論は？', a: '積極的に参加' },
    { q: '5. オンラインゲームは？', a: '毎日プレイ' }
  ];

  return (
    <FakeServiceLayout
      title="🧠 ネット適性診断"
      subtitle="あなたのインターネット利用適性を心理テストで判定【科学的分析】"
    >
      <div style={{ 
        background: 'linear-gradient(135deg, #4a0080 0%, #8b00ff 100%)', 
        padding: '30px',
        color: 'white',
        textAlign: 'center',
        border: '4px solid #6a0dad',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🧠📊</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          診断結果
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '10px 0' }}>
          {aptitudeScore}点
        </div>
        <div style={{ 
          fontSize: '1.3rem', 
          background: 'rgba(255,0,0,0.4)', 
          padding: '8px', 
          borderRadius: '5px',
          fontWeight: 'bold'
        }}>
          判定: {aptitudeScore < 50 ? 'ネット利用注意' : 'ネット依存傾向あり'}
        </div>
      </div>

      <div style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        border: '2px solid #ccc',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '15px', fontSize: '1.1rem' }}>
          📋 あなたの回答結果
        </div>
        {questions.map((item, index) => (
          <div key={index} style={{ 
            background: 'white', 
            padding: '12px', 
            marginBottom: '8px',
            borderLeft: '4px solid #6a0dad',
            borderRadius: '3px'
          }}>
            <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
              {item.q}
            </div>
            <div style={{ color: '#666', paddingLeft: '10px' }}>
              ✓ {item.a}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentSection}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>⚠ リスク評価</span>
          <span className={styles.resultValue} style={{ color: '#ff6600' }}>
            {aptitudeScore < 50 ? '中程度' : '高い'}
          </span>
          <span className={styles.warningBadge}>要改善</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>🎯 適性カテゴリー</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
            {aptitudeScore < 40 ? 'ネット初心者レベル' : aptitudeScore < 60 ? 'ネット中級者レベル' : 'ネット依存レベル'}
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>📱 推奨利用時間</span>
          <span className={styles.resultValue} style={{ fontSize: '1.2rem', color: '#0066cc' }}>
            1日2時間以内
          </span>
        </div>
      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        border: '2px solid #ffa500',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <div style={{ fontWeight: 'bold', color: '#856404', marginBottom: '10px' }}>
          💡 専門家からのアドバイス
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
          <li>定期的なデジタルデトックスを推奨</li>
          <li>リアルな人間関係の構築が必要</li>
          <li>専門カウンセラーへの相談を検討</li>
          <li>健全なネット利用習慣の確立が急務</li>
        </ul>
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusLine}>
          <span>診断システム:</span>
          <span>NetPsycho Analyzer 2026</span>
        </div>
        <div className={styles.statusLine}>
          <span>分析精度:</span>
          <span>98.7%</span>
        </div>
        <div className={styles.statusLine}>
          <span>総受診者数:</span>
          <span>12,456,789人</span>
        </div>
      </div>
    </FakeServiceLayout>
  );
}
