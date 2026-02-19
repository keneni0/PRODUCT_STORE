import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import MerkatoApp from "./MerkatoApp.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UserSync } from "./components/UserSync.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const queryClient = new QueryClient();

const appTree = (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <UserSync />
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