import { Link } from "react-router-dom";
import { Proposal } from "@/types";
import { Card } from "@/components/ui/card";
import SparkLine from "@/components/charts/SparkLine";
import { Badge } from "@/components/ui/Badge";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useBets } from "@/hooks/useBets";

interface Props {
  proposal: Proposal;
}

export default function ProposalCard({ proposal }: Props) {
  const daysLeft = Math.max(
    0,
    differenceInDays(new Date(proposal.closes_at), new Date())
  );

  const { bets } = useBets(proposal.id, proposal.options);
  const voteCount = bets.length;

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

        {/* description */}
        {proposal.description && (
          <p className="text-sm text-muted-foreground">
            {proposal.description}
          </p>
        )}

        {/* images (if available) */}
        {proposal.image_url && proposal.image_url.length > 0 && (
          <div className="w-full h-40 overflow-hidden rounded-md grid grid-cols-1 gap-2">
            {proposal.image_url.length === 1 ? (
              <img
                src={proposal.image_url[0]}
                alt={proposal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="grid grid-cols-2 gap-2 h-full">
                {proposal.image_url.slice(0, 4).map((url, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-md h-full"
                  >
                    <img
                      src={url}
                      alt={`${proposal.title} - image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* chart grid BG mimicking mock-up */}
        <div className="relative">
          <div className="absolute inset-0 grid grid-rows-5 grid-cols-1 gap-y-4 pointer-events-none">
            <div className="border-t border-dashed border-muted-foreground/30" />
            <div className="border-t border-dashed border-muted-foreground/30" />
            <div className="border-t border-dashed border-muted-foreground/30" />
            <div className="border-t border-dashed border-muted-foreground/30" />
          </div>
          <SparkLine proposalId={proposal.id} options={proposal.options} />
        </div>

        {/* outcome pills */}
        <div className="space-y-2">
          {proposal.options.map((option, index) => (
            <div
              key={option}
              className={`rounded-md ${
                index === 0
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-indigo-100 text-indigo-900"
              } px-4 py-2 flex items-center gap-2 justify-center font-semibold`}
            >
              {option}
            </div>
          ))}
        </div>

        {/* meta row */}
        <div className="text-sm flex justify-between text-muted-foreground pt-2 border-t">
          <span>Votes: {voteCount}</span>
          <span>Ends in {daysLeft} days</span>
        </div>
      </Card>
    </Link>
  );
}
