import { useState, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { logOut as logOutService } from "../../../services/auth";

import useSelector from "../../../hooks/useSelector";
import useDispatch from "../../../hooks/useDispatch";
import { refreshTokenSelector } from "../../../store/selectors";
import { logOut } from "../../../store/authSlice";

import styles from "./Navbar.module.scss";
import DropdownMenu from "./DropdownMenu";

const Navbar = () => {
  const refreshToken = useSelector(refreshTokenSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logOutLoading, setLogOutLoading] = useState(false);

  const logOutHandler = useCallback(
    async (e: any) => {
      try {
        e.target.style.minWidth = e.target.offsetWidth + "px";
        setLogOutLoading(true);

        await logOutService(refreshToken as string);

        setLogOutLoading(false);

        dispatch(logOut());
        setTimeout(() => {
          navigate("/login", { state: { success: "Successfully logged out" } });
        }, 0);
      } catch (err) {
        setLogOutLoading(false);
      }
    },
    [refreshToken, dispatch, navigate]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.navbar}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink to="/" className={styles.navItem}>
                Home
              </NavLink>
            </li>
          </ul>
        </nav>

        <DropdownMenu>
          <li>
            <Link to="/profile-settings" className={styles.dropdownItem}>
              Profile settings
            </Link>
          </li>

          <li>
            <Link to="/change-password" className={styles.dropdownItem}>
              Change password
            </Link>
          </li>

          <li>
            <button className={styles.dropdownItem} type="button" onClick={logOutHandler} disabled={logOutLoading}>
              {logOutLoading ? "Loading..." : "Log out"}
            </button>
          </li>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
