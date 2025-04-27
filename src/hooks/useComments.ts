import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/supabase";
import { Comment } from "@/types"; // add Comment type there
import React from "react";

export function useComments(proposalId: string) {
  const qc = useQueryClient();

  /* 1) initial + reactive fetch */
  const { data: comments = [] } = useQuery<Comment[]>({
    queryKey: ["comments", proposalId],
    queryFn: async () =>
      supabase
        .from("comments")
        .select("*")
        .eq("proposal_id", proposalId)
        .order("num_upvotes", { ascending: false })
        .then((r) => (r.data as Comment[]) || []),
  });

  /* 2) realtime INSERT stream */
  React.useEffect(() => {
    const ch = supabase
      .channel("comments-" + proposalId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `proposal_id=eq.${proposalId}`,
        },
        (payload) =>
          qc.setQueryData<Comment[]>(["comments", proposalId], (old) => [
            payload.new as Comment,
            ...(old ?? []),
          ])
      )
      .subscribe();

    return () => {
      ch.unsubscribe();
    };
  }, [proposalId, qc]);

  /* 3) add comment helper */
  const addComment = useMutation({
    mutationFn: (body: string) =>
      supabase.from("comments").insert({
        proposal_id: proposalId,
        user_name: "You",
        body,
        voted_for: null,
      }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["comments", proposalId] }),
  });

  return { comments, addComment: addComment.mutate };
}
