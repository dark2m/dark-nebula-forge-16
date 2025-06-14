import React, { useState, useEffect } from 'react';

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('نسخ');

  // Initialize starry background
  useEffect(() => {
    initStarryBackground();
  }, []);

  const initStarryBackground = () => {
    const existingBg = document.querySelector('.starry-background');
    if (existingBg) return;

    const starryBg = document.createElement('div');
    starryBg.className = 'starry-background';
    
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    starsContainer.id = 'stars-container';
    
    starryBg.appendChild(starsContainer);
    document.body.appendChild(starryBg);

    const starCount = 100;
    const meteorCount = 8;
    const meteorColors = ['#4ecdc4', '#45b7d1', '#ffeaa7', '#fd79a8', '#a8e6cf', '#81ecec'];

    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${(Math.random() * 2 + 0.5)}px`;
      star.style.height = star.style.width;
      starsContainer.appendChild(star);
    }

    // Create meteors
    for (let i = 0; i < meteorCount; i++) {
      const meteor = document.createElement('div');
      const color = meteorColors[i % meteorColors.length];
      const direction = i % 2 === 0 ? 'down' : 'up';
      
      meteor.className = `meteor-colored meteor-fall-${direction}`;
      meteor.style.left = `${Math.random() * 100}%`;
      meteor.style.top = direction === 'up' ? `${90 + Math.random() * 10}%` : `-${Math.random() * 10}%`;
      meteor.style.width = '2px';
      meteor.style.height = '12px';
      meteor.style.animationDelay = `${Math.random() * 8}s`;
      meteor.style.animationDuration = `${4 + Math.random() * 3}s`;
      meteor.style.background = `linear-gradient(180deg, transparent 0%, ${color} 50%, ${color}dd 100%)`;
      meteor.style.boxShadow = `0 0 8px ${color}80`;
      
      starsContainer.appendChild(meteor);
    }
  };

  const showToast = (message: string) => {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  };

  const generatePassword = () => {
    if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
      showToast('يجب تحديد نوع واحد على الأقل من الأحرف');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let charset = '';
        
        if (includeLowercase) charset += lowercase;
        if (includeUppercase) charset += uppercase;
        if (includeNumbers) charset += numbers;
        if (includeSymbols) charset += symbols;

        if (excludeSimilar) {
          charset = charset.replace(/[il1Lo0O]/g, '');
        }

        let newPassword = '';
        for (let i = 0; i < length; i++) {
          newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        setPassword(newPassword);
        showToast('تم توليد كلمة مرور جديدة');
      } catch (error) {
        showToast('حدث خطأ أثناء توليد كلمة المرور');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const copyPassword = () => {
    if (!password) {
      showToast('لا توجد كلمة مرور للنسخ');
      return;
    }

    navigator.clipboard.writeText(password).then(() => {
      setCopyButtonText('تم النسخ!');
      showToast('تم نسخ كلمة المرور للحافظة');
      
      setTimeout(() => {
        setCopyButtonText('نسخ');
      }, 2000);
    }).catch(() => {
      showToast('فشل في النسخ');
    });
  };

  const handleBackToTools = () => {
    window.history.back();
  };

  return (
    <div>
      <style>{`
        :root {
          --main-color: #48ff00;
          --transition: 0.3s;
          --bg-color: transparent;
          --glass-color: rgba(0, 0, 0, 0.5);
          --text-color: #ffffff;
          --muted-color: rgba(255, 255, 255, 0.7);
          --input-bg: rgba(0, 0, 0, 0.3);
          --input-border: rgba(255, 255, 255, 0.2);
          --shadow: rgba(0, 0, 0, 0.1);
        }

        .starry-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        }

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite;
        }

        .star:nth-child(odd) {
          animation-delay: 1s;
        }

        .star:nth-child(3n) {
          animation-delay: 2s;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .meteor-colored {
          position: absolute;
          border-radius: 50px;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .meteor-fall-down {
          animation-name: meteor-down;
        }

        .meteor-fall-up {
          animation-name: meteor-up;
        }

        @keyframes meteor-down {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 20px)) rotate(0deg);
            opacity: 0;
          }
        }

        @keyframes meteor-up {
          0% {
            transform: translateY(20px) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(-100vh - 20px)) rotate(180deg);
            opacity: 0;
          }
        }

        .password-generator-container {
          display: flex;
          min-height: 100vh;
          color: var(--text-color);
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          direction: rtl;
        }

        .sidebar {
          width: 260px;
          background: var(--glass-color);
          backdrop-filter: blur(20px);
          border-left: 1px solid var(--input-border);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          z-index: 1;
          order: 2;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .logo img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
        }

        .logo span {
          font-size: 20px;
          font-weight: 600;
        }

        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar nav a {
          text-decoration: none;
          color: var(--muted-color);
          font-size: 15px;
          padding: 10px 14px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background var(--transition), color var(--transition);
          cursor: pointer;
        }

        .sidebar nav a:hover,
        .sidebar nav a.active {
          background: rgba(255, 255, 255, 0.2);
          color: var(--text-color);
        }

        .main-content {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
          order: 1;
        }

        .card {
          background: var(--glass-color);
          backdrop-filter: blur(20px);
          border: 1px solid var(--input-border);
          border-radius: 20px;
          padding: 30px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 10px 30px var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card h2 {
          color: var(--main-color);
          font-size: 22px;
          font-weight: 600;
          text-align: center;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-group label {
          color: var(--text-color);
          font-size: 14px;
          font-weight: 500;
        }

        .input-group input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--input-bg);
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .input-group input[type="range"]:hover {
          opacity: 1;
        }

        .input-group input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--main-color);
          cursor: pointer;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .checkbox-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: var(--main-color);
        }

        .checkbox-item label {
          color: var(--text-color);
          font-size: 14px;
          cursor: pointer;
        }

        .password-output {
          width: 100%;
          height: 60px;
          border: 1px solid var(--input-border);
          border-radius: 12px;
          padding: 14px;
          font-size: 16px;
          background: var(--input-bg);
          color: var(--text-color);
          resize: none;
          font-family: 'Courier New', monospace;
          display: flex;
          align-items: center;
        }

        .button-group {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .btn {
          flex: 1;
          background-color: var(--main-color);
          color: white;
          padding: 12px;
          font-size: 15px;
          font-weight: 500;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--text-color);
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 15px;
          font-size: 20px;
          margin-top: 10px;
        }

        .social-icons a {
          color: var(--muted-color);
          transition: color 0.3s;
          text-decoration: none;
        }

        .social-icons a:hover {
          color: var(--main-color);
        }

        .footer {
          text-align: center;
          font-size: 13px;
          color: var(--muted-color);
          margin-top: 10px;
        }

        .footer a {
          color: var(--main-color);
          text-decoration: none;
          font-weight: 500;
        }

        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px var(--shadow);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1000;
        }

        .toast.show {
          opacity: 1;
        }

        .back-button {
          position: fixed;
          top: 20px;
          left: 20px;
          background: var(--glass-color);
          backdrop-filter: blur(20px);
          border: 1px solid var(--input-border);
          color: var(--text-color);
          padding: 10px 15px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: var(--transition);
          z-index: 10;
          text-decoration: none;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }

          .main-content {
            padding: 20px;
            order: 1;
          }

          .card {
            padding: 20px;
          }

          .password-generator-container {
            direction: ltr;
          }
        }
      `}</style>

      <a href="#" onClick={handleBackToTools} className="back-button">
        ← العودة للأدوات
      </a>

      <div className="password-generator-container">
        <main className="main-content">
          <div className="card">
            <h2>🔐 مولد كلمات المرور</h2>
            
            <div className="input-group">
              <label>طول كلمة المرور: {length}</label>
              <input
                type="range"
                min="4"
                max="100"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
              />
            </div>

            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                />
                <label htmlFor="lowercase">أحرف صغيرة (a-z)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                />
                <label htmlFor="uppercase">أحرف كبيرة (A-Z)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
                <label htmlFor="numbers">أرقام (0-9)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="symbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />
                <label htmlFor="symbols">رموز (!@#$%^&*)</label>
              </div>
              
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="excludeSimilar"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                />
                <label htmlFor="excludeSimilar">استبعاد الأحرف المتشابهة (i,l,1,L,o,0,O)</label>
              </div>
            </div>

            <textarea
              className="password-output"
              value={password}
              readOnly
              placeholder="ستظهر كلمة المرور المولدة هنا..."
            />

            <div className="button-group">
              <button
                className="btn"
                onClick={generatePassword}
                disabled={isGenerating}
              >
                {isGenerating ? 'جاري التوليد...' : 'توليد'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={copyPassword}
                disabled={!password}
              >
                {copyButtonText}
              </button>
            </div>

            <button
              onClick={handleBackToTools}
              className="btn btn-secondary"
              style={{ marginTop: '10px' }}
            >
              العودة للأدوات
            </button>

            <div className="social-icons">
              <a href="https://discord.gg/FtprtXweuZ" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-discord"></i>
              </a>
              <a href="https://wa.me/971566252595" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://t.me/Ghaly333" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="https://guns.lol/Darky_dv" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe"></i>
              </a>
            </div>
            <div className="footer">
              تطوير بواسطة <a href="https://guns.lol/Darky_dv" target="_blank" rel="noopener noreferrer">DARK</a>
            </div>
          </div>
        </main>

        <aside className="sidebar">
          <div className="logo">
            <img src="https://i.imgur.com/AEmPsn1.jpeg" alt="logo" />
            <span>DARK</span>
          </div>
          <nav>
            <a href="#" className="active">
              <i className="fa fa-key"></i> كلمات المرور
            </a>
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default PasswordGenerator;
