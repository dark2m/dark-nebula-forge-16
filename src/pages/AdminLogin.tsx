import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, X, Shield, Crown } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AuthService from '../utils/auth';
import TranslationService from '../utils/translationService';
import { useToast } from '@/hooks/use-toast';
import AnimatedParticles from '../components/admin/AnimatedParticles';
import FloatingElements from '../components/admin/FloatingElements';
import EnhancedCard from '../components/admin/EnhancedCard';
import TypingAnimation from '../components/admin/TypingAnimation';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isAuthenticated = AuthService.authenticateAdmin(username, password);
      
      if (isAuthenticated) {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة التحكم"
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarryBackground />
      <AnimatedParticles />
      <FloatingElements />
      
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Additional Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-conic from-yellow-400/10 via-orange-500/10 to-red-500/10 rounded-full blur-2xl animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 z-[1]">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 0.5})`
            }}
          ></div>
        ))}
      </div>
      
      {/* Enhanced Back Button */}
      <button
        onClick={handleBackToHome}
        className="fixed top-8 right-8 z-30 group"
        title={TranslationService.translate('admin.back_to_site')}
      >
        <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110">
          <X className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors duration-300" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        </div>
      </button>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          
          {/* Main Enhanced Login Card */}
          <EnhancedCard glowColor="blue" className="transform hover:scale-105 transition-transform duration-500">
            <div className="p-8">
              
              {/* Enhanced Header */}
              <div className="text-center mb-8">
                {/* Enhanced Crown Icon */}
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                  <div className="absolute -inset-2 bg-gradient-conic from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full blur-xl animate-spin" style={{ animationDuration: '10s' }}></div>
                  <div className="relative p-6 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full border border-yellow-400/30">
                    <Crown className="w-10 h-10 text-yellow-300 animate-pulse" />
                    <Shield className="absolute -top-1 -right-1 w-6 h-6 text-blue-400 animate-bounce" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
                  <TypingAnimation text={TranslationService.translate('admin.login')} speed={150} />
                </h1>
                <p className="text-gray-300/80 text-lg">
                  <TypingAnimation 
                    text={TranslationService.translate('admin.login_description')} 
                    speed={50}
                    className="opacity-80"
                  />
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Enhanced Username Field */}
                <div className="relative group">
                  <label className="block text-gray-200 text-sm font-semibold mb-3 group-focus-within:text-blue-300 transition-colors duration-300">
                    <TypingAnimation text={TranslationService.translate('admin.username')} speed={80} />
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur-sm"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <User className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300 animate-pulse" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl pl-4 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300 group-hover:border-white/30"
                        placeholder={TranslationService.translate('admin.enter_username')}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Password Field */}
                <div className="relative group">
                  <label className="block text-gray-200 text-sm font-semibold mb-3 group-focus-within:text-purple-300 transition-colors duration-300">
                    <TypingAnimation text={TranslationService.translate('admin.password')} speed={80} />
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur-sm"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300 animate-pulse" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300 group-hover:border-white/30"
                        placeholder={TranslationService.translate('admin.enter_password')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 text-gray-400 hover:text-gray-200 transition-colors duration-300 focus:outline-none group hover:scale-110 transform"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Login Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full group overflow-hidden"
                  >
                    {/* Enhanced Button Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
                    <div className="absolute -inset-2 bg-gradient-conic from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    
                    {/* Button Content */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-500 group-hover:shadow-2xl group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transform">
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="mr-2">
                            <TypingAnimation text={TranslationService.translate('admin.logging_in')} speed={100} />
                          </span>
                        </div>
                      ) : (
                        <span>
                          <TypingAnimation text={TranslationService.translate('admin.login_button')} speed={100} />
                        </span>
                      )}
                      
                      {/* Enhanced Button Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 delay-200"></div>
                    </div>
                  </button>
                </div>
              </form>

              {/* Enhanced Decorative Elements */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 right-4 w-12 h-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-lg animate-bounce" style={{ animationDuration: '2s' }}></div>
            </div>
          </EnhancedCard>

          {/* Enhanced Footer */}
          <div className="text-center mt-8">
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg blur-lg animate-pulse"></div>
              <p className="relative text-gray-400/60 text-sm bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                <TypingAnimation text="🔒 نظام آمن ومحمي بأحدث التقنيات" speed={80} />
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
