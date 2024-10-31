import "./index.css";

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./routes";

const router = createBrowserRouter(Routes);
const portal = document.getElementById("root")!;

createRoot(portal).render(<RouterProvider router={router} />);
