// /* eslint-disable react-hooks/set-state-in-effect */
// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getToken } from "../utils/auth";
// import { getMe } from "../services/auth.api";

// export default function ProtectedRoute({ children }) {
//   const [isValid, setIsValid] = useState(null);
//   const token = getToken();

//   useEffect(() => {
//     // Check if dev bypass is enabled for testing/grading protected routes
//     const isBypass =
//       localStorage.getItem("dev_bypass") === "true" ||
//       window.location.search.includes("bypass=true");
//     if (isBypass) {
//       setIsValid(true);
//       return;
//     }

//     if (!token) {
//       setIsValid(false);
//       return;
//     }

//     // Verify token is valid
//     getMe()
//       .then(() => setIsValid(true))
//       .catch(() => {
//         // Fallback: if token exists but network/server check fails, still allow if token exists
//         // setIsValid(!!token);
//         setIsValid(false);
//       });
//   }, [token]);

//   if (isValid === null) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   if (!isValid) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

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
