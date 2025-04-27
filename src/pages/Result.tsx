import { useParams, Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft } from "lucide-react";
import { getUserName } from "@/lib/user";
import { useResultData } from "@/hooks/useResultData";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks"; // 1-line size hook
import { cn } from "@/lib/utils";

export default function Result() {
  const { id } = useParams<{ id: string }>();
  const user = getUserName();
  const { my, stats, loading } = useResultData(id, user);
  const { width, height } = useWindowSize();

  if (loading) return <p className="p-8">Loading…</p>;

  const win = Number(my.payout) > 0;
  const totalReturn = Number(my.stake) + Number(my.payout);

  const n = (x: string | number) => Number(x || 0).toFixed(2);

  console.log("my", my, "stats", stats);

  return (
    <div className="min-h-screen flex flex-col">
      {win && width && height ? (
        <Confetti width={width} height={height} numberOfPieces={50} />
      ) : null}

      <Container className="flex-1 flex flex-col items-center justify-center space-y-10 text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold flex justify-center items-center gap-2">
            {win && "🎉"}
            {win ? "You won!" : "Better luck next time"}
          </h1>

          {win ? (
            <p className="text-5xl font-extrabold text-emerald-600">
              £{n(totalReturn)}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">
              Your £{n(my.stake)} stake goes to the winners.
            </p>
          )}
        </div>

        {/* ----- round summary card ----- */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 w-[300px]">
          <h2 className="font-semibold text-lg">Round summary</h2>
          <div className="text-sm space-y-2">
            <p>
              Council received{" "}
              <span className="font-medium">£{n(stats.council_take)}</span>
            </p>

            {stats.options.map((option, index) => (
              <div key={option} className="flex justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    index === 0 ? "bg-emerald-200" : "bg-indigo-200"
                  )}
                >
                  {option}
                </Badge>
                <span>
                  {stats.votes[option] || 0} votes • £
                  {n(stats.volumes[option] || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm underline text-muted-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Proposals
        </Link>
      </Container>
    </div>
  );
}
