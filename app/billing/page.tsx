'use client';

import { useEffect, useState } from 'react';
import styles from './billing.module.css';

// Type definition for Battery API
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export default function BillingDemo() {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showModal, setShowModal] = useState(false);
  const [ipAddress, setIpAddress] = useState('Loading...');
  const [deviceInfo, setDeviceInfo] = useState('Scanning...');
  const [messages, setMessages] = useState<{ sender: 'agent' | 'user', text: string }[]>([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<string>('Checking...');
  const [transactionId, setTransactionId] = useState('GENERATING...');

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeouts: NodeJS.Timeout[] = [];

    // Fake fetching IP/Device info for realism
    timeouts.push(setTimeout(() => {
      // Generate a more realistic-looking public IP
      const randomIp = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      setIpAddress(randomIp);

      const userAgent = window.navigator.userAgent;
      let os = "Unknown OS";
      if (userAgent.indexOf("Win") !== -1) os = "Windows NT 10.0; Win64; x64";
      if (userAgent.indexOf("Mac") !== -1) os = "Macintosh; Intel Mac OS X 10_15_7";
      if (userAgent.indexOf("Linux") !== -1) os = "Linux x86_64";
      if (userAgent.indexOf("Android") !== -1) os = "Android 10; Mobile";
      if (userAgent.indexOf("iPhone") !== -1) os = "iPhone; CPU iPhone OS 14_0 like Mac OS X";

      setDeviceInfo(os);
      setTransactionId(Math.random().toString(36).substring(7).toUpperCase());

      // Trigger modal "alert"
      setShowModal(true);

      // Start fake chat sequence
      timeouts.push(setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', text: 'サポートセンター担当佐藤が入室しました。' }]);
      }, 3000));
      timeouts.push(setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', text: '現在、お客様の未払い状況を確認しております。画面を閉じずにそのままお待ちください。' }]);
      }, 6000));
      timeouts.push(setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'agent', text: '【警告】位置情報の特定が完了しました。法的措置の手続きを開始します。' }]);
      }, 15000));
    }, 1500));

    // Try to get battery info if available (Chrome/Edge/Android)
    let batteryLevelHandler: ((this: BatteryManager, ev: Event) => void) | null = null;
    const navWithBattery = navigator as NavigatorWithBattery;
    
    if (navWithBattery.getBattery) {
      navWithBattery.getBattery().then((battery: BatteryManager) => {
        const updateBattery = () => {
          setBatteryLevel(`${Math.floor(battery.level * 100)}%${battery.charging ? ' (Charging)' : ''}`);
        };
        
        updateBattery();
        batteryLevelHandler = updateBattery;
        battery.addEventListener('levelchange', batteryLevelHandler);
        battery.addEventListener('chargingchange', batteryLevelHandler);
      }).catch(() => {
        // Battery API not available or permission denied
        setBatteryLevel('N/A');
      });
    }

    return () => {
      clearInterval(timer);
      timeouts.forEach(timeout => clearTimeout(timeout));
      
      // Clean up battery event listeners
      const navWithBattery = navigator as NavigatorWithBattery;
      if (batteryLevelHandler && navWithBattery.getBattery) {
        navWithBattery.getBattery().then((battery: BatteryManager) => {
          battery.removeEventListener('levelchange', batteryLevelHandler);
          battery.removeEventListener('chargingchange', batteryLevelHandler);
        }).catch(() => {
          // Ignore cleanup errors
        });
      }
    };
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

      <div className={styles.cameraContainer}>
        <div className={styles.cameraBox}>
          <div className={styles.recIndicator}>
            <div className={styles.recDot}></div> REC
          </div>
          <div className={styles.faceFrame}></div>
          <div className={styles.cameraText}>UPLOADING FACE DATA... 82%</div>
        </div>
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
          <p className={styles.paymentWarning}>※お支払いは即時確定しております</p>
        </div>

        <div className={styles.timerSection}>
          <div className={styles.timerLabel}>お支払い期限までの残り時間</div>
          <div className={styles.timerValue}>{formatTime(timeLeft)}</div>
          <p className={styles.timerNote}>期限を過ぎますと、法的措置および延滞金が発生します。</p>
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
            <span>Battery:</span>
            <span>{batteryLevel}</span>
          </div>
          <div className={styles.infoLine}>
            <span>Location:</span>
            <span>Japan, Tokyo (Estimated)</span>
          </div>
          <div className={styles.infoLine}>
            <span>Status:</span>
            <span className={`${styles.statusLocked} ${styles.blinkingBg}`}>LOCKED / RECORDED</span>
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
          ID: {transactionId} | Transaction: PENDING | Secure Connection
        </div>
      </div>

      {/* Chat Widget */}
      {chatOpen && (
        <div className={styles.chatWidget}>
          <div className={styles.chatHeader} onClick={() => setChatOpen(!chatOpen)}>
            <div className={styles.onlineDot}></div>
            Customer Support (Online)
          </div>
          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`${styles.messageRow} ${msg.sender === 'agent' ? styles.agent : styles.user}`}>
                <div className={styles.messageBubble}>
                  {msg.text}
                </div>
              </div>
            ))}
            {messages.length === 0 && <div className={styles.typingIndicator}>Connecting to agent...</div>}
          </div>
          <div className={styles.chatInputArea}>
            <input type="text" className={styles.chatInput} placeholder="Type a message..." disabled />
            <button className={styles.sendButton} disabled>Send</button>
          </div>
        </div>
      )}

      {showModal && (
        <>
          <div className={styles.modalOverlay} onClick={handleCloseModal}></div>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>⚠ 警告</h2>
            <p className={styles.modalText}>
              あなたの端末情報が登録されました。<br />
              このページを閉じても請求はキャンセルされません。
            </p>
            <p>
              誤って登録された場合は、直ちにサポートセンターへご連絡ください。
            </p>
            <button onClick={handleCloseModal} className={styles.modalButton}>
              確認
            </button>
          </div>
        </>
      )}
    </div>
  );
}
