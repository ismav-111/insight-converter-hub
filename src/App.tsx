
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import EnSights from "./pages/EnSights";
import EnDocs from "./pages/EnDocs";
import EnCore from "./pages/EnCore";
import NotFound from "./pages/NotFound";
import NavBar from "./components/layout/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <NavBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ensights" element={<EnSights />} />
            <Route path="/endocs" element={<EnDocs />} />
            <Route path="/encore" element={<EnCore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
