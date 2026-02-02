'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import styles from './FakeService.module.css';

interface FakeServiceLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  autoRedirectDelay?: number;
}

export default function FakeServiceLayout({ 
  title, 
  subtitle, 
  children, 
  autoRedirectDelay = 4000 
}: FakeServiceLayoutProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(Math.floor(autoRedirectDelay / 1000));
  const [sessionId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/billing');
    }, autoRedirectDelay);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router, autoRedirectDelay]);

  const handleClick = () => {
    router.push('/billing');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.overlay}></div>
      
      <div className={styles.alertBox}>
        ⚠ SYSTEM NOTIFICATION: ACTION REQUIRED ⚠
      </div>

      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>{title}</h1>
          <p className={styles.cardSubtitle}>{subtitle}</p>
        </div>

        {children}

        <div className={styles.actions}>
          <button onClick={handleClick} className={styles.buttonPrimary}>
            🔍 詳細を確認する
          </button>
        </div>

        <div className={styles.autoRedirectNotice}>
          自動的に次のページへ移動します... ({countdown}秒)
        </div>

        <div className={styles.footer}>
          Session ID: {sessionId} | Secure Connection | 2026 Latest Version
        </div>
      </div>
    </div>
  );
}
