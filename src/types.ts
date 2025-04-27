export interface Proposal {
  id: string;
  title: string;
  description: string;
  options: string[]; // e.g. ["Garbage","Potholes"]
  closes_at: string;
  image_url: string[];
  is_closed: boolean;
}

export interface Bet {
  id: string;
  proposal_id: string;
  user_name: string;
  outcome: string;
  stake: number;
}

export interface Comment {
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
