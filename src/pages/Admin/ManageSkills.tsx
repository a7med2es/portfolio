import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSkills } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Edit2, Eye, EyeOff, Loader2, X } from "lucide-react";

const HIDDEN_KEY = "portfolio_hidden_skills";

const emptySkill = {
  category: "", skills_list: [""], icon_name: "Wrench", color: "blue", sort_order: 0,
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
        <Plus className="w-3 h-3 mr-1" /> Add Skill
      </Button>
    </div>
  );
}

function SkillForm({ data, onChange, onSave, onCancel, isNew, saving }: any) {
  return (
    <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Category Name</label>
          <Input value={data.category || ""} onChange={e => onChange({ ...data, category: e.target.value })} placeholder="e.g. Web Technologies" className="text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Icon Name (lucide)</label>
          <Input value={data.icon_name || ""} onChange={e => onChange({ ...data, icon_name: e.target.value })} placeholder="e.g. Globe" className="text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Color Theme</label>
          <select 
            value={data.color || "blue"} 
            onChange={e => onChange({ ...data, color: e.target.value })}
            className="w-full h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
          >
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="orange">Orange</option>
            <option value="red">Red</option>
            <option value="indigo">Indigo</option>
            <option value="amber">Amber</option>
            <option value="slate">Slate</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-600">Skills List</label>
        <ArrayEditor
          value={Array.isArray(data.skills_list) ? data.skills_list : [""]}
          onChange={v => onChange({ ...data, skills_list: v })}
          placeholder="Skill item"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500">Cancel</Button>
        <Button type="button" onClick={() => onSave(data, isNew)} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isNew ? "Add Category" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function ManageSkills() {
  const { data: skills, isLoading, refetch } = useSkills();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState<any>({ ...emptySkill });
  const [saving, setSaving] = useState(false);
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  const toggleHidden = async (id: string, currentlyHidden: boolean) => {
    const newHidden = !currentlyHidden;
    const { error } = await supabase.from("skills").update({ is_hidden: newHidden }).eq("id", id);
    if (error) { toast.error("Failed to update visibility: " + error.message); return; }
    refetch();
  };

  const handleSave = async (data: any, isNew = false) => {
    setSaving(true);
    try {
      if (isNew) {
        const { error } = await supabase.from("skills").insert([{ ...data, sort_order: skills?.length || 0 }]);
        if (error) throw error;
        toast.success("Skill category added!");
        setAddingNew(false);
        setNewData({ ...emptySkill });
      } else {
        const { error } = await supabase.from("skills").update(data).eq("id", data.id);
        if (error) throw error;
        toast.success("Updated successfully!");
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
    if (!confirm("Delete this skill category?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted!"); refetch(); }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-slate-500 py-8 justify-center"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Professional Skills</h1>
          <p className="text-slate-500 text-sm mt-1">Manage skill categories and specific abilities.</p>
        </div>
        <Button onClick={() => { setAddingNew(true); setEditingId(null); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {addingNew && (
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-blue-700 text-lg">New Skill Category</CardTitle></CardHeader>
          <CardContent>
            <SkillForm data={newData} onChange={setNewData} onSave={handleSave} onCancel={() => setAddingNew(false)} isNew saving={saving} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {skills?.map((skill: any) => (
          <Card key={skill.id} className={`border-0 shadow-sm transition-all ${skill.is_hidden ? "opacity-50 bg-red-50/30" : "bg-white"}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-bold text-slate-800">{skill.category}</span>
                    {skill.is_hidden && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full border bg-${skill.color || "blue"}-50 text-${skill.color || "blue"}-600 border-${skill.color || "blue"}-200`}>
                      Theme: {skill.color || "blue"}
                    </span>
                  </div>
                  {Array.isArray(skill.skills_list) && skill.skills_list.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.skills_list.map((s: string, i: number) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => toggleHidden(skill.id, skill.is_hidden)}
                    className={skill.is_hidden ? "text-red-400 hover:text-red-600" : "text-slate-400 hover:text-slate-600"}>
                    {skill.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => editingId === skill.id ? (setEditingId(null), setEditData(null)) : (setEditingId(skill.id), setEditData({ ...skill }))}
                    className="text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(skill.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {editingId === skill.id && editData && (
                <SkillForm data={editData} onChange={setEditData} onSave={handleSave}
                  onCancel={() => { setEditingId(null); setEditData(null); }} saving={saving} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!skills || skills.length === 0) && !addingNew && (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-lg font-medium">No skills yet</p>
          <p className="text-sm mt-1">Click "Add Category" to get started</p>
        </div>
      )}
    </div>
  );
}
