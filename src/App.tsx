
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Home from "./pages/Home";
import PubgHacks from "./pages/PubgHacks";
import DiscordBots from "./pages/DiscordBots";
import WebDevelopment from "./pages/WebDevelopment";
import Tools from "./pages/Tools";
import PasswordGenerator from "./pages/PasswordGenerator";
import GmailGenerator from "./pages/GmailGenerator";
import Downloads from "./pages/Downloads";
import ContactUs from "./pages/ContactUs";
import CustomerSupport from "./pages/CustomerSupport";
import AboutUs from "./pages/AboutUs";
import OfficialPage from "./pages/OfficialPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Sport from "./pages/Sport";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-black text-white">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/sport" element={<Sport />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pubg-hacks" element={<PubgHacks />} />
              <Route path="/discord-bots" element={<DiscordBots />} />
              <Route path="/web-development" element={<WebDevelopment />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/password-generator" element={<PasswordGenerator />} />
              <Route path="/gmail-generator" element={<GmailGenerator />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/support" element={<CustomerSupport />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/official" element={<OfficialPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
