import { Link } from "react-router-dom";
import { Proposal } from "@/types";
import { Card } from "@/components/ui/card";
import SparkLine from "@/components/charts/SparkLine";
import { Badge } from "@/components/ui/badge";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  proposal: Proposal;
}

export default function ProposalCard({ proposal }: Props) {
  const daysLeft = Math.max(
    0,
    differenceInDays(new Date(proposal.closes_at), new Date())
  );

  return (
    <Link to={`/p/${proposal.id}`}>
      <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
        {/* title + status pill */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-lg">
            {proposal.title}
          </h3>
          <Badge
            className={cn(
              "text-black",
              proposal.is_closed ? "bg-slate-200" : "bg-green-200"
            )}
          >
            {proposal.is_closed ? "Closed" : "Open"}
          </Badge>
        </div>

        {/* chart grid BG mimicking mock-up */}
        <div className="relative">
          <div className="absolute inset-0 grid grid-rows-5 grid-cols-1 gap-y-4 pointer-events-none">
            <div className="border-t border-dashed border-muted-foreground/30" />
            <div className="border-t border-dashed border-muted-foreground/30" />
            <div className="border-t border-dashed border-muted-foreground/30" />
            <div className="border-t border-dashed border-muted-foreground/30" />
          </div>
          <SparkLine proposalId={proposal.id} />
        </div>

        {/* outcome pills (placeholder) */}
        <div className="space-y-2">
          <div className="rounded-md bg-emerald-100 text-emerald-900 px-4 py-2 flex items-center gap-2 justify-center font-semibold">
            {proposal.options[0]}
          </div>
          <div className="rounded-md bg-indigo-100 text-indigo-900 px-4 py-2 flex items-center gap-2 justify-center font-semibold">
            {proposal.options[1]}
          </div>
        </div>

        {/* meta row */}
        <div className="text-sm flex justify-between text-muted-foreground pt-2 border-t">
          <span>Votes: 234</span>
          <span>Ends in {daysLeft} days</span>
        </div>
      </Card>
    </Link>
  );
}
