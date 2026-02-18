import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useRole } from "../hooks/useRole";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { role, loading } = useRole();

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-merkato-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-merkato-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-merkato-cream flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-md text-center max-w-md">
          <h1 className="text-2xl font-bold text-merkato-gray mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Required role: {allowedRoles.join(" or ")}
          </p>
          <a href="/" className="btn-primary inline-block">Go Home</a>
        </div>
      </div>
    );
  }

  return children;
}
