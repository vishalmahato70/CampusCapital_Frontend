// frontend/src/components/ProtectedRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Agar user logged in nahi hai, to use login page par bhej dein.
    // Hum `location` state me original path save kar rahe hain taaki login ke baad
    // user wapas usi page par aa sake.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Agar user logged in hai, to use original page (children) dikhayein.
  return children;
};

export default ProtectedRoute;