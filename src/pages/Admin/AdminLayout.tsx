import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            Portfolio Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/admin/hero" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Hero Section</NavLink>
          <NavLink to="/admin/experience" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Experience</NavLink>
          <NavLink to="/admin/education" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Education</NavLink>
          <NavLink to="/admin/projects" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Projects</NavLink>
          <NavLink to="/admin/skills" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>Skills</NavLink>
          <NavLink to="/admin/cv" className={({isActive}) => `block px-4 py-2 mt-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50 shadow-sm' : 'hover:bg-slate-800 hover:text-white'}`}>CV Update (PDF)</NavLink>
          <div className="pt-4 mt-4 border-t border-slate-800"></div>
          <NavLink to="/admin/restore" className={({isActive}) => `block px-4 py-2 rounded-lg transition-colors font-medium ${isActive ? 'bg-indigo-900/50 text-indigo-400 border border-indigo-800/50 shadow-sm' : 'text-indigo-400 hover:bg-slate-800'}`}>Restore Default Data</NavLink>
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
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
