//Produces the fields that will contain the data definitions
function EntryFields(props) {
  //A dictionary of the checkboxes and their respective values
  let checkBoxDict = [];
  //Produces an element that will contain a field or table name
  const DataElement = (tableNameElementData) => {
    //The entire array value including labeler (T1F1:VALUE, etc.)
    let data = tableNameElementData.elementData;
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
    let htmlCheckBoxElementName = "";

    if (!identifier.includes("F")) {
      //A table element with identifier TXX:VALUE
      tableNumber = data.substring(1, indexOfColon);
      htmlElementName += tableNumber + "-name";
      htmlLabelValue += tableNumber;
      htmlClassName = "table-element";
    } else if (identifier.includes("F")) {
      //A field element
      let indexOfF = data.indexOf("F");
      tableNumber = data.substring(1, indexOfF);
      fieldNumber = data.substring(indexOfF + 1, indexOfColon);
      htmlElementName += tableNumber + "-field-" + fieldNumber + "-name";
      htmlLabelValue += tableNumber + " Field " + fieldNumber;
      htmlClassName = "field-element";
    }
    htmlCheckBoxElementName = htmlElementName + "-checkbox";

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
          <input
            type="checkbox"
            name={htmlCheckBoxElementName}
            id={htmlCheckBoxElementName}
            className="checkbox"
            onClick={() => handleCheckBox(htmlCheckBoxElementName)}
          ></input>
        </form>
      </>
    );
  };

  const handleCheckBox = (elementName) => {
    let checkBox = document.getElementById(elementName);
    checkBoxDict[checkBox.id] = checkBox.checked;
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
    returnArray = returnArray.sort();
    return returnArray;
  };

  const updateCheckBoxDict = () => {
    let workingCheckBoxDict = [];
    let checkBoxes = document.getElementsByClassName("checkbox");
    for (let i = 0; i < checkBoxes.length; i++) {
      workingCheckBoxDict[checkBoxes[i].id] = checkBoxes[i].checked;
    }
    checkBoxDict = workingCheckBoxDict;
  };

  //Convert the dictionaries to arrays, combine them, and sort the entries.
  let tableNameArray = convertDictToArray("T");
  let fieldNameArray = convertDictToArray("F");
  let aggregateArray = tableNameArray.concat(fieldNameArray);
  aggregateArray = aggregateArray.sort(function (item1, item2) {
    let item1ColonIndex = item1.indexOf(":");
    let item2ColonIndex = item2.indexOf(":");
    let item1Identifier = item1.substring(0, item1ColonIndex);
    let item2Identifier = item2.substring(0, item2ColonIndex);
    let item1IsField = item1Identifier.includes("F");
    let item2IsField = item2Identifier.includes("F");
    if (item1IsField && item2IsField) {
      //Both are fields
      let item1FIndex = item1Identifier.indexOf("F");
      let item2FIndex = item2Identifier.indexOf("F");
      let item1FieldNo = parseInt(
        item1Identifier.substring(item1FIndex + 1, item1ColonIndex)
      );
      let item1TableNo = parseInt(item1Identifier.substring(1, item1FIndex));
      let item2FieldNo = parseInt(
        item2Identifier.substring(item2FIndex + 1, item2ColonIndex)
      );
      let item2TableNo = parseInt(item2Identifier.substring(1, item2FIndex));
      if (item1FieldNo < item2FieldNo && item1TableNo <= item2TableNo) {
        return -1;
      }
      if (item1FieldNo > item2FieldNo && item1TableNo >= item2TableNo) {
        return 1;
      }
      if (item1FieldNo === item2FieldNo) {
        return 0;
      }
    } else if (!item1IsField && item2IsField) {
      //item1 is a table and item2 is a field
      let item2FIndex = item2.indexOf("F");
      let item1TableNo = parseInt(item1.substring(1, item1ColonIndex));
      let item2TableNo = parseInt(item2.substring(1, item2FIndex));
      //Tables will always go before fields of the same table
      //or after fields with an equal or greater value
      if (item1TableNo < item2TableNo) {
        return -1;
      }
      if (item1TableNo > item2TableNo) {
        return 1;
      }
    } else if (item1IsField && !item2IsField) {
      //item1 is a field and item2 is a table
      let item1FIndex = item1.indexOf("F");
      let item1TableNo = parseInt(item1.substring(1, item1FIndex));
      let item2TableNo = parseInt(item2.substring(1, item2ColonIndex));
      //Tables will always go before fields of the same table
      //or after fields with an equal or greater value
      if (item1TableNo < item2TableNo) {
        return -1;
      }
      if (item1TableNo > item2TableNo) {
        return 1;
      }
    } else if (!item1IsField && !item2IsField) {
      //Both are table identifiers
      let item1TableNo = parseInt(item1.substring(1, item1ColonIndex));
      let item2TableNo = parseInt(item2.substring(1, item2ColonIndex));
      if (item1TableNo < item2TableNo) {
        return -1;
      }
      if (item1TableNo > item2TableNo) {
        return 1;
      }
    }
    return 0;
  });

  updateCheckBoxDict();

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
