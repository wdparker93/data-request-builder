//Produces an option for the table selector
function TableOptionsComponent(props) {
  let optionsValue = props.elementData;
  let optionsAppearance = "Table ";
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

export default TableOptionsComponent;
