'use client';

import { useState } from 'react';
import FakeServiceLayout from './FakeServiceLayout';
import styles from './FakeService.module.css';

export default function SuperAIBalance() {
  const [balance] = useState(() => Math.floor(Math.random() * 1000) - 500);
  const [aiScore] = useState(() => Math.floor(Math.random() * 100));

  return (
    <FakeServiceLayout
      title="🤖 スーパーAI残高判定"
      subtitle="最新AIテクノロジーによる精密な残高分析システム"
    >
      <div className={styles.scanningIndicator}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          💳 あなたの銀行口座をスキャン中...
        </div>
        <div style={{ marginTop: '10px', color: '#666' }}>
          AI解析進行率: 94%
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>🧠 AI判定スコア</span>
          <span className={styles.resultValue}>{aiScore}/100</span>
          <span className={styles.warningBadge}>要注意</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>💰 推定残高</span>
          <span className={styles.resultValue}>
            ¥{balance.toLocaleString()}
            {balance < 0 && <span style={{ fontSize: '1rem', marginLeft: '10px' }}>（赤字！）</span>}
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>⚡ リスクレベル</span>
          <span className={styles.resultValue} style={{ color: balance < 0 ? '#ff0000' : '#ffaa00' }}>
            {balance < 0 ? '危険' : '警告'}
          </span>
        </div>
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusLine}>
          <span>分析ステータス:</span>
          <span style={{ color: '#ff0000' }}>緊急対応必要</span>
        </div>
        <div className={styles.statusLine}>
          <span>データソース:</span>
          <span>全国銀行協会 / 信用情報機関</span>
        </div>
        <div className={styles.statusLine}>
          <span>最終更新:</span>
          <span>{new Date().toLocaleString('ja-JP')}</span>
        </div>
      </div>
    </FakeServiceLayout>
  );
}
