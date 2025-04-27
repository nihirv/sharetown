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
  async function handleClose() {
    const { error } = await supabase.rpc("close_proposal", {
      p_id: "880af0fe-b6ef-463b-9cfe-c64f689001de",
    });
    toast(error ? error.message : "Proposal closed");
  }

  async function handleResetDatabase() {
    if (confirm("Reset the demo database?")) {
      const { data, error } = await supabase.rpc("reset_demo"); // ← capture both
      console.log({ data, error });
      if (error) {
        toast("Reset failed", {
          description: error.message,
        });
      } else {
        window.location.reload();
      }
    }
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
          <button
            onClick={handleClose}
            className="mt-10 text-xs underline text-muted-foreground"
          >
            Close Proposal (demo)
          </button>
          <button
            onClick={handleResetDatabase}
            disabled={isLoading}
            className="text-xs underline text-muted-foreground"
          >
            Reset Database
          </button>
        </div>
      </Container>
    </>
  );
}
