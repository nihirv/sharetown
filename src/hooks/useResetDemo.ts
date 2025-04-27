import supabase from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

export function useResetDemo() {
  return useMutation({
    mutationFn: () => supabase.rpc("reset_demo"),
  });
}
