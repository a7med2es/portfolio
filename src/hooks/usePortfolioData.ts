import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useHero = () => {
  return useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero").select("*").single();
      if (error) throw error;
      return data;
    },
  });
};

export const useExperiences = () => {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useEducation = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase.from("education").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};
