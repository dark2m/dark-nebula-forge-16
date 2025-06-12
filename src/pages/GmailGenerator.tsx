
import React, { useState } from 'react';
import StarryBackground from '../components/StarryBackground';

const GmailGenerator = () => {
  const [username, setUsername] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('نسخ');

  const cleanInput = (value: string) => {
    return value.includes("@") ? value.split("@")[0] : value;
  };

  const showToast = (message: string) => {
    // Simple alert for now - can be enhanced with proper toast component
    alert(message);
  };

  const generateEmails = async () => {
    const cleanUsername = username.trim();
    
    if (!cleanUsername) {
      showToast("يرجى إدخال اسم المستخدم");
      return;
    }
    
    if (!/^[a-zA-Z0-9.]+$/.test(cleanUsername)) {
      showToast("اسم المستخدم يمكن أن يحتوي فقط على أحرف وأرقام ونقاط");
      return;
    }
    
    if (cleanUsername.length > 20) {
      showToast("اسم المستخدم طويل جداً (الحد الأقصى 20 حرف)");
      return;
    }

    setIsGenerating(true);
    
    try {
      const combinations = new Set<string>();
      const cleanUsernameNoDots = cleanUsername.replace(/\./g, '');
      
      const addDots = (str: string, idx: number) => {
        if (idx >= str.length - 1) {
          combinations.add(str);
          return;
        }
        addDots(str, idx + 1);
        addDots(str.slice(0, idx + 1) + "." + str.slice(idx + 1), idx + 2);
      };
      
      addDots(cleanUsernameNoDots, 0);
      
      const emailsList = Array.from(combinations)
        .map(name => `${name}@gmail.com`)
        .slice(0, 1000);
      
      setEmails(emailsList);
      showToast(`تم توليد ${emailsList.length} عنوان بريد إلكتروني`);
    } catch (error) {
      console.error("خطأ في التوليد:", error);
      showToast("حدث خطأ أثناء التوليد");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAllEmails = () => {
    if (emails.length === 0) {
      showToast("لا توجد رسائل بريد إلكتروني للنسخ");
      return;
    }
    
    const emailText = emails.join("\n");
    navigator.clipboard.writeText(emailText).then(() => {
      setCopyButtonText("تم النسخ!");
      showToast("تم نسخ جميع العناوين للحافظة");
      
      setTimeout(() => {
        setCopyButtonText("نسخ");
      }, 2000);
    }).catch(() => {
      showToast("فشل في النسخ");
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateEmails();
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              📧 مولد الجيميل
            </h1>
            <p className="text-xl text-gray-300">
              إنشاء جميع الاختلافات الممكنة لعناوين Gmail باستخدام النقاط
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    اسم المستخدم
                  </label>
                  <div className="flex overflow-hidden border border-white/30 rounded-lg bg-white/10">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(cleanInput(e.target.value))}
                      onKeyPress={handleKeyPress}
                      placeholder="username"
                      className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-300 outline-none"
                    />
                    <span className="px-4 py-3 text-gray-300 border-l border-white/30">
                      @gmail.com
                    </span>
                  </div>
                </div>

                <textarea
                  value={emails.join('\n')}
                  readOnly
                  placeholder="ستظهر عناوين البريد الإلكتروني المولدة هنا..."
                  className="w-full h-64 px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 resize-none outline-none"
                />

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={generateEmails}
                    disabled={isGenerating}
                    className="glow-button px-6 py-3 disabled:opacity-50"
                  >
                    {isGenerating ? "جاري التوليد..." : "توليد"}
                  </button>
                  <button
                    onClick={copyAllEmails}
                    disabled={emails.length === 0}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {copyButtonText}
                  </button>
                </div>

                <p className="text-center text-gray-300">
                  المجموع: <span className="text-white font-semibold">{emails.length}</span>
                </p>
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

export default GmailGenerator;
