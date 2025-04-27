import { subDays, subHours } from "date-fns";
import { v4 as uuid } from "uuid";

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

/* —— seed array —— */
export const COMMENTS: Comment[] = [
  {
    id: uuid(),
    proposal_id: "1",
    user_name: "Alice",
    avatar_url: "https://i.pravatar.cc/40?img=10",
    body: "Our flat on Alpine Street!! This clearly isn’t the safe and homely community I expected 😠",
    image_url: "https://rockinst.org/wp-content/uploads/2019/09/Garbage.jpg",
    created_at: subDays(new Date(), 7).toISOString(),
    num_upvotes: 17,
    num_comments: 17,
    voted_for: "garbage",
  },
  {
    id: uuid(),
    proposal_id: "1",
    user_name: "Ben",
    avatar_url: "https://i.pravatar.cc/40?img=35",
    body: "Rats everywhere because bins overflow at weekends. Weekly pickup is overdue.",
    image_url:
      "https://news.ucr.edu/sites/default/files/styles/news_article_featured_l/public/2022-02/2160px-Littering_in_Stockholm.jpg?h=60a9e832&itok=cTQpDLl8",
    created_at: subHours(new Date(), 36).toISOString(),
    num_upvotes: 9,
    num_comments: 17,
    voted_for: "garbage",
  },
  {
    id: uuid(),
    proposal_id: "1",
    user_name: "Cara",
    avatar_url: "https://i.pravatar.cc/40?img=45",
    body: "Anyone else having their MOT fail because of their suspension???",
    image_url:
      "https://s.yimg.com/ny/api/res/1.2/_v1s16gz65xESAWCnToOpg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA-/https://s.yimg.com/os/creatr-uploaded-images/2023-04/d90c78e0-dd0d-11ed-b178-976c865e81a0",
    created_at: subHours(new Date(), 12).toISOString(),
    num_upvotes: 3,
    num_comments: 17,
    voted_for: "potholes",
  },
];
