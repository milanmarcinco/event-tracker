import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { logOutAll } from "../../services/auth";

import useSelector from "../../hooks/useSelector";
import useDispatch from "../../hooks/useDispatch";
import { refreshTokenSelector } from "../../store/selectors";
import { logOut } from "../../store/authSlice";

import styles from "./UpdateProfilePage.module.scss";

const LogOutAllButton = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const refreshToken = useSelector(refreshTokenSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LogOutAllHandler = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      await logOutAll(refreshToken as string);

      setLoading(false);

      dispatch(logOut());

      setTimeout(() => {
        navigate("/login", { state: { success: "Successfully logged out from all devices" } });
      }, 0);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  }, [refreshToken, dispatch, navigate]);

  return (
    <div className={styles.form}>
      {error && <p className={styles.errorBanner}>{error}</p>}
      <div className={styles.inputGroup}>
        <label>Log out from all devices</label>
        <button onClick={LogOutAllHandler} className={styles.actionBtn} type="submit" disabled={loading}>
          {loading ? "Logging out..." : "Log out everywhere"}
        </button>
      </div>
    </div>
  );
};

export default LogOutAllButton;
