import { useEffect, memo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/ui/Navbar";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UpdateProfilePage from "./pages/ProfileSettingsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

import useSelector from "./hooks/useSelector";
import useDispatch from "./hooks/useDispatch";
import { authInit } from "./store/authSlice";
import { initLoadingSelector, isLoggedInSelector } from "./store/selectors";

function App() {
  const initLoading = useSelector(initLoadingSelector);
  const isLoggedIn = useSelector(isLoggedInSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authInit());
  }, [dispatch]);

  if (initLoading) return <p>loading...</p>;

  return (
    <>
      {isLoggedIn && <Navbar />}

      <Routes>
        {isLoggedIn && (
          <>
            <Route index element={<DashboardPage />} />
            <Route path="/profile-settings" element={<UpdateProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </>
        )}

        {!isLoggedIn && (
          <>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </>
        )}

        <Route path="*" element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default memo(App);
