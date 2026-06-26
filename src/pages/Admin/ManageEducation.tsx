import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useEducation } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save, Edit2, Eye, EyeOff, Loader2 } from "lucide-react";

const HIDDEN_KEY = "portfolio_hidden_education";

const emptyEdu = {
  title: "", institution: "", date: "", honors: "",
  is_training: false, course_details: "", certificate_link: "", sort_order: 0,
};

function EduForm({ data, onChange, onSave, onCancel, isNew, saving }: any) {
  return (
    <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200 mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Title / Degree Name</label>
          <Input value={data.title || ""} onChange={e => onChange({ ...data, title: e.target.value })} placeholder="e.g. B.Sc. in Computer Science" className="text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Institution</label>
          <Input value={data.institution || ""} onChange={e => onChange({ ...data, institution: e.target.value })} placeholder="University / Training Center" className="text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Date</label>
          <DateRangePicker value={data.date || ""} onChange={val => onChange({ ...data, date: val })} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Honors / Grade (optional)</label>
          <Input value={data.honors || ""} onChange={e => onChange({ ...data, honors: e.target.value })} placeholder="Graduated Second in Class" className="text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Certificate Link (optional)</label>
          <Input value={data.certificate_link || ""} onChange={e => onChange({ ...data, certificate_link: e.target.value })} placeholder="https://drive.google.com/..." className="text-sm" />
        </div>
        <div className="space-y-1 flex flex-col justify-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.is_training || false}
              onChange={e => onChange({ ...data, is_training: e.target.checked })}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-sm font-medium text-slate-700">This is a Training / Course</span>
          </label>
        </div>
      </div>
      {data.is_training && (
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">Course Details</label>
          <Textarea value={data.course_details || ""} onChange={e => onChange({ ...data, course_details: e.target.value })}
            className="min-h-[80px] text-sm resize-none" placeholder="Topics covered, tools used..." />
        </div>
      )}
      <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-slate-500">Cancel</Button>
        <Button type="button" onClick={() => onSave(data, isNew)} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {isNew ? "Add Entry" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

export default function ManageEducation() {
  const { data: education, isLoading, refetch } = useEducation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newData, setNewData] = useState<any>({ ...emptyEdu });
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
        const { error } = await supabase.from("education").insert([{ ...data, sort_order: education?.length || 0 }]);
        if (error) throw error;
        toast.success("Education entry added!");
        setAddingNew(false);
        setNewData({ ...emptyEdu });
      } else {
        const { error } = await supabase.from("education").update(data).eq("id", data.id);
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
    if (!confirm("Delete this entry?")) return;
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted!"); refetch(); }
  };

  if (isLoading) return <div className="flex items-center gap-2 text-slate-500 py-8 justify-center"><Loader2 className="animate-spin" /> Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Education & Training</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your degrees, courses, and certifications.</p>
        </div>
        <Button onClick={() => { setAddingNew(true); setEditingId(null); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Entry
        </Button>
      </div>

      {addingNew && (
        <Card className="border-blue-200 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-blue-700 text-lg">New Education / Training</CardTitle></CardHeader>
          <CardContent>
            <EduForm data={newData} onChange={setNewData} onSave={handleSave} onCancel={() => setAddingNew(false)} isNew saving={saving} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {education?.map((edu: any) => (
          <Card key={edu.id} className={`border-0 shadow-sm transition-all ${hiddenItems.has(edu.id) ? "opacity-50 bg-red-50/30" : "bg-white"}`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-slate-800">{edu.title}</span>
                    {edu.is_training && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Training</span>}
                    {hiddenItems.has(edu.id) && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium">Hidden</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{edu.institution} {edu.date && `· ${edu.date}`}</p>
                  {edu.honors && <p className="text-xs text-green-600 font-medium mt-0.5">{edu.honors}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" title={hiddenItems.has(edu.id) ? "Show" : "Hide"}
                    onClick={() => toggleHidden(edu.id)}
                    className={hiddenItems.has(edu.id) ? "text-red-400 hover:text-red-600" : "text-slate-400 hover:text-slate-600"}>
                    {hiddenItems.has(edu.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => editingId === edu.id ? (setEditingId(null), setEditData(null)) : (setEditingId(edu.id), setEditData({ ...edu }))}
                    className="text-blue-500 hover:text-blue-700">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(edu.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {editingId === edu.id && editData && (
                <EduForm data={editData} onChange={setEditData} onSave={handleSave}
                  onCancel={() => { setEditingId(null); setEditData(null); }} saving={saving} />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!education || education.length === 0) && !addingNew && (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-lg font-medium">No education entries yet</p>
          <p className="text-sm mt-1">Click "Add Entry" to get started</p>
        </div>
      )}
    </div>
  );
}
