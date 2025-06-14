
import React, { useState } from 'react';
import StarryBackground from '../components/StarryBackground';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copyButtonText, setCopyButtonText] = useState('نسخ');

  const generatePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (chars === '') {
      alert('يرجى اختيار نوع واحد على الأقل من الأحرف');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const copyPassword = () => {
    if (!password) {
      alert('لا توجد كلمة مرور للنسخ');
      return;
    }
    
    navigator.clipboard.writeText(password).then(() => {
      setCopyButtonText('تم النسخ!');
      alert('تم نسخ كلمة المرور للحافظة');
      
      setTimeout(() => {
        setCopyButtonText('نسخ');
      }, 2000);
    }).catch(() => {
      alert('فشل في النسخ');
    });
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔐 مولد كلمات المرور
            </h1>
            <p className="text-xl text-gray-300">
              إنشاء كلمات مرور قوية وآمنة
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    طول كلمة المرور: {length}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="50"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={includeUppercase}
                      onChange={(e) => setIncludeUppercase(e.target.checked)}
                      className="mr-2"
                    />
                    أحرف كبيرة (A-Z)
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={includeLowercase}
                      onChange={(e) => setIncludeLowercase(e.target.checked)}
                      className="mr-2"
                    />
                    أحرف صغيرة (a-z)
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={includeNumbers}
                      onChange={(e) => setIncludeNumbers(e.target.checked)}
                      className="mr-2"
                    />
                    أرقام (0-9)
                  </label>
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={includeSymbols}
                      onChange={(e) => setIncludeSymbols(e.target.checked)}
                      className="mr-2"
                    />
                    رموز (!@#$%^&*)
                  </label>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    كلمة المرور المولدة
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={password}
                      readOnly
                      placeholder="اضغط 'توليد' لإنشاء كلمة مرور"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 outline-none"
                    />
                    <button
                      onClick={copyPassword}
                      disabled={!password}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {copyButtonText}
                    </button>
                  </div>
                </div>

                <button
                  onClick={generatePassword}
                  className="glow-button w-full py-3"
                >
                  توليد كلمة مرور
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="flex justify-center gap-6 text-2xl">
                <a href="https://discord.gg/FtprtXweuZ" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-400 hover:text-blue-400 transition-colors">
                  <i className="fab fa-discord"></i>
                </a>
                <a href="https://wa.me/971566252595" target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-green-400 transition-colors">
                  <i className="fab fa-whatsapp"></i>
                </a>
                <a href="https://t.me/Ghaly333" target="_blank" rel="noopener noreferrer"
                   className="text-gray-400 hover:text-blue-300 transition-colors">
                  <i className="fab fa-telegram"></i>
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                تطوير بواسطة <span className="text-blue-400 font-semibold">DARK</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
