import { ArrowBigUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNowStrict } from "date-fns";

export interface CommentType {
  id: string;
  proposal_id: string;
  user_name: string;
  avatar_url?: string | null;
  body: string;
  image_url?: string | null;
  created_at: string;
  num_upvotes: number;
  num_comments: number;
  voted_for: "garbage" | "potholes" | null;
}

interface Props {
  comment: CommentType;
}

export default function CommentCard({ comment }: Props) {
  return (
    <div className="flex gap-3 items-start">
      <Avatar className="size-8 shrink-0">
        {comment.avatar_url ? (
          <AvatarImage src={comment.avatar_url} />
        ) : (
          <AvatarFallback>
            {comment.user_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {comment.user_name}
          </span>
          •
          <span>
            {formatDistanceToNowStrict(new Date(comment.created_at))} ago
          </span>
        </div>
        {comment.image_url && (
          <img
            src={comment.image_url}
            alt=""
            className="w-full rounded-lg object-cover"
          />
        )}

        <p className="text-sm leading-relaxed">{comment.body}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ArrowBigUp className="size-3" />
            {comment.num_upvotes}
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="size-3" />
            {comment.num_comments}
          </div>
        </div>
      </div>
    </div>
  );
}
