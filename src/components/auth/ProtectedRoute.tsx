import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import type { UserRole } from "../../context/AuthContext";

interface Props {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useContext(AuthContext);

  if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
