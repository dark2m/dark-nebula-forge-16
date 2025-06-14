
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import StarryBackground from "../components/StarryBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <StarryBackground />
      
      <div className="relative z-10 container mx-auto px-6">
        <Card className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm border-white/30">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <AlertTriangle className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-6xl font-bold text-white mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-white mb-2">
                عذراً! الصفحة غير موجودة
              </h2>
              <p className="text-gray-300 text-lg mb-2">
                الصفحة التي تبحث عنها غير متوفرة أو تم نقلها
              </p>
              <p className="text-gray-400 text-sm">
                المسار: {location.pathname}
              </p>
            </div>

            <div className="space-y-4">
              <Link to="/">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg">
                  <Home className="w-5 h-5 mr-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </Link>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link to="/official">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    الصفحة الرسمية
                  </Button>
                </Link>
                <Link to="/pubg-hacks">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    هكر ببجي
                  </Button>
                </Link>
                <Link to="/web-development">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    برمجة مواقع
                  </Button>
                </Link>
                <Link to="/download">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    التنزيلات
                  </Button>
                </Link>
                <Link to="/tool">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    الأدوات
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                💡 نصيحة: تأكد من صحة الرابط أو استخدم شريط التنقل للوصول للصفحات المتاحة
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
