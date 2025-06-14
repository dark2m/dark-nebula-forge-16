
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, X, Shield, Crown } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AuthService from '../utils/auth';
import TranslationService from '../utils/translationService';
import { useToast } from '@/hooks/use-toast';

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
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-[1]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Back to Home Button */}
      <button
        onClick={handleBackToHome}
        className="fixed top-8 right-8 z-30 group"
        title={TranslationService.translate('admin.back_to_site')}
      >
        <div className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110">
          <X className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors duration-300" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </button>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          
          {/* Main Login Card */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            
            {/* Card Content */}
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              
              {/* Header */}
              <div className="text-center mb-8">
                {/* Crown Icon with Animation */}
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                  <div className="relative p-6 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 rounded-full border border-yellow-400/30">
                    <Crown className="w-10 h-10 text-yellow-300" />
                    <Shield className="absolute -top-1 -right-1 w-6 h-6 text-blue-400" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3">
                  {TranslationService.translate('admin.login')}
                </h1>
                <p className="text-gray-300/80 text-lg">
                  {TranslationService.translate('admin.login_description')}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Username Field */}
                <div className="relative group">
                  <label className="block text-gray-200 text-sm font-semibold mb-3 group-focus-within:text-blue-300 transition-colors duration-300">
                    {TranslationService.translate('admin.username')}
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur-sm"></div>
                    <div className="relative flex items-center">
                      <User className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl pl-4 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all duration-300"
                        placeholder={TranslationService.translate('admin.enter_username')}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <label className="block text-gray-200 text-sm font-semibold mb-3 group-focus-within:text-blue-300 transition-colors duration-300">
                    {TranslationService.translate('admin.password')}
                  </label>
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur-sm"></div>
                    <div className="relative flex items-center">
                      <Lock className="absolute right-4 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-300" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all duration-300"
                        placeholder={TranslationService.translate('admin.enter_password')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 text-gray-400 hover:text-gray-200 transition-colors duration-300 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full group overflow-hidden"
                  >
                    {/* Button Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Button Content */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-cyan-500 group-hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="mr-2">{TranslationService.translate('admin.logging_in')}</span>
                        </div>
                      ) : (
                        <span>{TranslationService.translate('admin.login_button')}</span>
                      )}
                      
                      {/* Button Inner Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </button>
                </div>
              </form>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-400/60 text-sm">
              🔒 نظام آمن ومحمي بأحدث التقنيات
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
