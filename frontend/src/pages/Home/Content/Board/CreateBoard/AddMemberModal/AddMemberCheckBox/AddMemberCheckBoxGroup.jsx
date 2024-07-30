import AddMemberCheckBoxContext from "./AddMemberCheckBoxContext";

function AddMemberCheckBoxGroup({
  children,
  disabled: groupDisabled,
  values,
  onChange
}) {
  const isDisabled = (disabled) => disabled || groupDisabled;

  const isChecked = (value) => values.includes(value);

  const toggleValue = ({ checked, value }) => {
    if (checked) {
      onChange(values.concat(value));
    } else {
      onChange(values.filter((v) => v !== value));
    }
  };

  return (
    <fieldset>
      <AddMemberCheckBoxContext.Provider value={{ isDisabled, isChecked, toggleValue }}>
        {children}
      </AddMemberCheckBoxContext.Provider>
    </fieldset>
  );
}

export default AddMemberCheckBoxGroup;