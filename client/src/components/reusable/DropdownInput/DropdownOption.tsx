import styles from "./DropdownInput.module.scss";

interface IProps {
  label: string;
  onSelectOption: () => void;
}

const DropdownOption = ({ label, onSelectOption }: IProps) => (
  <li>
    <button type="button" className={styles.dropdownOption} onClick={onSelectOption}>
      {label}
    </button>
  </li>
);

export default DropdownOption;
