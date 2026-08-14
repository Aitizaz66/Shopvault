import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminGuard = () => {
  const { isAuthenticated, isAdmin, isLoading } = useSelector(
    (state) => state.adminAuth,
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminGuard;
