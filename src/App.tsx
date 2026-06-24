import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Login from "./pages/Admin/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import ManageHero from "./pages/Admin/ManageHero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<div className="text-xl text-slate-500 font-medium text-center py-20">Welcome to Admin Panel. Select an option from the sidebar to edit your portfolio.</div>} />
              <Route path="hero" element={<ManageHero />} />
              <Route path="experience" element={<div>Manage Experience (Coming Soon)</div>} />
              <Route path="education" element={<div>Manage Education (Coming Soon)</div>} />
              <Route path="projects" element={<div>Manage Projects (Coming Soon)</div>} />
              <Route path="skills" element={<div>Manage Skills (Coming Soon)</div>} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
