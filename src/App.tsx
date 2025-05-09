
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PhishingDetection from "./pages/PhishingDetection";
import FraudDetection from "./pages/FraudDetection";
import RansomwareSimulation from "./pages/RansomwareSimulation";
import VoIPAnalysis from "./pages/VoIPAnalysis";
import DeepfakeDetection from "./pages/DeepfakeDetection";
import CrimeReport from "./pages/CrimeReport";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { initLocalStorage } from "./utils/localStorageUtils";

// Initialize QueryClient outside of component
const queryClient = new QueryClient();

const App = () => {
  // Initialize local storage when app loads
  useEffect(() => {
    initLocalStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/phishing" element={<PhishingDetection />} />
            <Route path="/fraud" element={<FraudDetection />} />
            <Route path="/ransomware" element={<RansomwareSimulation />} />
            <Route path="/voip" element={<VoIPAnalysis />} />
            <Route path="/deepfake-detection" element={<DeepfakeDetection />} />
            <Route path="/crime-report" element={<CrimeReport />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
