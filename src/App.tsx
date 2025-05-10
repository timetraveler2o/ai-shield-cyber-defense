
import React, { useEffect } from "react";
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
import { Profile } from "./pages/Profile";
import LegalAssistant from "./pages/LegalAssistant";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import About from "./pages/About";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initLocalStorage } from "./utils/localStorageUtils";
import { ThemeProvider } from "./components/theme/theme-provider";

// Initialize QueryClient outside of component
const queryClient = new QueryClient();

const App: React.FC = () => {
  // Initialize local storage when app loads
  useEffect(() => {
    initLocalStorage();
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
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
              <Route path="/legal-assistant" element={<LegalAssistant />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
