import supabase from "@/lib/supabase";
import { toast } from "sonner";

export default function Admin() {
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
    <div className="min-h-screen flex flex-col">
      <button
        onClick={handleClose}
        className="mt-10 text-xs underline text-muted-foreground"
      >
        Close Proposal (demo)
      </button>
      <button
        onClick={handleResetDatabase}
        className="text-xs underline text-muted-foreground"
      >
        Reset Database
      </button>
    </div>
  );
}
