import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// Render Merkato modern marketplace UI
import MerkatoApp from "./MerkatoApp.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

// Create a client
const queryClient = new QueryClient();

const appTree = (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <MerkatoApp />
      </CartProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {appTree}
    </ClerkProvider>
  </StrictMode>
);