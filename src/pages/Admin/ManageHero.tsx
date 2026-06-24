import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useHero } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function ManageHero() {
  const { data: hero, isLoading, refetch } = useHero();
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setFormData(hero);
    }
  }, [hero]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // We update the existing record based on its ID
    const { error } = await supabase
      .from("hero")
      .update(formData)
      .eq("id", formData.id);

    if (error) {
      toast.error("Failed to update: " + error.message);
    } else {
      toast.success("Hero section updated successfully!");
      refetch();
    }
    setSaving(false);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="max-w-3xl border-0 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input name="title" value={formData.title || ""} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone" value={formData.phone || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input name="email" value={formData.email || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input name="location" value={formData.location || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume Link (URL)</label>
              <Input name="resume_url" value={formData.resume_url || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Avatar Image (URL)</label>
              <Input name="avatar_url" value={formData.avatar_url || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Summary Statement</label>
              <Textarea 
                name="summary" 
                value={formData.summary || ""} 
                onChange={handleChange} 
                className="min-h-[100px]" 
                required 
              />
            </div>
          </div>
          
          <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
            {saving ? "Saving..." : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
