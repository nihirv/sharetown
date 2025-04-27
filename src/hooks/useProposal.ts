import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase"; // swap later if still on stub
import { Proposal } from "@/types";

/** Fetch a single proposal by its UUID */
export function useProposal(id?: string) {
  return useQuery<Proposal | null>({
    queryKey: ["proposal", id],
    enabled: !!id, // don’t run until we have an id
    queryFn: async () => {
      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", id)
        .single();

      console.log("data", data, "error", error);

      if (error) throw error;
      return data;
    },
  });
}
