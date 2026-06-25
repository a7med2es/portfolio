import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useProjects } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Edit2, Eye, EyeOff, Loader2, X } from "lucide-react";

const HIDDEN_KEY = "portfolio_hidden_projects";

const emptyProject = {
  title: "", subtitle: "", date: "", project_url: "",
  descriptions: [""], tags: [""], icon_name: "Rocket", sort_order: 0,
};

function ArrayEditor({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const items = Array.isArray(value) ? value : [""];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }} placeholder={`${placeholder} ${i + 1}`} className="text-sm" />
          <Button type="button" size="icon" variant="ghost" className="text-red-400 hover:text-red-600 flex-shrink-0"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={() => onChange([...items, ""])}>
        <Plus className="w-3 h-3 mr-1" /> Add
      </Button>
    </div>
  );
}

function TextArrayEditor({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  const items = Array.isArray(value) ? value : [""];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Textarea value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
            className="min-h-[56px] text-sm resize-none" placeholder={`${placeholder} ${i + 1}`} />
          <Button type="button" size="icon" variant="ghost" className="text-red-400 hover:text-red-600 flex-shrink-0 h-8 w-8 mt-1"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={() => onChange([...items, ""])}>
        <Plus className="w-3 h-3 mr-1" /> Add
      </Button>
    </div>
  );
}

function ProjectForm({ data, onChange, onSave, onCancel, isNew, saving }: any) {
  return (
    <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "title", label: "Project Title", placeholder: "Smart Vehicle System" },
          { key: "subtitle", label: "Subtitle", placeholder: "Graduation Project - University of Technology" },
          { key: "date", label: "Date", placeholder: "01/2024 - 06/2025" },
          { key: "project_url", label: "Project URL (optional)", placeholder: "https://..." },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">{label}</label>
            <Input value={data[key] || ""} onChange={e => onChange({ ...data, [key]: e.target.value })} placeholder={placeholder} className="text-sm" />
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Description Points</label>
        <TextArrayEditor
          value={Array.isArray(data.descriptions) ? data.descriptions : [""]}
          onChange={v => onChange({ ...data, descriptions: v })}
          placeholder="Description point"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Tags / Technologies</label>
        <ArrayEditor
          value={Array.isArray(data.tags) ? data.tags : [""]}
          onChange={v => onChange({ ...data, tags: v })}
          placeholder="Tag"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500">Cancel</Button>
        <Button type="button" onClick={() => onSave(data, isNew)} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isNew ? "Add Project" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function ManageProjects() {
  const { data: projects, isLoading, refetch } = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState<any>({ ...emptyProject });
  const [saving, setSaving] = useState(false);
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]")); }
    catch { return new Set(); }
  });

  const toggleHidden = (id: string) => {
    setHiddenItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleSave = async (data: any, isNew = false) => {
    setSaving(true);
    try {
      if (isNew) {
        const { error } = await supabase.from("projects").insert([{ ...data, sort_order: projects?.length || 0 }]);
        if (error) throw error;
        toast.success("Project added!");
        setAddingNew(false);
        setNewData({ ...emptyProject });
      } else {
        const { error } = await supabase.from("projects").update(data).eq("id", data.id);
        if (error) throw error;
        toast.success("Project updated!");
        setEditingId(null);
      }
      refetch();
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted!"); refetch(); }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-slate-500 py-8 justify-center"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Academic Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Showcase your projects with descriptions and tech tags.</p>
        </div>
        <Button onClick={() => { setAddingNew(true); setEditingId(null); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {addingNew && (
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-blue-700 text-lg">New Project</CardTitle></CardHeader>
          <CardContent>
            <ProjectForm data={newData} onChange={setNewData} onSave={handleSave} onCancel={() => setAddingNew(false)} isNew saving={saving} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {projects?.map((proj: any) => (
          <Card key={proj.id} className={`border-0 shadow-sm transition-all ${hiddenItems.has(proj.id) ? "opacity-50 bg-red-50/30" : "bg-white"}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-slate-800">{proj.title}</span>
                    {hiddenItems.has(proj.id) && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
                  </div>
                  {proj.subtitle && <p className="text-sm text-slate-500 mt-0.5">{proj.subtitle}</p>}
                  {proj.date && <p className="text-xs text-slate-400 mt-0.5">{proj.date}</p>}
                  {Array.isArray(proj.tags) && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.tags.map((tag: string, i: number) => (
                        <span key={i} className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => toggleHidden(proj.id)}
                    className={hiddenItems.has(proj.id) ? "text-red-400 hover:text-red-600" : "text-slate-400 hover:text-slate-600"}>
                    {hiddenItems.has(proj.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => editingId === proj.id ? (setEditingId(null), setEditData(null)) : (setEditingId(proj.id), setEditData({ ...proj }))}
                    className="text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(proj.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {editingId === proj.id && editData && (
                <ProjectForm data={editData} onChange={setEditData} onSave={handleSave}
                  onCancel={() => { setEditingId(null); setEditData(null); }} saving={saving} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!projects || projects.length === 0) && !addingNew && (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="text-sm mt-1">Click "Add Project" to get started</p>
        </div>
      )}
    </div>
  );
}
