import { Building2, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b">
      <div className="mx-auto max-w-screen-md flex items-center gap-3 px-4 py-3">
        <Building2 className="size-5 shrink-0" />
        <Link to="/" className="font-semibold">
          ShareTown // Westminster
        </Link>
        <span className="ml-auto">
          <User className="size-5 opacity-70" />
        </span>
      </div>
    </header>
  );
}
