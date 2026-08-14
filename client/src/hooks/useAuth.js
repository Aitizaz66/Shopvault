import { useSelector, useDispatch } from "react-redux";
import { login, register, logoutUser } from "../store/slices/authSlice.js";
import { toast } from "react-hot-toast";

const useAuth = () => {
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth,
  );

  const handleLogin = async (email, password) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      toast.success(`Welcome back, ${result.name}!`);
      return result;
    } catch (error) {
      toast.error(error || "Login failed. Please try again.");
      throw error;
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const result = await dispatch(
        register({ name, email, password }),
      ).unwrap();
      toast.success(`Welcome, ${result.name}!`);
      return result;
    } catch (error) {
      toast.error(error || "Registration failed. Please try again.");
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
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
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

export default useAuth;
