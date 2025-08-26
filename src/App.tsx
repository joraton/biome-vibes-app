import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authenticated } from 'convex/react';
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { UserSync } from "./components/auth/UserSync";
import { useScrollToTop } from "./hooks/use-scroll-to-top";
import Index from "./pages/Index";
import BiomePage from "./pages/BiomePage";
import SubBiomePage from "./pages/SubBiomePage";
import SpecialHistoryPage from "./pages/SpecialHistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Composant interne pour utiliser le hook useScrollToTop
const AppContent = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Authenticated>
        <UserSync />
      </Authenticated>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/biome/:biomeId" element={<BiomePage />} />
          <Route path="/biome/:biomeId/:subBiomeId" element={<SubBiomePage />} />
          <Route path="/historique-special" element={<SpecialHistoryPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
