import React from "react";
import cx from "classnames";

import styles from "./Input.module.scss";

interface IProps {
  type?: "text";
  name: string;
  placeholder?: string;
  autocomplete?: "on" | "off";
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, IProps>(
  ({ type = "text", autocomplete = "off", className, ...props }, ref) => (
    <input ref={ref} {...props} id={props.name} autoComplete={autocomplete} className={cx(styles.input, className)} />
  )
);

export default Input;
