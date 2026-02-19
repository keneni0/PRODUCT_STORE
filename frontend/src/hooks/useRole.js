import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

export function useRole() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    async function fetchRole() {
      try {
        const data = await api.getMyRole();
        setRole(data.role);
        setPhoneNumber(data.phoneNumber || null);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch role:", err);
        setError(err.message);
        // Default to customer if fetch fails
        setRole("customer");
        setPhoneNumber(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user, isLoaded]);

  const isSeller = role === "seller";
  const isAdmin = role === "admin";
  const isCustomer = role === "customer" || (!role && user);

  return {
    role,
    phoneNumber,
    loading,
    error,
    isSeller,
    isAdmin,
    isCustomer,
    refreshRole: async () => {
      setLoading(true);
      try {
        const data = await api.getMyRole();
        setRole(data.role);
        setPhoneNumber(data.phoneNumber || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
  };
}
