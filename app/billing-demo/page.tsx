'use client';

import { useEffect, useState } from 'react';
import styles from './billing.module.css';

export default function BillingDemo() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showModal, setShowModal] = useState(false);
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [deviceInfo, setDeviceInfo] = useState('Scanning...');

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Fake fetching IP/Device info for realism
    setTimeout(() => {
      // Generate a random-looking IP
      const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      setIpAddress(randomIp);
      
      const userAgent = window.navigator.userAgent;
      let os = "Unknown OS";
      if (userAgent.indexOf("Win") !== -1) os = "Windows NT 10.0; Win64; x64";
      if (userAgent.indexOf("Mac") !== -1) os = "Macintosh; Intel Mac OS X 10_15_7";
      if (userAgent.indexOf("Linux") !== -1) os = "Linux x86_64";
      if (userAgent.indexOf("Android") !== -1) os = "Android 10; Mobile";
      if (userAgent.indexOf("iPhone") !== -1) os = "iPhone; CPU iPhone OS 14_0 like Mac OS X";
      
      setDeviceInfo(os);
      
      // Trigger modal "alert"
      setShowModal(true);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.overlay}></div>

      <div className={styles.alertBox}>
        ⚠ SECURITY ALERT: UNUSUAL ACTIVITY DETECTED ⚠
      </div>

      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>ご登録完了のお知らせ</h1>
          <p className={styles.cardSubtitle}>
            会員登録ありがとうございます。以下のご請求をご確認ください。
          </p>
        </div>

        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>ご請求金額 (年間プラン)</span>
          <span className={styles.priceValue}>¥450,000</span>
          <p style={{color: 'red', fontWeight: 'bold'}}>※お支払いは即時確定しております</p>
        </div>

        <div className={styles.timerSection}>
          <div className={styles.timerLabel}>お支払い期限までの残り時間</div>
          <div className={styles.timerValue}>{formatTime(timeLeft)}</div>
          <p style={{fontSize: '0.9rem', color: '#555'}}>期限を過ぎますと、法的措置および延滞金が発生します。</p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoLine}>
            <span>IP Address:</span>
            <span>{ipAddress}</span>
          </div>
          <div className={styles.infoLine}>
            <span>Remote Port:</span>
            <span>44382</span>
          </div>
          <div className={styles.infoLine}>
            <span>OS Info:</span>
            <span>{deviceInfo}</span>
          </div>
          <div className={styles.infoLine}>
            <span>Location:</span>
            <span>Japan, Tokyo (Estimated)</span>
          </div>
          <div className={styles.infoLine}>
            <span>Status:</span>
            <span style={{color: 'red', fontWeight: 'bold'}}>LOCKED / RECORDED</span>
          </div>
        </div>

        <div className={styles.actions}>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("これはデモです。\n実際にはサポートセンターには繋がりません。"); }} className={styles.buttonPrimary}>
            📞 お客様サポートセンターへ電話
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("キャンセルに失敗しました。\nエラーコード: 0x8801\n\n(これはデモです)"); }} className={styles.buttonSecondary}>
             登録キャンセル申請
          </a>
        </div>

        <div className={styles.footer}>
          ID: {Math.random().toString(36).substring(7).toUpperCase()} | Transaction: PENDING | Secure Connection
        </div>
      </div>

      {showModal && (
        <>
          <div className={styles.modalOverlay} onClick={handleCloseModal}></div>
          <div className={styles.modal}>
            <h2 style={{color: 'red', margin: '0 0 15px 0'}}>⚠ 警告</h2>
            <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
              あなたの端末情報が登録されました。<br/>
              このページを閉じても請求はキャンセルされません。
            </p>
            <p>
              誤って登録された場合は、直ちにサポートセンターへご連絡ください。
            </p>
            <button 
              onClick={handleCloseModal}
              style={{
                marginTop: '15px', 
                padding: '10px 20px', 
                background: 'red', 
                color: 'white', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer'
              }}
            >
              確認
            </button>
          </div>
        </>
      )}
    </div>
  );
}
