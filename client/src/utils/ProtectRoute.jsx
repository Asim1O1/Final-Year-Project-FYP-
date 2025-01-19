import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// function CheckAuth({ role, children }) {
//   const { isAuthenticated, user } = useSelector((state) => state.auth);
//   const location = useLocation();

//   // If the user is not authenticated, redirect to the login page
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} />;
//   }

//   // Redirect system_admin to the admin dashboard if they are not already on it
//   if (role === 'system_admin') {
//     if (user?.role === 'system_admin' && !location.pathname.includes('/admin')) {
//       return <Navigate to="/admin" />;
//     }
//   }

//   // Redirect hospital_admin to the hospital dashboard if they are not already on it
//   if (role === 'hospital_admin') {
//     if (user?.role === 'hospital_admin' && !location.pathname.includes('/hospital')) {
//       return <Navigate to="/hospital" />;
//     }
//   }

//   // Redirect doctor to their respective page if they are not already on it
//   if (role === 'doctor') {
//     if (user?.role === 'doctor' && !location.pathname.includes('/doctor')) {
//       return <Navigate to="/doctor" />;
//     }
//   }

//   // Redirect user to the general user page if they are not already on it
//   if (role === 'user') {
//     if (user?.role === 'user' && !location.pathname.includes('/user')) {
//       return <Navigate to="/user" />;
//     }
//   }

//   // If all checks pass, render the children (the component wrapped by checkAuth)
//   return children;
// }


function CheckAuth({ role, children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If the user is not authenticated and is trying to access a protected page, redirect to login
  if (!isAuthenticated) {
    // Check if the route is a public route (like the home page or hospital page)
    if (
      location.pathname === '/' || // Home page
      location.pathname.startsWith('/hospitals') // Hospital page
     
    ) {
      return children;
    }

 
    return <Navigate to="/login" state={{ from: location }} />;
  }

  
  if (user?.role !== role) {
    switch (user?.role) {
      case 'system_admin':
        return <Navigate to="/admin" />;
      case 'hospital_admin':
        return <Navigate to="/hospital" />;
      // case 'doctor':
      //   return <Navigate to="/doctor" />;
      case 'user':
        return <Navigate to="/" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
}

export default CheckAuth;


