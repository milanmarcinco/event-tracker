import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import useClickOutside from "../../../hooks/useClickOutside";

import styles from "./Navbar.module.scss";

interface IProps {
  children: React.ReactNode;
}

const DropdownMenu = ({ children }: IProps) => {
  const location = useLocation();

  const [dropdownShown, setDropdownShown] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setDropdownShown(false);
  });

  useEffect(() => {
    setDropdownShown(false);
  }, [location.pathname]);

  return (
    <div ref={dropdownRef} className={styles.navItemDropdownWrapper}>
      <button onClick={() => setDropdownShown((isOpen) => !isOpen)} className={styles.navItem} type="button">
        Profile
      </button>

      {dropdownShown && (
        <div className={styles.dropdownItemsWrapper}>
          <ul>{children}</ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
