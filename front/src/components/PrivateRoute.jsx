import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../api/api";

function PrivateRoute({ allowedRoles = [] }) {
  const token = sessionStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;