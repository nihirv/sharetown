import { cn } from "@/lib/utils";

interface Props {
  opt1: number;
  opt2: number;
  className?: string;
  options?: string[]; // Add options prop
}

export default function ProgressBar({
  opt1,
  opt2,
  className,
  options = ["Option 1", "Option 2"],
}: Props) {
  const o1 = Number.isFinite(opt1) && opt1 >= 0 ? opt1 : 0;
  const o2 = Number.isFinite(opt2) && opt2 >= 0 ? opt2 : 0;
  const total = o1 + o2;

  // Format currency values
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;
  const opt1Value = formatCurrency(o1);
  const opt2Value = formatCurrency(o2);

  /* ——  no bets  —— */
  if (total === 0) {
    return (
      <div
        className={cn("rounded-xl bg-white p-4 space-y-2 shadow-sm", className)}
      >
        <div className="flex justify-between text-sm font-medium">
          <span>{options[0]}: £0</span>
          <span>{options[1]}: £0</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden bg-muted" />
      </div>
    );
  }

  /* ——  at least one bet  —— */
  const garbagePct = Math.round((o1 / total) * 100);

  return (
    <div
      className={cn("rounded-xl bg-white p-4 space-y-2 shadow-sm", className)}
    >
      <div className="flex justify-between text-sm font-medium">
        <span>
          {options[0]}: {opt1Value}
        </span>
        <span>
          {options[1]}: {opt2Value}
        </span>
      </div>

      <div className="h-3 w-full rounded-full overflow-hidden bg-muted flex">
        <div
          className="h-full transition-[width] bg-emerald-200"
          style={{ width: `${garbagePct}%` }}
        />
        <div
          className="h-full transition-[width] bg-indigo-200"
          style={{ width: `${100 - garbagePct}%` }}
        />
      </div>
    </div>
  );
}
