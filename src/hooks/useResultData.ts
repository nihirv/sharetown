// src/hooks/useResultData.ts
import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";

export interface MyResult {
  stake: number;
  payout: number;
}

export interface RoundStats {
  council_take: number;
  votes: Record<string, number>;
  volumes: Record<string, number>;
  options: string[];
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
        stake: stakeRows?.[0]?.stake ?? 0,
      };
    },
  });

  /* ------------- round aggregates ------------- */
  const aggQuery = useQuery<RoundStats>({
    queryKey: ["roundStats", proposalId],
    enabled: !!proposalId,
    queryFn: async () => {
      // First get the proposal to get the options
      const { data: proposal } = await supabase
        .from("proposals")
        .select("options")
        .eq("id", proposalId)
        .single();

      const options = proposal?.options || [];

      // Fetch all bets for this proposal
      const { data: bets = [] } = await supabase
        .from("bets")
        .select("outcome, stake")
        .eq("proposal_id", proposalId);

      // Get council take from the stats function (or calculate if needed)
      const { data: statsData, error } = await supabase.rpc("proposal_stats", {
        p_id: proposalId,
      });

      if (error) throw error;

      // Initialize empty stats with the options
      const stats = {
        council_take: statsData?.[0]?.council_take || 0,
        votes: {} as Record<string, number>,
        volumes: {} as Record<string, number>,
        options: options,
      };

      // Calculate votes and volumes from bets data
      options.forEach((option: string) => {
        // Count votes (number of bets for this option)
        stats.votes[option] = bets!.filter(
          (bet) => bet.outcome === option
        ).length;

        // Sum volumes (total stake for this option)
        stats.volumes[option] = bets!
          .filter((bet) => bet.outcome === option)
          .reduce((sum, bet) => sum + (bet.stake || 0), 0);
      });

      return stats;
    },
  });

  return {
    my: myQuery.data ?? { stake: 0, payout: 0 },
    stats: aggQuery.data ?? {
      council_take: 0,
      votes: {},
      volumes: {},
      options: [],
    },
    loading: myQuery.isLoading || aggQuery.isLoading,
    error: myQuery.error || aggQuery.error,
  };
}
