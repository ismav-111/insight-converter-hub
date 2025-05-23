
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
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import NavBar from "./components/layout/NavBar";
import { AppProvider } from "./contexts/AppContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
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
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
