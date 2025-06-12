
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, Settings, Type, Package } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ProductService from '../utils/productService';
import SettingsService from '../utils/settingsService';
import type { Product, SiteSettings } from '../types/admin';

const Tools = () => {
  const [products, setProducts] = useState<Product[]>(ProductService.getProducts());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTextSection, setEditingTextSection] = useState<string>('home');
  const { toast } = useToast();

  // إدارة المنتجات
  const addNewProduct = () => {
    try {
      const newProduct = ProductService.addProduct({
        name: 'منتج جديد',
        price: 0,
        category: 'pubg',
        images: [],
        videos: [],
        description: 'وصف المنتج',
        features: [],
        textSize: 'medium',
        titleSize: 'large'
      });
      
      setProducts(ProductService.getProducts());
      setEditingProduct(newProduct);
      
      toast({
        title: "تم إضافة المنتج",
        description: "تم إضافة منتج جديد بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
    }
  };

  const updateProduct = (updates: Partial<Product>) => {
    if (!editingProduct) return;
    
    try {
      ProductService.updateProduct(editingProduct.id, updates);
      setProducts(ProductService.getProducts());
      setEditingProduct({ ...editingProduct, ...updates });
      
      toast({
        title: "تم تحديث المنتج",
        description: "تم حفظ التغييرات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = (id: number) => {
    try {
      ProductService.deleteProduct(id);
      setProducts(ProductService.getProducts());
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
      
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive"
      });
    }
  };

  // إدارة النصوص
  const updatePageText = (section: string, field: string, value: string) => {
    const updatedSettings = {
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        [section]: {
          ...siteSettings.pageTexts[section as keyof typeof siteSettings.pageTexts],
          [field]: value
        }
      }
    };
    
    setSiteSettings(updatedSettings);
    SettingsService.saveSiteSettings(updatedSettings);
    
    toast({
      title: "تم تحديث النص",
      description: "تم حفظ التغييرات على النصوص"
    });
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              أدوات الإدارة
            </h1>
            <p className="text-xl text-gray-300">
              إدارة المنتجات والنصوص من مكان واحد
            </p>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm">
              <TabsTrigger value="products" className="data-[state=active]:bg-white/30 data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                إدارة المنتجات
              </TabsTrigger>
              <TabsTrigger value="texts" className="data-[state=active]:bg-white/30 data-[state=active]:text-white">
                <Type className="w-4 h-4 mr-2" />
                إدارة النصوص
              </TabsTrigger>
            </TabsList>

            {/* إدارة المنتجات */}
            <TabsContent value="products" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* قائمة المنتجات */}
                <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      قائمة المنتجات
                      <Button onClick={addNewProduct} size="sm" className="glow-button">
                        <Plus className="w-4 h-4 mr-2" />
                        إضافة منتج
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          editingProduct?.id === product.id
                            ? 'bg-blue-500/20 border-blue-400'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                        onClick={() => setEditingProduct(product)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">{product.name}</h3>
                            <p className="text-gray-300 text-sm">{product.price} ر.س</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(product);
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProduct(product.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* تحرير المنتج */}
                <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {editingProduct ? 'تحرير المنتج' : 'اختر منتج للتحرير'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editingProduct ? (
                      <>
                        <div>
                          <Label htmlFor="product-name" className="text-white">اسم المنتج</Label>
                          <Input
                            id="product-name"
                            value={editingProduct.name}
                            onChange={(e) => updateProduct({ name: e.target.value })}
                            className="bg-white/20 border-white/30 text-white"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="product-price" className="text-white">السعر (ر.س)</Label>
                          <Input
                            id="product-price"
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => updateProduct({ price: Number(e.target.value) })}
                            className="bg-white/20 border-white/30 text-white"
                          />
                        </div>

                        <div>
                          <Label htmlFor="product-category" className="text-white">الفئة</Label>
                          <Select
                            value={editingProduct.category}
                            onValueChange={(value) => updateProduct({ category: value as any })}
                          >
                            <SelectTrigger className="bg-white/20 border-white/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pubg">ببجي موبايل</SelectItem>
                              <SelectItem value="web">برمجة مواقع</SelectItem>
                              <SelectItem value="discord">بوتات ديسكورد</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="product-description" className="text-white">الوصف</Label>
                          <Textarea
                            id="product-description"
                            value={editingProduct.description}
                            onChange={(e) => updateProduct({ description: e.target.value })}
                            className="bg-white/20 border-white/30 text-white"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="product-features" className="text-white">المميزات (مفصولة بفواصل)</Label>
                          <Textarea
                            id="product-features"
                            value={editingProduct.features?.join(', ') || ''}
                            onChange={(e) => updateProduct({ 
                              features: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                            })}
                            className="bg-white/20 border-white/30 text-white"
                            rows={2}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-300 text-center py-8">
                        اختر منتجاً من القائمة للبدء في التحرير
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* إدارة النصوص */}
            <TabsContent value="texts" className="space-y-6">
              <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                <CardHeader>
                  <CardTitle className="text-white">تحرير نصوص الموقع</CardTitle>
                  <CardDescription className="text-gray-200">
                    اختر قسماً لتحرير نصوصه
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="text-section" className="text-white">اختر القسم</Label>
                    <Select
                      value={editingTextSection}
                      onValueChange={setEditingTextSection}
                    >
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">الصفحة الرئيسية</SelectItem>
                        <SelectItem value="official">الصفحة الرسمية</SelectItem>
                        <SelectItem value="pubgHacks">ببجي موبايل</SelectItem>
                        <SelectItem value="webDevelopment">برمجة المواقع</SelectItem>
                        <SelectItem value="discordBots">بوتات ديسكورد</SelectItem>
                        <SelectItem value="navigation">التنقل</SelectItem>
                        <SelectItem value="cart">السلة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editingTextSection === 'home' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">عنوان الصفحة الرئيسية</Label>
                        <Input
                          value={siteSettings.pageTexts.home.heroTitle}
                          onChange={(e) => updatePageText('home', 'heroTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">النص التوضيحي</Label>
                        <Textarea
                          value={siteSettings.pageTexts.home.heroSubtitle}
                          onChange={(e) => updatePageText('home', 'heroSubtitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label className="text-white">عنوان المميزات</Label>
                        <Input
                          value={siteSettings.pageTexts.home.featuresTitle}
                          onChange={(e) => updatePageText('home', 'featuresTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {editingTextSection === 'official' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">عنوان الصفحة</Label>
                        <Input
                          value={siteSettings.pageTexts.official.pageTitle}
                          onChange={(e) => updatePageText('official', 'pageTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">وصف الصفحة</Label>
                        <Textarea
                          value={siteSettings.pageTexts.official.pageSubtitle}
                          onChange={(e) => updatePageText('official', 'pageSubtitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="text-white">عنوان من نحن</Label>
                        <Input
                          value={siteSettings.pageTexts.official.aboutTitle}
                          onChange={(e) => updatePageText('official', 'aboutTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {editingTextSection === 'navigation' && (
                    <div className="space-y-4 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">الرئيسية</Label>
                        <Input
                          value={siteSettings.pageTexts.navigation.homeTitle}
                          onChange={(e) => updatePageText('navigation', 'homeTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">ببجي موبايل</Label>
                        <Input
                          value={siteSettings.pageTexts.navigation.pubgTitle}
                          onChange={(e) => updatePageText('navigation', 'pubgTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">برمجة مواقع</Label>
                        <Input
                          value={siteSettings.pageTexts.navigation.webTitle}
                          onChange={(e) => updatePageText('navigation', 'webTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">بوتات ديسكورد</Label>
                        <Input
                          value={siteSettings.pageTexts.navigation.discordTitle}
                          onChange={(e) => updatePageText('navigation', 'discordTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                    </div>
                  )}

                  {editingTextSection === 'cart' && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">عنوان السلة</Label>
                        <Input
                          value={siteSettings.pageTexts.cart.cartTitle}
                          onChange={(e) => updatePageText('cart', 'cartTitle', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">رسالة السلة الفارغة</Label>
                        <Input
                          value={siteSettings.pageTexts.cart.emptyCartMessage}
                          onChange={(e) => updatePageText('cart', 'emptyCartMessage', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white">زر الشراء</Label>
                        <Input
                          value={siteSettings.pageTexts.cart.purchaseButton}
                          onChange={(e) => updatePageText('cart', 'purchaseButton', e.target.value)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Tools;
