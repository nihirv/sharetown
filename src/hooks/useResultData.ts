// src/hooks/useResultData.ts
import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";

export interface MyResult {
  stake: number;
  payout: number;
}

export interface RoundStats {
  council_take: number;
  votes_g: number;
  vol_g: number;
  votes_p: number;
  vol_p: number;
}

export function useResultData(
  proposalId: string | undefined,
  userName: string
) {
  /* ------------- my stake + payout ------------- */
  const myQuery = useQuery<MyResult>({
    queryKey: ["myResult", proposalId, userName],
    enabled: !!proposalId,
    queryFn: async () => {
      const [{ data: payoutRow }] = await Promise.all([
        supabase
          .from("payouts")
          .select("amount")
          .eq("proposal_id", proposalId)
          .eq("user_name", userName)
          .maybeSingle(),
      ]);

      const { data: stakeRows = [] } = await supabase
        .from("bets")
        .select("stake")
        .eq("proposal_id", proposalId)
        .eq("user_name", userName)
        .limit(1);

      return {
        payout: payoutRow?.amount ?? 0,
        stake: stakeRows[0]?.stake ?? 0,
      };
    },
  });

  /* ------------- round aggregates ------------- */
  const aggQuery = useQuery<RoundStats>({
    queryKey: ["roundStats", proposalId],
    enabled: !!proposalId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("proposal_stats", {
        p_id: proposalId,
      });
      if (error) throw error;
      return (
        data?.[0] ?? {
          council_take: 0,
          votes_g: 0,
          vol_g: 0,
          votes_p: 0,
          vol_p: 0,
        }
      );
    },
  });

  return {
    my: myQuery.data ?? { stake: 0, payout: 0 },
    stats: aggQuery.data ?? {
      council_take: 0,
      votes_g: 0,
      vol_g: 0,
      votes_p: 0,
      vol_p: 0,
    },
    loading: myQuery.isLoading || aggQuery.isLoading,
    error: myQuery.error || aggQuery.error,
  };
}
