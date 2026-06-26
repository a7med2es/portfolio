import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useHero } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Eye, EyeOff, ImagePlus, Loader2 } from "lucide-react";

const HIDDEN_FIELDS_KEY = "portfolio_hero_hidden_fields";

const FieldWrapper = ({ name, label, isHidden, onToggle, children }: { name: string; label: string; isHidden: boolean; onToggle: () => void; children: React.ReactNode }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`text-sm font-semibold ${isHidden ? "text-slate-400 line-through" : "text-slate-700"}`}>
          {label}
        </label>
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
            isHidden
              ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200"
          }`}
        >
          {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {isHidden ? "Hidden" : "Visible"}
        </button>
      </div>
      <div className={isHidden ? "opacity-40 pointer-events-none select-none" : ""}>
        {children}
      </div>
    </div>
  );
};


export default function ManageHero() {
  const { data: hero, isLoading, refetch } = useHero();
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(HIDDEN_FIELDS_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [dragActiveResume, setDragActiveResume] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    if (hero) {
      setFormData(hero);
      setImagePreview(hero.avatar_url || "");
    }
  }, [hero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleHidden = (fieldName: string) => {
    setHiddenFields(prev => {
      const next = new Set(prev);
      if (next.has(fieldName)) next.delete(fieldName);
      else next.add(fieldName);
      localStorage.setItem(HIDDEN_FIELDS_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please use an image file (PNG, JPG, etc.)");
      return;
    }
    setUploadingImage(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const filename = `avatar-${Date.now()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('portfolio_files')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio_files')
        .getPublicUrl(filename);

      setFormData((prev: any) => ({ ...prev, avatar_url: publicUrl }));
      setImagePreview(URL.createObjectURL(file));
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadImage(file);
  }, []);

  const uploadResume = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Please use a PDF file for your resume");
      return;
    }
    setUploadingResume(true);
    try {
      const filename = `resume-${Date.now()}.pdf`;
      
      const { data, error } = await supabase.storage
        .from('portfolio_files')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio_files')
        .getPublicUrl(filename);

      setFormData((prev: any) => ({ ...prev, resume_url: publicUrl }));
      toast.success("Resume uploaded successfully!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleDropResume = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActiveResume(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadResume(file);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Clean up payload by removing fields that might not exist in Supabase schema
    const { website, ...payload } = formData;
    
    let error = null;
    if (payload.id) {
      const { error: err } = await supabase.from("hero").update(payload).eq("id", payload.id);
      error = err;
    } else {
      const { error: err } = await supabase.from("hero").insert([payload]);
      error = err;
    }
    
    if (error) toast.error("Failed to update: " + error.message);
    else { toast.success("Hero section updated!"); refetch(); }
    setSaving(false);
  };


  if (isLoading) return (
    <div className="flex items-center gap-3 text-slate-500 py-12 justify-center">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading hero data...
    </div>
  );

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-2xl font-bold text-slate-800">Manage Hero Section</CardTitle>
        <p className="text-slate-500 text-sm mt-1">
          Toggle the <span className="font-semibold text-blue-600">Visible / Hidden</span> button on any field to show or hide it from your portfolio.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-semibold ${hiddenFields.has("avatar_url") ? "text-slate-400 line-through" : "text-slate-700"}`}>
                Profile Image
              </label>
              <button
                type="button"
                onClick={() => toggleHidden("avatar_url")}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                  hiddenFields.has("avatar_url")
                    ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200"
                }`}
              >
                {hiddenFields.has("avatar_url") ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {hiddenFields.has("avatar_url") ? "Hidden" : "Visible"}
              </button>
            </div>

            <div className={`flex gap-4 items-start ${hiddenFields.has("avatar_url") ? "opacity-40 pointer-events-none" : ""}`}>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onClick={() => document.getElementById("avatar-file-input")?.click()}
                className={`flex-1 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
                  dragActive
                    ? "border-blue-400 bg-blue-50 scale-[1.01]"
                    : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }}
                />
                {uploadingImage ? (
                  <div className="flex flex-col items-center gap-2 text-blue-500">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="font-medium">Uploading image...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImagePlus className={`w-10 h-10 ${dragActive ? "text-blue-400" : "text-slate-400"}`} />
                    <p className="text-slate-600 font-semibold">Drag & Drop image here</p>
                    <p className="text-slate-400 text-sm">or click to browse files</p>
                    <p className="text-slate-300 text-xs">PNG, JPG, WEBP supported</p>
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-top" />
                  </div>
                  <span className="text-xs text-slate-400">Current Image</span>
                </div>
              )}
            </div>


          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldWrapper name="name" label="Full Name" isHidden={hiddenFields.has("name")} onToggle={() => toggleHidden("name")}>
              <Input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Your full name" />
            </FieldWrapper>

            <FieldWrapper name="title" label="Job Title / Role" isHidden={hiddenFields.has("title")} onToggle={() => toggleHidden("title")}>
              <Input name="title" value={formData.title || ""} onChange={handleChange} placeholder="e.g. Software Engineer" />
            </FieldWrapper>

            <FieldWrapper name="phone" label="Phone Number" isHidden={hiddenFields.has("phone")} onToggle={() => toggleHidden("phone")}>
              <Input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="+964 77x xxx xxxx" />
            </FieldWrapper>

            <FieldWrapper name="email" label="Email Address" isHidden={hiddenFields.has("email")} onToggle={() => toggleHidden("email")}>
              <Input name="email" value={formData.email || ""} onChange={handleChange} placeholder="you@example.com" />
            </FieldWrapper>

            <FieldWrapper name="location" label="Location" isHidden={hiddenFields.has("location")} onToggle={() => toggleHidden("location")}>
              <Input name="location" value={formData.location || ""} onChange={handleChange} placeholder="City, Country" />
            </FieldWrapper>

            <FieldWrapper name="website" label="Website URL" isHidden={hiddenFields.has("website")} onToggle={() => toggleHidden("website")}>
              <Input name="website" value={formData.website || ""} onChange={handleChange} placeholder="ahmedes.netlify.app" />
            </FieldWrapper>

            <FieldWrapper name="resume_url" label="Resume File (PDF)" isHidden={hiddenFields.has("resume_url")} onToggle={() => toggleHidden("resume_url")}>
              <div className="space-y-3">
                <div
                  onDrop={handleDropResume}
                  onDragOver={(e) => { e.preventDefault(); setDragActiveResume(true); }}
                  onDragLeave={() => setDragActiveResume(false)}
                  onClick={() => document.getElementById("resume-file-input")?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all select-none ${
                    dragActiveResume
                      ? "border-blue-400 bg-blue-50 scale-[1.01]"
                      : "border-slate-300 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadResume(f); }}
                  />
                  {uploadingResume ? (
                    <div className="flex flex-col items-center gap-2 text-blue-500">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <p className="font-medium text-sm">Uploading resume...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <div className={`p-3 rounded-full mb-1 ${dragActiveResume ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
                      </div>
                      <p className="text-slate-700 font-semibold text-sm">Drag & Drop PDF here</p>
                      <p className="text-slate-400 text-xs">or click to browse</p>
                    </div>
                  )}
                </div>
              </div>
            </FieldWrapper>
          </div>

          <FieldWrapper name="summary" label="Professional Summary" isHidden={hiddenFields.has("summary")} onToggle={() => toggleHidden("summary")}>
            <Textarea
              name="summary"
              value={formData.summary || ""}
              onChange={handleChange}
              className="min-h-[130px] resize-none"
              placeholder="Write a brief professional summary about yourself..."
            />
          </FieldWrapper>

          <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold">
            {saving
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving changes...</>
              : <><Save className="w-4 h-4 mr-2" />Save All Changes</>
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
