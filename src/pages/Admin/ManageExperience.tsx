import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useExperiences } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Edit2, Eye, EyeOff, Loader2, X } from "lucide-react";

const HIDDEN_KEY = "portfolio_hidden_experiences";

const emptyExp = {
  title: "", company: "", location: "", date: "",
  description: [""], achievement_link: "", achievement_title: "", sort_order: 0,
};

function DescriptionEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const items = Array.isArray(value) ? value : [""];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            value={item}
            onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
            className="min-h-[56px] text-sm resize-none"
            placeholder={`Description point ${i + 1}`}
          />
          <Button type="button" size="icon" variant="ghost"
            className="text-red-400 hover:text-red-600 flex-shrink-0 h-8 w-8 mt-1"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline"
        className="text-blue-600 border-blue-200 hover:bg-blue-50"
        onClick={() => onChange([...items, ""])}>
        <Plus className="w-3 h-3 mr-1" /> Add Point
      </Button>
    </div>
  );
}

function ExpForm({ data, onChange, onSave, onCancel, isNew, saving }: any) {
  return (
    <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "title", label: "Job Title", placeholder: "e.g. Technical Support" },
          { key: "company", label: "Company", placeholder: "Company name" },
          { key: "location", label: "Location", placeholder: "City" },
          { key: "date", label: "Date Period", placeholder: "07/2024 - Present" },
          { key: "achievement_link", label: "Achievement Link (optional)", placeholder: "https://..." },
          { key: "achievement_title", label: "Achievement Button Text (optional)", placeholder: "View Certificate" },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">{label}</label>
            {key === "date" ? (
              <DateRangePicker value={data[key] || ""} onChange={val => onChange({ ...data, [key]: val })} />
            ) : (
              <Input value={data[key] || ""} onChange={e => onChange({ ...data, [key]: e.target.value })} placeholder={placeholder} className="text-sm" />
            )}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Description Bullet Points</label>
        <DescriptionEditor
          value={Array.isArray(data.description) ? data.description : [""]}
          onChange={v => onChange({ ...data, description: v })}
        />
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500">Cancel</Button>
        <Button type="button" onClick={() => onSave(data, isNew)} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isNew ? "Add Experience" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function ManageExperience() {
  const { data: experiences, isLoading, refetch } = useExperiences();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState<any>({ ...emptyExp });
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
        const { error } = await supabase.from("experiences").insert([{ ...data, sort_order: (experiences?.length || 0) }]);
        if (error) throw error;
        toast.success("Experience added successfully!");
        setAddingNew(false);
        setNewData({ ...emptyExp });
      } else {
        const { error } = await supabase.from("experiences").update(data).eq("id", data.id);
        if (error) throw error;
        toast.success("Experience updated!");
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
    if (!confirm("Delete this experience?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted!"); refetch(); }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-slate-500 py-8 justify-center"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Work Experience</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your work history — add, edit, hide, or delete entries.</p>
        </div>
        <Button onClick={() => { setAddingNew(true); setEditingId(null); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </div>

      {addingNew && (
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-blue-700 text-lg">New Experience</CardTitle></CardHeader>
          <CardContent>
            <ExpForm data={newData} onChange={setNewData} onSave={handleSave} onCancel={() => setAddingNew(false)} isNew saving={saving} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {experiences?.map((exp: any) => (
          <Card key={exp.id} className={`border-0 shadow-sm transition-all ${hiddenItems.has(exp.id) ? "opacity-50 bg-red-50/30" : "bg-white"}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-slate-800">{exp.title}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-blue-600 font-medium text-sm">{exp.company}</span>
                    {exp.date && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{exp.date}</span>}
                    {hiddenItems.has(exp.id) && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
                  </div>
                  {exp.location && <p className="text-xs text-slate-400 mt-0.5">{exp.location}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" title={hiddenItems.has(exp.id) ? "Show" : "Hide"}
                    onClick={() => toggleHidden(exp.id)}
                    className={hiddenItems.has(exp.id) ? "text-red-400 hover:text-red-600" : "text-slate-400 hover:text-slate-600"}>
                    {hiddenItems.has(exp.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" title="Edit"
                    onClick={() => editingId === exp.id ? (setEditingId(null), setEditData(null)) : (setEditingId(exp.id), setEditData({ ...exp }))}
                    className="text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Delete"
                    onClick={() => handleDelete(exp.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {editingId === exp.id && editData && (
                <ExpForm data={editData} onChange={setEditData} onSave={handleSave}
                  onCancel={() => { setEditingId(null); setEditData(null); }} saving={saving} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!experiences || experiences.length === 0) && !addingNew && (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-lg font-medium">No experiences yet</p>
          <p className="text-sm mt-1">Click "Add Experience" to get started</p>
        </div>
      )}
    </div>
  );
}
