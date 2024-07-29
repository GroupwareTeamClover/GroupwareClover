import { useContext } from "react";
import AddMemberCheckboxContext from "./AddMemberCheckBoxContext";
import styles from "./AddMemberCheckBox.module.css";

function AddMemberCheckBox({ children, disabled, value, checked, onChange }) {
  const context = useContext(AddMemberCheckboxContext);

  if (!context) {
    return (
      <label>
        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={({ target: { checked } }) => onChange(checked)}
        />
        {children}
      </label>
    );
  }

  const { isDisabled, isChecked, toggleValue } = context;

  return (
    <div className={styles.eachMember}>
      <label>
        <input
          type="checkbox"
          disabled={isDisabled(disabled)}
          checked={isChecked(value)}
          onChange={({ target: { checked } }) => toggleValue({ checked, value })}
        />
        {children}
      </label>
    </div>
  );
}

export default AddMemberCheckBox;