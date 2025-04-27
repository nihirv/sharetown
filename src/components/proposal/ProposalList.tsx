import { useProposals } from "@/hooks/useProposals";
import ProposalCard from "./ProposalCard";

export default function ProposalList() {
  const { data = [], isLoading } = useProposals();

  if (isLoading) return <p className="p-4">Loading…</p>;
  if (!data.length) return <p className="p-4">No proposals yet</p>;

  return (
    <div className="flex flex-col gap-4">
      {data.map((p) => (
        <ProposalCard key={p.id} proposal={p} />
      ))}
    </div>
  );
}
