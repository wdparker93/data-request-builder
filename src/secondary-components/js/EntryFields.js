//Produces the fields that will contain the data definitions
function EntryFields(props) {
  //Produces an element that will contain a field or table name
  const DataElement = (tableNameElementData) => {
    //The entire array value including labeler (T1F1:VALUE, etc.)
    let data = tableNameElementData.elementData;
    console.log(data);
    //Fields will be logically set based on whether it's a field or table
    let tableNumber = "";
    let indexOfColon = data.indexOf(":");
    //The field's value
    let elementValue = data.substring(indexOfColon + 1);
    //The field's identifier (T1, T1F1, etc.)
    let identifier = data.substring(0, indexOfColon);
    let fieldNumber = "";
    let htmlElementName = "table-";
    let htmlLabelValue = "Table ";
    let htmlClassName = "";

    if (!identifier.includes("F")) {
      //A table element with identifier TXX:VALUE
      tableNumber = data.substring(1, indexOfColon);
      htmlElementName += tableNumber + "-name";
      htmlLabelValue += tableNumber;
      htmlClassName = "table-element";
    } else if (identifier.includes("F")) {
      //A field element
      let indexOfF = data.indexOf("F");
      fieldNumber = data.substring(indexOfF, indexOfColon);
      htmlElementName += tableNumber + "-field-" + fieldNumber + "-name";
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
