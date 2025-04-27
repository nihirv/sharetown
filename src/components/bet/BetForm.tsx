import { useState } from "react";
import StakeInput from "./StakeInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { hasBet } from "@/lib/user";

interface Props {
  outcome: string;
  idx: number;
  onBet: (stake: number) => void;
  proposalId: string;
}

export default function BetForm({ outcome, idx, onBet, proposalId }: Props) {
  const [stake, setStake] = useState(2.5);
  const alreadyBet = hasBet(proposalId);

  function handleSubmit() {
    if (alreadyBet || stake === 0) return;
    onBet(stake);
  }

  const label = "Pool " + outcome;

  return (
    <div className={cn("rounded-xl bg-white py-6 px-4 space-y-2 shadow-sm")}>
      <div className="flex flex-col space-y-6 justify-between text-sm font-medium">
        <StakeInput value={stake} onChange={setStake} />
        <Button
          onClick={handleSubmit}
          disabled={alreadyBet}
          className={cn(
            "w-full text-black",
            idx === 0
              ? "bg-emerald-200 disabled:bg-slate-100 text-gray-500"
              : "bg-indigo-200 disabled:bg-slate-100 text-gray-500"
          )}
        >
          {label}
        </Button>
        {alreadyBet && (
          <p className="text-xs text-muted-foreground text-center">
            You’ve already bet on this proposal.
          </p>
        )}
      </div>
    </div>
  );
}
