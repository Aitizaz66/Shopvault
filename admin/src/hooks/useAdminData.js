import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../store/slices/adminStatsSlice.js";

const useAdminData = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.adminStats);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch, refresh]);

  const refetch = () => {
    setRefresh((prev) => !prev);
  };

  return {
    stats,
    isLoading,
    refetch,
  };
};

export default useAdminData;
