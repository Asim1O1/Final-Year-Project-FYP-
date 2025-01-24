import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";



function CheckAuth({ role, children }) {
  console.log("The role of the user is", role)
  const { isAuthenticated, user } = useSelector((state) => state?.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    if (
      location.pathname === "/" || // Home page
      location.pathname.startsWith("/hospitals") // Hospital page
    ) {
      return children;
    }

    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (user?.role !== role) {
    switch (user?.role) {
      case "system_admin":
        return <Navigate to="/admin" />;
      case "hospital_admin":
        return <Navigate to="/hospital" />;
      // case 'doctor':
      //   return <Navigate to="/doctor" />;
      case "user":
        return <Navigate to="/" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
}

export default CheckAuth;
