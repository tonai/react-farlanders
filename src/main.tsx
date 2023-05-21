import { createRoot } from "react-dom/client";

import App from "./components/App/App.tsx";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
