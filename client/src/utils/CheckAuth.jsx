import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CheckAuth({ role, children }) {
  const { isAuthenticated, user } = useSelector((state) => state?.auth);

  console.log("CheckAuth called with role:", role); // Debugging log
  console.log("isAuthenticated:", isAuthenticated, "user:", user); // Debugging log

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/unauthorized" />;
  }

  // If authenticated but role does not match
  if (user?.data?.role !== role) {
    console.log(`User role mismatch: Expected ${role}, got ${user?.data?.role}`);
    switch (user?.data?.role) {
      case "system_admin":
        return <Navigate to="/admin" />;
      case "hospital_admin":
        return <Navigate to="/hospital" />;
      case "user":
        return <Navigate to="/" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  // If authenticated and role matches
  return children;
}

export default CheckAuth;
