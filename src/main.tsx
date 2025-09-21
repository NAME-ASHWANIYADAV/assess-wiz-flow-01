import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";

// Disable any potential popup sources
if (typeof window !== 'undefined') {
  // Override alert, confirm, prompt to prevent popups
  window.alert = () => {};
  window.confirm = () => true;
  window.prompt = () => null;
  
  // Disable notifications
  if ('Notification' in window) {
    Object.defineProperty(Notification, 'permission', {
      value: 'denied',
      writable: false
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
