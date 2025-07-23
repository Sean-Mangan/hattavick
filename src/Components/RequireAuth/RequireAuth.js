import React, { useEffect } from "react";

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
import { useRefreshMutation } from "../../features/auth/authApiSlice";

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  const permissions = useSelector(selectCurrentPermissions);
  const location = useLocation();
  const context = useOutletContext();

  // Heartbeat: refresh token every 60 seconds if authenticated
  const [refresh] = useRefreshMutation();
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      refresh();
    }, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, [token, refresh]);

  return (
    <>
      {token && permissions ? (
        <Outlet context={context} />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </>
  );
};

export default RequireAuth;
