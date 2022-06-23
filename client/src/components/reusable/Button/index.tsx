import cx from "classnames";

import styles from "./Button.module.scss";

interface IProps {
  title: string;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: (() => void) | undefined;
}

const Button = ({ title, type = "button", variant = "primary", icon, className, disabled, onClick }: IProps) => (
  <button
    onClick={onClick}
    type={type}
    className={cx(styles.button, styles[variant], className, {
      [styles.buttonWithIcon]: !!icon,
    })}
    disabled={disabled}
  >
    {icon ? icon : null}
    {<span className={styles.buttonTitle}>{title}</span>}
  </button>
);

export default Button;
