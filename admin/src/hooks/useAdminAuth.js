import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/slices/adminAuthSlice.js";
import { toast } from "react-hot-toast";

const useAdminAuth = () => {
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated, isAdmin, isLoading, error } = useSelector(
    (state) => state.adminAuth,
  );

  const handleLogin = async (email, password) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      toast.success(`Welcome Admin, ${result.name}!`);
      return result;
    } catch (error) {
      toast.error(error || "Login failed. Please try again.");
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      return true;
    } catch (error) {
      toast.error(error || "Logout failed. Please try again.");
      throw error;
    }
  };

  return {
    userInfo,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAdminAuth;
