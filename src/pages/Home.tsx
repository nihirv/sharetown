import { clearUserName, resetBetHistory } from "@/lib/user";
import Header from "@/components/layout/Header";
import Container from "@/components/layout/Container";
import ProposalList from "@/components/proposal/ProposalList";
import supabase from "@/lib/supabase";
import { useProposals } from "@/hooks/useProposals";
import { toast } from "sonner";

export default function Home() {
  const { isLoading } = useProposals();

  function handleReset() {
    clearUserName();
    resetBetHistory();
    window.location.reload();
  }

  return (
    <>
      <Header />
      <Container>
        <h1 className="text-3xl font-extrabold mb-6">Active Proposals</h1>
        <ProposalList />

        <div className="flex flex-col">
          <button
            onClick={handleReset}
            className="mt-10 text-xs underline text-muted-foreground"
          >
            Reset name & bet history
          </button>
        </div>
      </Container>
    </>
  );
}
