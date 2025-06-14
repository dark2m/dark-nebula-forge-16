
export const passwordGeneratorToolCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>مولد كلمات المرور</title>
  <link rel="icon" href="https://i.imgur.com/AEmPsn1.jpeg" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
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

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text-color);
      display: flex;
      min-height: 100vh;
      position: relative;
      direction: rtl;
    }

    /* Starry Background Styles */
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

    /* Main Content Styles */
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

    h2 {
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

    textarea {
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
    }

    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    button {
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

    button:hover {
      opacity: 0.9;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-color);
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
    }

    .social-icons a:hover {
      color: var(--main-color);
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
  </style>
</head>
<body>
  <!-- Starry Background -->
  <div class="starry-background">
    <div class="stars" id="stars-container"></div>
  </div>

  <div class="toast" id="toast"></div>

  <main class="main-content">
    <div class="card">
      <h2>🔐 مولد كلمات المرور</h2>
      
      <div class="input-group">
        <label>طول كلمة المرور: <span id="lengthValue">12</span></label>
        <input type="range" id="lengthSlider" min="4" max="100" value="12" oninput="updateLength()" />
      </div>

      <div class="checkbox-group">
        <div class="checkbox-item">
          <input type="checkbox" id="lowercase" checked />
          <label for="lowercase">أحرف صغيرة (a-z)</label>
        </div>
        
        <div class="checkbox-item">
          <input type="checkbox" id="uppercase" checked />
          <label for="uppercase">أحرف كبيرة (A-Z)</label>
        </div>
        
        <div class="checkbox-item">
          <input type="checkbox" id="numbers" checked />
          <label for="numbers">أرقام (0-9)</label>
        </div>
        
        <div class="checkbox-item">
          <input type="checkbox" id="symbols" checked />
          <label for="symbols">رموز (!@#$%^&*)</label>
        </div>
        
        <div class="checkbox-item">
          <input type="checkbox" id="excludeSimilar" />
          <label for="excludeSimilar">استبعاد الأحرف المتشابهة (i,l,1,L,o,0,O)</label>
        </div>
      </div>

      <textarea id="passwordOutput" readonly placeholder="ستظهر كلمة المرور المولدة هنا..."></textarea>
      
      <div class="button-group">
        <button onclick="generatePassword()" id="generateBtn">توليد</button>
        <button class="btn-secondary" onclick="copyPassword()" id="copyBtn" disabled>نسخ</button>
      </div>
      
      <div class="social-icons">
        <a href="https://discord.gg/FtprtXweuZ" target="_blank" title="Discord"><i class="fab fa-discord"></i></a>
        <a href="https://wa.me/971566252595" target="_blank" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        <a href="https://t.me/Ghaly333" target="_blank" title="Telegram"><i class="fab fa-telegram"></i></a>
        <a href="https://guns.lol/Darky_dv" target="_blank" title="Website"><i class="fas fa-globe"></i></a>
      </div>
      <div class="footer">تطوير بواسطة <a href="https://guns.lol/Darky_dv" target="_blank">DARK</a></div>
    </div>
  </main>

  <aside class="sidebar">
    <div class="logo">
      <img src="https://i.imgur.com/AEmPsn1.jpeg" alt="logo">
      <span>DARK</span>
    </div>
    <nav>
      <a href="#" class="active"><i class="fa fa-key"></i> كلمات المرور</a>
    </nav>
  </aside>

  <script>
    // Initialize Starry Background
    function initStarryBackground() {
      const starsContainer = document.getElementById('stars-container');
      const starCount = 100;
      const meteorCount = 8;
      const meteorColors = ['#4ecdc4', '#45b7d1', '#ffeaa7', '#fd79a8', '#a8e6cf', '#81ecec'];

      // Create stars
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = \`\${Math.random() * 100}%\`;
        star.style.top = \`\${Math.random() * 100}%\`;
        star.style.width = \`\${(Math.random() * 2 + 0.5)}px\`;
        star.style.height = star.style.width;
        starsContainer.appendChild(star);
      }

      // Create meteors
      for (let i = 0; i < meteorCount; i++) {
        const meteor = document.createElement('div');
        const color = meteorColors[i % meteorColors.length];
        const direction = i % 2 === 0 ? 'down' : 'up';
        
        meteor.className = \`meteor-colored meteor-fall-\${direction}\`;
        meteor.style.left = \`\${Math.random() * 100}%\`;
        meteor.style.top = direction === 'up' ? \`\${90 + Math.random() * 10}%\` : \`-\${Math.random() * 10}%\`;
        meteor.style.width = '2px';
        meteor.style.height = '12px';
        meteor.style.animationDelay = \`\${Math.random() * 8}s\`;
        meteor.style.animationDuration = \`\${4 + Math.random() * 3}s\`;
        meteor.style.background = \`linear-gradient(180deg, transparent 0%, \${color} 50%, \${color}dd 100%)\`;
        meteor.style.boxShadow = \`0 0 8px \${color}80\`;
        
        starsContainer.appendChild(meteor);
      }
    }

    function updateLength() {
      const slider = document.getElementById('lengthSlider');
      const valueSpan = document.getElementById('lengthValue');
      valueSpan.textContent = slider.value;
    }

    function showToast(message, duration = 2000) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.classList.add("show");
      
      setTimeout(() => {
        toast.classList.remove("show");
      }, duration);
    }

    function generatePassword() {
      const length = parseInt(document.getElementById('lengthSlider').value);
      const includeLowercase = document.getElementById('lowercase').checked;
      const includeUppercase = document.getElementById('uppercase').checked;
      const includeNumbers = document.getElementById('numbers').checked;
      const includeSymbols = document.getElementById('symbols').checked;
      const excludeSimilar = document.getElementById('excludeSimilar').checked;
      
      if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
        showToast('يجب تحديد نوع واحد على الأقل من الأحرف');
        return;
      }

      const generateBtn = document.getElementById('generateBtn');
      const originalText = generateBtn.textContent;
      generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التوليد...';
      generateBtn.disabled = true;

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

          let password = '';
          for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
          }

          document.getElementById('passwordOutput').value = password;
          document.getElementById('copyBtn').disabled = false;
          showToast('تم توليد كلمة مرور جديدة');
        } catch (error) {
          showToast('حدث خطأ أثناء توليد كلمة المرور');
        } finally {
          generateBtn.textContent = originalText;
          generateBtn.disabled = false;
        }
      }, 100);
    }

    function copyPassword() {
      const passwordOutput = document.getElementById('passwordOutput');
      const copyBtn = document.getElementById('copyBtn');
      
      if (!passwordOutput.value) {
        showToast('لا توجد كلمة مرور للنسخ');
        return;
      }

      passwordOutput.select();
      document.execCommand('copy');
      
      copyBtn.textContent = 'تم النسخ!';
      copyBtn.style.backgroundColor = '#4CAF50';
      
      showToast('تم نسخ كلمة المرور للحافظة');
      
      setTimeout(() => {
        copyBtn.textContent = 'نسخ';
        copyBtn.style.backgroundColor = '';
      }, 2000);
    }

    // Initialize the starry background when page loads
    window.onload = function() {
      initStarryBackground();
    };
  </script>
</body>
</html>`;
