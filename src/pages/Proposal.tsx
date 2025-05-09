/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
  const { data: proposal } = useProposal(id);

  const { stakesByOutcome, placeBet } = useBets(
    proposal?.id!,
    proposal?.options
  );

  const { comments } = useComments(proposal?.id!);

  const navigate = useNavigate();

  useEffect(() => {
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

      <ProgressBar
        opt1={stakesByOutcome?.[proposal.options[0]] || 0}
        opt2={stakesByOutcome?.[proposal.options[1]] || 0}
        options={proposal.options}
      />

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
        <SparkLine proposalId={proposal.id!} options={proposal.options} />
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
