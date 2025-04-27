import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function StakeInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const step = 0.5;
  const clamp = (v: number) => Math.min(5, Math.max(0, v));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 hover:bg-slate-200"
          onClick={() => onChange(clamp(value - step))}
        >
          <Minus className="size-4" />
        </Button>

        <span className="text-2xl font-semibold">£{value.toFixed(2)}</span>

        <Button
          variant="ghost"
          size="icon"
          className="bg-slate-100 hover:bg-slate-200"
          onClick={() => onChange(clamp(value + step))}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Maximum £5 pool
      </p>
    </div>
  );
}
