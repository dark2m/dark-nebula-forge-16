
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthGuard from "./components/auth/AuthGuard";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import OfficialPage from "./pages/OfficialPage";
import PubgHacks from "./pages/PubgHacks";
import WebDevelopment from "./pages/WebDevelopment";
import DiscordBots from "./pages/DiscordBots";
import Tools from "./pages/Tools";
import CustomerSupport from "./pages/CustomerSupport";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <Routes>
              {/* Auth Route */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Dashboard */}
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } />
              
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Navigation />
                  <Home />
                </>
              } />
              <Route path="/official" element={
                <>
                  <Navigation />
                  <OfficialPage />
                </>
              } />
              <Route path="/pubg-hacks" element={
                <>
                  <Navigation />
                  <PubgHacks />
                </>
              } />
              <Route path="/web-development" element={
                <>
                  <Navigation />
                  <WebDevelopment />
                </>
              } />
              <Route path="/discord-bots" element={
                <>
                  <Navigation />
                  <DiscordBots />
                </>
              } />
              <Route path="/tool" element={
                <>
                  <Navigation />
                  <Tools />
                </>
              } />
              <Route path="/sport" element={
                <>
                  <Navigation />
                  <CustomerSupport />
                </>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
