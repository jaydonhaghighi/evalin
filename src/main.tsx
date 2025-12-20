import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getFirebaseApp } from "@/lib/firebase";

// Initialize Firebase early so config errors are obvious in dev.
// This will throw a clear error if VITE_FIREBASE_* env vars are missing.
getFirebaseApp();

createRoot(document.getElementById("root")!).render(<App />);
