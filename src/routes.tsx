import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Proposal from "@/pages/Proposal";
import Result from "@/pages/Result";
import Admin from "./pages/Admin";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/p/:id", element: <Proposal /> },
  { path: "/p/:id/result", element: <Result /> },
  { path: "/admin", element: <Admin /> },
]);
