import { isUserLoggedIn } from "@/utils/index";
import { Navigate, Outlet } from "react-router-dom";
import UserLayoutHeader from "@/components/userHeaderLayout";
import { useEffect, lazy, Suspense } from "react";
import { useAppDispatch } from "../store";
import { fetchUserInfo } from "@/store/user";
import { Skeleton } from "antd";

const UserFooterLayout = lazy(() => import("@/components/userFooterLayout"));

const PublicLayoutUser = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, []);

  if (!isUserLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <UserLayoutHeader />
      <Outlet />
      <Suspense fallback={<Skeleton />}>
        <UserFooterLayout />
      </Suspense>
    </>
  );
};

export default PublicLayoutUser;
