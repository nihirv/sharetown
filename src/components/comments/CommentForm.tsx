import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";

export default function CommentForm({
  onSubmit,
}: {
  onSubmit: (body: string) => void;
}) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text.trim());
        setText("");
      }}
      className="space-y-2"
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment…"
        className="min-h-[80px]"
      />
      <Button type="submit" size="sm">
        Post
      </Button>
    </form>
  );
}
