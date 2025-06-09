
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PubgHacks from "./pages/PubgHacks";
import WebDevelopment from "./pages/WebDevelopment";
import DiscordBots from "./pages/DiscordBots";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navigation />
                <Home />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navigation />
                <AboutUs />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Navigation />
                <ContactUs />
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
  </QueryClientProvider>
);

export default App;
