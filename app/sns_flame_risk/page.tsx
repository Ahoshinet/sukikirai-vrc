'use client';

import { useState } from 'react';
import FakeServiceLayout from '../components/shared/FakeServiceLayout';
import styles from './styles.module.css';

export default function SNSFlameRisk() {
  const [riskScore] = useState(() => Math.floor(Math.random() * 40) + 60);
  const [flameCount] = useState(() => Math.floor(Math.random() * 15) + 5);
  const riskLevel = riskScore > 80 ? '極めて高い' : riskScore > 60 ? '高い' : '中程度';

  return (
    <FakeServiceLayout
      title="🔥 SNS炎上リスクスコア診断"
      subtitle="AI分析による炎上予測システム【2026年版・精度99.8%】"
    >
      <div style={{ 
        background: 'linear-gradient(135deg, #ff0000 0%, #ff6600 100%)', 
        padding: '30px',
        color: 'white',
        textAlign: 'center',
        border: '4px solid #cc0000',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔥</div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          炎上リスク度
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', margin: '10px 0' }}>
          {riskScore}%
        </div>
        <div style={{ fontSize: '1.2rem', background: 'rgba(0,0,0,0.3)', padding: '5px', borderRadius: '5px' }}>
          判定: {riskLevel}
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>📱 分析対象SNS</span>
          <span style={{ fontSize: '1.1rem' }}>
            Twitter(X), Instagram, Facebook, TikTok
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>⚠ 危険な投稿数</span>
          <span className={styles.resultValue}>{flameCount}件</span>
          <span className={styles.warningBadge}>要注意</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>👥 拡散予測人数</span>
          <span className={styles.resultValue}>
            {(flameCount * 1234).toLocaleString()}人
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>📈 バズり危険度</span>
          <span className={styles.resultValue} style={{ color: riskScore > 80 ? '#ff0000' : '#ff6600' }}>
            レベル {Math.ceil(riskScore / 20)}
          </span>
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
          【検出されたリスク要因】
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
          <li>過激な発言パターンの検出</li>
          <li>論争的なトピックへの言及</li>
          <li>不適切な表現の使用</li>
          <li>拡散されやすいキーワードの含有</li>
        </ul>
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusLine}>
          <span>分析AI:</span>
          <span>FlamePredictor 2026 Pro</span>
        </div>
        <div className={styles.statusLine}>
          <span>分析日時:</span>
          <span>{new Date().toLocaleString('ja-JP')}</span>
        </div>
        <div className={styles.statusLine}>
          <span>対策推奨:</span>
          <span style={{ color: '#ff0000' }}>緊急対応必要</span>
        </div>
      </div>
    </FakeServiceLayout>
  );
}
