import { useParams, Link, useNavigate } from "react-router-dom";
import Container from "@/components/layout/Container";
import ProgressBar from "@/components/ui/ProgressBar";
import BetForm from "@/components/bet/BetForm";
import SparkLine from "@/components/charts/SparkLine";
import { useEffect, useState } from "react";
import OutcomeToggle from "@/components/bet/OutcomeToggle";
import CommentList from "@/components/comments/CommentList";
import { useComments } from "@/hooks/useComments";
import { useBets } from "@/hooks/useBets";
import { useProposal } from "@/hooks/useProposal";

export default function Proposal() {
  const { id } = useParams<{ id: string }>();
  const { data: proposal, isLoading } = useProposal(id);

  const { bets, totalStake, placeBet } = useBets(proposal?.id!);

  // Calculate actual stake amounts for each outcome
  const garbageStake = bets
    .filter((b) => b.outcome === "garbage")
    .reduce((s, b) => s + b.stake, 0);
  const potholesStake = totalStake - garbageStake;

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const { comments, addComment } = useComments(proposal?.id!);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("in useEffect", proposal);
    if (proposal?.id && proposal?.is_closed) {
      navigate(`/p/${proposal.id}/result`, { replace: true });
    }
  }, [proposal?.is_closed, proposal?.id, navigate]);

  const [selected, setSelected] = useState<string>(); // initialise empty

  // set the default once the proposal arrives
  useEffect(() => {
    if (proposal?.options?.length) setSelected(proposal.options[0]);
  }, [proposal?.options]);

  if (!proposal || selected == null) return null; // loading guard

  return (
    <Container className="space-y-6 relative">
      <Link to="/" className="text-sm text-muted-foreground">
        &larr; Back
      </Link>

      <h1 className="text-2xl font-bold">{proposal.title}</h1>
      <OutcomeToggle
        options={proposal.options}
        value={selected}
        onChange={setSelected}
      />

      <ProgressBar opt1={garbageStake} opt2={potholesStake} />

      {/* chart with dotted background */}
      <div className="relative">
        <div className="absolute inset-0 grid rows-5 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border-t border-dashed border-slate-300/50"
            />
          ))}
        </div>
        <SparkLine proposalId={proposal.id!} />
      </div>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Discussion</h2>
        <CommentList comments={comments} outcome={selected} />
      </section>

      <div className="sticky bottom-4">
        <BetForm
          proposalId={proposal.id}
          idx={proposal.options.indexOf(selected)}
          outcome={selected}
          onBet={(stake) => placeBet({ outcome: selected, stake })}
        />
      </div>
    </Container>
  );
}
