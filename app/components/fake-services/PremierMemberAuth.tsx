'use client';

import { useState } from 'react';
import FakeServiceLayout from './FakeServiceLayout';
import styles from './PremierMemberAuth.module.css';

export default function PremierMemberAuth() {
  const [memberScore] = useState(() => Math.floor(Math.random() * 30) + 70);
  const approvalStatus = memberScore > 85 ? '承認済み' : '審査中';

  return (
    <FakeServiceLayout
      title="👑 プレミア厳選会員認証"
      subtitle="選ばれし者のための特別会員資格審査システム"
    >
      <div style={{ 
        textAlign: 'center', 
        padding: '30px', 
        background: 'linear-gradient(135deg, #000 0%, #330000 100%)',
        color: '#ffd700',
        margin: '20px 0',
        border: '3px solid #ffd700'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👑</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          PREMIER ELITE MEMBERSHIP
        </div>
        <div style={{ fontSize: '1.2rem' }}>
          年会費: ¥480,000
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>🎯 会員適合度</span>
          <span className={styles.resultValue}>{memberScore}%</span>
          <span className={styles.warningBadge}>プレミア資格あり</span>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${memberScore}%` }}></div>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>📋 ステータス</span>
          <span className={styles.resultValue} style={{ color: '#ffa500' }}>{approvalStatus}</span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>✨ 特典レベル</span>
          <span className={styles.resultValue}>ダイヤモンド</span>
        </div>
      </div>

      <div className={styles.statusBox}>
        <div className={styles.statusLine}>
          <span>認証システム:</span>
          <span>プレミア会員管理センター</span>
        </div>
        <div className={styles.statusLine}>
          <span>登録状況:</span>
          <span style={{ color: '#ff0000' }}>自動登録完了</span>
        </div>
        <div className={styles.statusLine}>
          <span>有効期限:</span>
          <span>2027年12月31日まで</span>
        </div>
      </div>

      <div style={{ 
        background: '#fffacd', 
        padding: '15px', 
        border: '2px solid #ffa500',
        marginTop: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        ⚠ あなたは既に会員登録されています
      </div>
    </FakeServiceLayout>
  );
}
