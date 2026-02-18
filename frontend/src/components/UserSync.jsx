import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../utils/api";

export function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function syncUser() {
      try {
        await api.syncUser({
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.firstName || "User",
          imageUrl: user.imageUrl || "",
        });
      } catch (error) {
        console.error("Failed to sync user:", error);
      }
    }

    syncUser();
  }, [user, isLoaded]);

  return null;
}
