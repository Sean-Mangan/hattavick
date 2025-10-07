import {
  useLocation,
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentPermissions,
  selectCurrentToken,
} from "../../features/auth/authSlice";

/**
 * RequireAuth component
 * Protected route wrapper that requires authentication
 * Redirects to login page if user is not authenticated
 */
const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  const permissions = useSelector(selectCurrentPermissions);
  const location = useLocation();
  const context = useOutletContext();

  return token && permissions ? (
    <Outlet context={context} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
