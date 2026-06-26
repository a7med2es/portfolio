import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isCVEditor = location.pathname === '/admin/cv';

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-900 text-white rounded-md shadow-lg"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            Portfolio Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/hero" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Hero Section</NavLink>
          <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/experience" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Experience</NavLink>
          <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/education" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Education</NavLink>
          <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/projects" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Projects</NavLink>
          <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/skills" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Skills</NavLink>
          <NavLink onClick={() => setIsMobileMenuOpen(false)} to="/admin/cv" className={({isActive}) => `block px-4 py-2 mt-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>CV Update (PDF)</NavLink>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => supabase.auth.signOut()} 
            className="flex items-center gap-2 px-4 py-2 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header Spacer */}
        <div className="h-16 md:hidden shrink-0 border-b border-slate-200 bg-white flex items-center justify-center">
          <span className="font-semibold text-slate-700">Portfolio Admin</span>
        </div>
        <div className="flex-1 overflow-auto">
          {isCVEditor ? (
            <Outlet />
          ) : (
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
