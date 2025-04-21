
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PhishingDetection from "./pages/PhishingDetection";
import FraudDetection from "./pages/FraudDetection";
import SocialMonitoring from "./pages/SocialMonitoring";
import RansomwareSimulation from "./pages/RansomwareSimulation";
import DeepfakeDetection from "./pages/DeepfakeDetection";
import VoIPAnalysis from "./pages/VoIPAnalysis";
import UPIMonitoring from "./pages/UPIMonitoring";
import SIMFraudDetection from "./pages/SIMFraudDetection";
import FaceDatabase from "./pages/FaceDatabase";
import CrimeReport from "./pages/CrimeReport";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/phishing" element={<PhishingDetection />} />
          <Route path="/fraud" element={<FraudDetection />} />
          <Route path="/social" element={<SocialMonitoring />} />
          <Route path="/ransomware" element={<RansomwareSimulation />} />
          <Route path="/deepfake" element={<DeepfakeDetection />} />
          <Route path="/voip" element={<VoIPAnalysis />} />
          <Route path="/upi" element={<UPIMonitoring />} />
          <Route path="/sim-fraud" element={<SIMFraudDetection />} />
          <Route path="/face-database" element={<FaceDatabase />} />
          <Route path="/crime-report" element={<CrimeReport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
