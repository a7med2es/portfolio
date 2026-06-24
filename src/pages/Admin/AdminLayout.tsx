import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, Link } from "react-router-dom";
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
          <Link to="/admin/hero" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Hero Section</Link>
          <Link to="/admin/experience" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Experience</Link>
          <Link to="/admin/education" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Education</Link>
          <Link to="/admin/projects" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Projects</Link>
          <Link to="/admin/skills" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Skills</Link>
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
