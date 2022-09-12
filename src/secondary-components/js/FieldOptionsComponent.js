//Produces an option for the field selector
function FieldOptionsComponent(props) {
  let optionsValue = "";
  if (props.elementData !== "") {
    optionsValue = parseInt(props.elementData) + 1;
  }
  let optionsAppearance = "Field ";
  if (optionsValue !== "") {
    optionsAppearance += optionsValue;
  } else {
    optionsAppearance = "None";
  }
  return (
    <>
      <option value={optionsValue}>{optionsAppearance}</option>
    </>
  );
}

export default FieldOptionsComponent;
