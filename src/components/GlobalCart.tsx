
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import { useCartWithQuantity } from '../hooks/useCartWithQuantity';
import SettingsService from '../utils/settingsService';
import type { SiteSettings } from '../types/admin';

const GlobalCart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartWithQuantity();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const loadedSettings = await SettingsService.getSiteSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('GlobalCart: Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handlePurchase = () => {
    if (!settings || cartItems.length === 0) return;

    const message = `مرحبا، أريد شراء هذه المنتجات:\n\n${cartItems.map(item => 
      `• ${item.name} - الكمية: ${item.quantity} - السعر: $${(typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity}`
    ).join('\n')}\n\nالمجموع الكلي: $${getTotalPrice()}`;
    
    const whatsappUrl = `https://wa.me/${settings.contactInfo.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading || !settings) return null;

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItems.length > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {settings.pageTexts.cart.cartTitle}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {settings.pageTexts.cart.emptyCartMessage}
              </p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="text-gray-400 hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white bg-white/10 px-2 py-1 rounded">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <span className="text-green-400 font-bold">
                        ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-white">المجموع:</span>
                    <span className="text-xl font-bold text-green-400">
                      ${getTotalPrice()}
                    </span>
                  </div>
                  
                  <button
                    onClick={handlePurchase}
                    className="w-full glow-button mb-3"
                  >
                    {settings.pageTexts.cart.purchaseButton}
                  </button>
                  
                  <p className="text-xs text-gray-400 text-center">
                    {settings.pageTexts.cart.purchaseNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalCart;
