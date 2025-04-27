import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export default function OutcomeToggle({
  options, // string[]
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => onChange(v)}
      className="bg-slate-200 rounded-full p-1 w-full grid grid-cols-2 md:grid-cols-4 text-xs"
      style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}
    >
      {options.map((opt) => (
        <ToggleGroupItem
          key={opt}
          value={opt}
          style={{ borderRadius: "999px" }}
          className={cn(
            "px-3 py-1 text-sm font-medium",
            "data-[state=on]:bg-white data-[state=on]:text-emerald-800",
            "data-[state=off]:text-slate-600"
          )}
        >
          {opt}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
