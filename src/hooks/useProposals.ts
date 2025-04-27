// hooks/useProposals.ts
import supabase from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useProposals() {
  return useQuery({
    queryKey: ["proposals"],
    queryFn: async () =>
      supabase
        .from("proposals")
        .select("*")
        .gt("closes_at", new Date().toISOString())
        .order("closes_at", { ascending: true })
        .then((r) => r.data ?? []),
  });
}
