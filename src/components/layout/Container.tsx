import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "mx-auto max-w-md px-4 pb-16 pt-8", // pt-8 pushes content away from the top
        className
      )}
    >
      {children}
    </div>
  );
}
