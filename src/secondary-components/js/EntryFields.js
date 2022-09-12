//Produces the fields that will contain the data definitions
function EntryFields(props) {
  //Produces an element that will contain a field or table name
  const DataElement = (tableNameElementData) => {
    let data = tableNameElementData.elementData;
    //Fields will be logically set based on whether its a field or table
    let tableNumber = data.charAt(1);
    let fieldNumber = "";
    let elementValue = "";
    let htmlElementName = "table-";
    let htmlLabelValue = "Table ";
    let htmlClassName = "";
    //The entire array value including labeler (T1F1, etc.)
    let indexOfColon = data.indexOf(":");
    if (indexOfColon === 2) {
      //A table element
      elementValue = data.substring(3);
      htmlElementName += tableNumber + "-name";
      htmlLabelValue += tableNumber;
      htmlClassName = "table-element";
    } else if (indexOfColon === 4) {
      //A field element
      fieldNumber = data.charAt(3);
      elementValue = data.substring(5);
      htmlElementName += tableNumber + "field-" + fieldNumber + "-name";
      htmlLabelValue += tableNumber + " Field " + fieldNumber;
      htmlClassName = "field-element";
    }
    return (
      <>
        <form className={htmlClassName}>
          <label htmlFor={htmlElementName}>{htmlLabelValue}: </label>
          <input
            type="text"
            name={htmlElementName}
            id={htmlElementName}
            size="30"
            className="input-field"
            defaultValue={elementValue}
          ></input>
        </form>
      </>
    );
  };

  const convertDictToArray = (tableOrField) => {
    let returnArray = [];
    let counter = 0;
    let dictToConvert = {};
    if (tableOrField === "T") {
      dictToConvert = props.tableNamesParam;
      for (const [key, value] of Object.entries(dictToConvert)) {
        let arrayValue = "T" + key + ":" + value;
        returnArray.splice(counter++, 0, arrayValue);
      }
    } else if (tableOrField === "F") {
      dictToConvert = props.fieldNamesParam;
      for (const [key] of Object.entries(dictToConvert)) {
        let fieldCounter = 1;
        for (const [value] of Object.entries(dictToConvert[key])) {
          let arrayValue =
            "T" + key + "F" + fieldCounter++ + ":" + dictToConvert[key][value];
          returnArray.splice(counter++, 0, arrayValue);
        }
      }
    }
    return returnArray;
  };

  //Convert the dictionaries to arrays, combine them, and sort the entries.
  let tableNameArray = convertDictToArray("T");
  let fieldNameArray = convertDictToArray("F");
  let aggregateArray = tableNameArray.concat(fieldNameArray);
  aggregateArray = aggregateArray.sort();

  const renderOutputDataElements = () => {
    return aggregateArray.map((el) => <DataElement elementData={el} />);
  };

  return (
    <>
      <div id="output-html-wrapper">{renderOutputDataElements()}</div>
    </>
  );
}

export default EntryFields;
