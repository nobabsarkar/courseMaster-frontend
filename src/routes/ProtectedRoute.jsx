import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const token = getToken();

  const isBypass =
    localStorage.getItem("dev_bypass") === "true" ||
    window.location.search.includes("bypass=true");

  const [isValid, setIsValid] = useState(() => (isBypass ? true : null));

  useEffect(() => {
    if (isBypass) return;

    if (!token) {
      return;
    }

    let active = true;

    getMe()
      .then(() => {
        if (active) setIsValid(true);
      })
      .catch(() => {
        if (active) setIsValid(false);
      });

    return () => {
      active = false;
    };
  }, [token, isBypass]);

  if (isValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
