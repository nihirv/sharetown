import { useEffect, useState } from "react";
import supabase from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { getUserName, recordBet } from "@/lib/user";

export interface Bet {
  id: string;
  proposal_id: string;
  user_name: string;
  outcome: string;
  stake: number;
}

/**
 * Live bets for a single proposal.
 * Returns an array + simple helpers (totals, percentages).
 */
export function useBets(proposalId: string) {
  const [bets, setBets] = useState<Bet[]>([]);

  // 1️⃣  initial fetch
  useEffect(() => {
    let ignore = false;
    supabase
      .from("bets")
      .select("*")
      .eq("proposal_id", proposalId)
      .then(({ data }) => {
        if (!ignore && data) setBets(data as Bet[]);
      });
    return () => {
      ignore = true;
    };
  }, [proposalId]);

  // 2️⃣  realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("bets-watch")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          table: "bets",
          schema: "public",
          filter: `proposal_id=eq.${proposalId}`,
        },
        (payload) => {
          setBets((prev) => [payload.new as Bet, ...prev]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [proposalId]);

  const garbageStake = bets
    .filter((b) => b.outcome === "garbage")
    .reduce((s, b) => s + b.stake, 0);

  const totalStake = bets.reduce((s, b) => s + b.stake, 0);

  const pctGarbage = totalStake ? garbageStake / totalStake : 0;
  const pctPotholes = totalStake ? 1 - pctGarbage : 0;

  const placeBet = useMutation({
    mutationFn: async (payload: { outcome: string; stake: number }) => {
      const { data, error } = await supabase
        .from("bets")
        .insert({
          proposal_id: proposalId,
          user_name: getUserName(),
          outcome: payload.outcome,
          stake: payload.stake,
        })
        .select()
        .single(); // ← returns the inserted row
      if (error) throw error;
      return data as Bet;
    },
    onSuccess: (newRow) => {
      setBets((prev) => [newRow, ...prev]); // instant UI update
      recordBet(proposalId); // ← lock future bets
    },
  });

  return {
    bets,
    pctGarbage,
    pctPotholes,
    totalStake,
    placeBet: placeBet.mutate,
  };
}
