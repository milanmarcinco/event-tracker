import React, { useState } from "react";

import useClickOutside from "../../../hooks/useClickOutside";

import DropdownOption from "./DropdownOption";
import { ReactComponent as ChevronDown } from "../../../assets/chevron-down.svg";

import styles from "./DropdownInput.module.scss";

type IProps = {
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  selectedOption: any;
  onChange: (value: any) => void;
  ref: React.Ref<any>;
  disabled?: boolean;
};

const DropdownInput = React.forwardRef(
  ({ placeholder, options, selectedOption, onChange, disabled }: IProps, ref: React.Ref<HTMLButtonElement>) => {
    const [showOptions, setShowOptions] = useState(false);

    const wrapperRef = useClickOutside<HTMLDivElement>(() => setShowOptions(false));

    const handleSelect = (option: any) => {
      onChange(option);
      setShowOptions(false);
    };

    return (
      <div ref={wrapperRef} className={styles.dropdownWrapper}>
        <button
          onClick={() => setShowOptions((prevState) => !prevState)}
          ref={ref}
          className={styles.dropdownBtn}
          style={{
            color: selectedOption ? "var(--gray-700)" : "var(--gray-400)",
          }}
          type="button"
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown />
        </button>

        {showOptions && (
          <div className={styles.dropdownOptions}>
            <ul>
              {options.map((option) => (
                <DropdownOption
                  key={option.value}
                  label={option.label}
                  onSelectOption={handleSelect.bind(null, option)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

export default DropdownInput;
