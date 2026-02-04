import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WaitlistProvider } from "@/components/WaitlistProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import LandingProductManager from "./pages/LandingProductManager";
import LandingStartup from "./pages/LandingStartup";
import LandingFounders from "./pages/LandingFounders";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./pages/ProductDetail";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WaitlistProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/product-manager" element={<LandingProductManager />} />
            <Route path="/startup" element={<LandingStartup />} />
            <Route path="/founders" element={<LandingFounders />} />
            <Route path="/portfolio" element={<Navigate to="/how-it-works" replace />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </WaitlistProvider>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
