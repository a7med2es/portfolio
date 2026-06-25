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
import ManageExperience from "./pages/Admin/ManageExperience";
import ManageEducation from "./pages/Admin/ManageEducation";
import ManageProjects from "./pages/Admin/ManageProjects";
import ManageSkills from "./pages/Admin/ManageSkills";
import CVBuilder from "./pages/Admin/CVBuilder";
import SeedData from "./pages/Admin/SeedData";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
});

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
              <Route path="experience" element={<ManageExperience />} />
              <Route path="education" element={<ManageEducation />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="skills" element={<ManageSkills />} />
              <Route path="cv" element={<CVBuilder />} />
              <Route path="restore" element={<SeedData />} />
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
