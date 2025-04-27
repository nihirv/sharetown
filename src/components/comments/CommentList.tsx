import CommentCard, { CommentType } from "./CommendCard";

interface Props {
  comments: CommentType[];
  outcome: string;
}

export default function CommentList({ comments, outcome }: Props) {
  if (!comments.length)
    return <p className="text-sm text-muted-foreground">No comments yet</p>;

  const filteredComments = comments.filter(
    (c) => c.voted_for === outcome || c.voted_for === null
  );

  return (
    <div className="space-y-6">
      {filteredComments.map((c) => (
        <CommentCard key={c.id} comment={c} />
      ))}
    </div>
  );
}
