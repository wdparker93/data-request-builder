import "./App.css";
import Axios from "axios";
import EntryFields from "./secondary-components/js/EntryFields.js";
import TableOptionsComponent from "./secondary-components/js/TableOptionsComponent.js";
import FieldOptionsComponent from "./secondary-components/js/FieldOptionsComponent.js";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [tableNamesDict, setTableNamesDict] = useState({ 1: "T1", 2: "T2" });
  const [fieldNamesDict, setFieldNamesDict] = useState({
    1: ["T1F1", "T1F2"],
    2: ["T2F1", "T2F2"],
  });
  const [currentTableSelected, setCurrentTableSelected] = useState("");
  const [currentFieldSelected, setCurrentFieldSelected] = useState("");
  const [addFieldEnabled, setAddFieldEnabled] = useState(false);
  const [deleteFieldEnabled, setDeleteFieldEnabled] = useState(false);
  const [uploadFromFileEnabled, setUploadFromFileEnabled] = useState(false);
  const [checkBoxDict, setCheckBoxDict] = useState([]);
  const [file, setFile] = useState("");
  const inputFile = useRef(null);
  const checkBoxDictRef = useRef(checkBoxDict);

  //Table selection and handling logic
  const addTableName = () => {
    //Add the table
    let workingTableNamesDict = Object.assign({}, tableNamesDict);
    let newKey = 0;
    let prevKey = 0;
    let gapInKeysFound = false;
    for (const [key] of Object.entries(workingTableNamesDict)) {
      if (!gapInKeysFound) {
        if (parseInt(key) > newKey) {
          newKey = parseInt(key);
        }
        if (prevKey !== parseInt(key) - 1) {
          prevKey++;
          gapInKeysFound = true;
        }
        if (!gapInKeysFound) {
          prevKey++;
        }
      }
    }
    if (gapInKeysFound) {
      newKey = prevKey;
    } else {
      newKey++;
    }
    workingTableNamesDict[newKey] = "T" + newKey;
    setTableNamesDict(workingTableNamesDict);
    //Add an empty field
    let workingFieldNamesDict = Object.assign({}, fieldNamesDict);
    let fieldValue = "T" + newKey + "F1";
    workingFieldNamesDict[newKey] = [fieldValue];
    setFieldNamesDict(workingFieldNamesDict);
  };

  const setTableSelection = () => {
    let selector = document.getElementById("table-selector");
    let tableSelected = selector.value;
    setCurrentTableSelected(tableSelected);
    if (tableSelected !== "" && tableSelected !== "None") {
      setAddFieldEnabled(true);
    } else {
      setAddFieldEnabled(false);
    }
  };

  //Generates a list of tables that exist
  const generateTableOptions = () => {
    let optionsArray = [];
    optionsArray.push("");
    for (const [key] of Object.entries(tableNamesDict)) {
      optionsArray.push(key);
    }
    return React.Children.toArray(
      optionsArray.map((el) => <TableOptionsComponent elementData={el} />)
    );
  };

  //Field selection and handling logic
  const addFieldName = () => {
    let workingFieldNamesDict = Object.assign({}, fieldNamesDict);
    workingFieldNamesDict[currentTableSelected].push("");
    setFieldNamesDict(workingFieldNamesDict);
  };

  const setFieldSelection = () => {
    let selectedTable = currentTableSelected;
    let fieldSelector = document.getElementById("field-selector");
    let fieldSelected = fieldSelector.value;
    let fieldAlias = "";
    if (selectedTable.length > 0 && fieldSelected.length > 0) {
      fieldAlias = selectedTable + ":" + fieldSelected;
    }
    setCurrentFieldSelected(fieldAlias);
    if (fieldAlias.length > 0) {
      setDeleteFieldEnabled(true);
    } else {
      setDeleteFieldEnabled(false);
    }
  };

  //Generates a list of fields that exist under a specified table
  const generateFieldOptions = () => {
    let optionsArray = [];
    optionsArray.push("");
    if (currentTableSelected !== "" && tableNamesDict[currentTableSelected]) {
      for (const [value] of Object.entries(
        fieldNamesDict[currentTableSelected]
      )) {
        optionsArray.push(value);
      }
    }
    let returnArray = optionsArray.map((el) => (
      <FieldOptionsComponent elementData={el} />
    ));
    returnArray.splice(
      1,
      0,
      <>
        <option value="All">All</option>
      </>
    );
    return returnArray;
  };

  //Deletes the selected field or table from the view
  const deleteSelectedField = () => {
    let tableKeyToDelete = currentTableSelected;
    let currentFieldSelectedColonIndex = currentFieldSelected.indexOf(":");
    let fieldToDelete = currentFieldSelected.substring(
      currentFieldSelectedColonIndex + 1
    );
    let checkBoxKey = "table-" + currentTableSelected;
    let tableLevelCheckBoxKey = checkBoxKey;
    if (fieldToDelete !== "All") {
      fieldToDelete = fieldToDelete - 1;
      checkBoxKey +=
        "-field-" +
        currentFieldSelected.substring(0, currentFieldSelectedColonIndex);
    }
    checkBoxKey += "-name-checkbox";
    let workingTableDict = Object.assign({}, tableNamesDict);
    let workingFieldDict = Object.assign({}, fieldNamesDict);
    let workingCheckBoxDict = Object.assign({}, checkBoxDict);
    if (
      fieldToDelete === "All" ||
      workingFieldDict[tableKeyToDelete].length === 1
    ) {
      if (workingTableDict[tableKeyToDelete]) {
        delete workingTableDict[tableKeyToDelete];
      }
      if (workingFieldDict[tableKeyToDelete]) {
        delete workingFieldDict[tableKeyToDelete];
      }
      for (const [key] of Object.entries(workingCheckBoxDict)) {
        if (
          key.substring(0, tableLevelCheckBoxKey.length) ===
          tableLevelCheckBoxKey
        ) {
          delete workingCheckBoxDict[key];
        }
      }
      document.getElementById("table-selector").value = "None";
      document.getElementById("field-selector").value = "None";
      setAddFieldEnabled(false);
      setDeleteFieldEnabled(false);
    } else {
      let tableArray = workingFieldDict[tableKeyToDelete];
      delete tableArray[fieldToDelete];
      let newArray = [];
      for (let i = 0; i < tableArray.length; i++) {
        if (tableArray[i] !== undefined) {
          newArray.push(tableArray[i]);
        }
      }
      workingFieldDict[tableKeyToDelete] = newArray;
      for (const [key] of Object.entries(workingCheckBoxDict)) {
        if (key === checkBoxKey) {
          delete workingCheckBoxDict[key];
        }
      }
    }
    setTableNamesDict(workingTableDict);
    setFieldNamesDict(workingFieldDict);
  };

  //Saving and processing section
  //exportResultsToExcel needs to call a Python script and output
  //the current data definition to an excel sheet
  const exportResultsToExcel = () => {
    let checkBoxParamArray = [];
    let index = 0;
    for (const [key] of Object.entries(checkBoxDict)) {
      let entryArray = [];
      entryArray.splice(0, 0, key);
      entryArray.splice(1, 0, checkBoxDict[key]);
      checkBoxParamArray.splice(index, 0, entryArray);
      index++;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    Axios.post(
      "http://127.0.0.1:5000/writeToExcelFile",
      {
        tableNames: tableNamesDict,
        fieldNames: fieldNamesDict,
        checkBoxes: checkBoxParamArray,
      },
      config
    ).then(
      (response) => {
        //Ok
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const enableDisableFileUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const file = files[0];
      var parts = file.name.split(".");
      const fileType = parts[parts.length - 1];
      setFile(file);
      if (fileType === "txt") {
        setUploadFromFileEnabled(true);
      } else {
        setUploadFromFileEnabled(false);
      }
    }
  };

  const importFromFile = () => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    Axios.post(
      "http://127.0.0.1:5000/readFromTextFile",
      {
        files: file,
      },
      config
    ).then(
      (response) => {
        let returnDicts = response.data;
        let tableDict = returnDicts["Tables"];
        let fieldDict = returnDicts["Fields"];
        setTableNamesDict(tableDict);
        setFieldNamesDict(fieldDict);
        let tableCheckBoxDict = returnDicts["Table-Boxes"];
        let fieldCheckBoxDict = returnDicts["Field-Boxes"];
        let workingCheckBoxDict = [];
        for (const [key, value] of Object.entries(tableCheckBoxDict)) {
          let entryKey = "table-" + key + "-name-checkbox";
          let valueToSet = false;
          if (value === "true") {
            valueToSet = true;
          }
          workingCheckBoxDict[entryKey] = valueToSet;
        }
        for (const [key, value] of Object.entries(fieldCheckBoxDict)) {
          for (let i = 0; i < value.length; i++) {
            let entryKey =
              "table-" + key + "-field-" + (i + 1) + "-name-checkbox";
            let valueToSet = false;
            if (value[i] === "true") {
              valueToSet = true;
            }
            workingCheckBoxDict[entryKey] = valueToSet;
          }
        }
        setCheckBoxDict(workingCheckBoxDict);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    const refreshState = async () => {
      let workingCheckBoxDict = [];
      let checkBoxes = document.getElementsByClassName("checkbox");
      for (let i = 0; i < checkBoxes.length; i++) {
        workingCheckBoxDict[checkBoxes[i].id] = checkBoxes[i].checked;
      }
      checkBoxDictRef.current = workingCheckBoxDict;
      setCheckBoxDict(workingCheckBoxDict);
    };
    refreshState();
    //updateCheckBoxDict();
  }, [tableNamesDict, fieldNamesDict]);

  const saveStateToTextFile = () => {
    let checkBoxParamArray = [];
    let index = 0;
    for (const [key] of Object.entries(checkBoxDict)) {
      let entryArray = [];
      entryArray.splice(0, 0, key);
      entryArray.splice(1, 0, checkBoxDict[key]);
      checkBoxParamArray.splice(index, 0, entryArray);
      index++;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    Axios.post(
      "http://127.0.0.1:5000/saveStateToTextFile",
      {
        tableNames: tableNamesDict,
        fieldNames: fieldNamesDict,
        checkBoxes: checkBoxParamArray,
      },
      config
    ).then(
      (response) => {
        //Ok
      },
      (error) => {
        console.log(error);
      }
    );
  };

  /**
   * Runs when a user checks/unchecks a checkbox.
   * Passed as a handler to EntryFields component which triggers it.
   *
   * @param {Updated checkBoxes dictionary from EntryFields component} checkBoxes
   */
  const checkBoxUpdateHandler = (checkBoxes) => {
    checkBoxDictRef.current = checkBoxes;
    setCheckBoxDict(checkBoxes);
  };

  const fieldUpdateHandler = (fieldValue, elementName) => {
    let isTableField = true;
    if (elementName.includes("-field")) {
      isTableField = false;
    }
    let tableNumber = 0;
    let indexOfName = elementName.indexOf("-name");
    if (!isTableField) {
      let fieldNumStartIndex = elementName.indexOf("-field") + 7;
      let fieldNumber = parseInt(
        elementName.substring(fieldNumStartIndex, indexOfName)
      );
      tableNumber = parseInt(elementName.substring(6, fieldNumStartIndex - 7));
      let workingFieldNamesDict = Object.assign({}, fieldNamesDict);
      let fieldNameArr = workingFieldNamesDict[tableNumber];
      fieldNameArr[fieldNumber - 1] = fieldValue;
      workingFieldNamesDict[tableNumber] = fieldNameArr;
    } else {
      tableNumber = parseInt(elementName.substring(6, indexOfName));
      let workingTableNamesDict = Object.assign({}, tableNamesDict);
      workingTableNamesDict[tableNumber] = fieldValue;
      setTableNamesDict(workingTableNamesDict);
    }
  };

  const selectDeselectAll = () => {
    let checkBoxes = document.getElementsByClassName("checkbox");
    let numChecked = 0;
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        numChecked++;
      }
    }
    let valueToSet = true;
    if (numChecked === checkBoxes.length) {
      valueToSet = false;
    }
    let workingCheckBoxDict = [];
    for (let i = 0; i < checkBoxes.length; i++) {
      workingCheckBoxDict[checkBoxes[i].id] = valueToSet;
    }
    setCheckBoxDict(workingCheckBoxDict);
  };

  //Render to browser
  return (
    <div className="App">
      <h1 id="main-heading">Data Definition Builder</h1>
      <hr id="main-divider" />
      <div id="interactive-section-wrapper">
        <div id="field-name-wrapper">
          <h2 id="field-entry-heading">Enter Data Parameter Names</h2>
          <EntryFields
            tableNamesParam={tableNamesDict}
            fieldNamesParam={fieldNamesDict}
            checkBoxes={checkBoxDict}
            checkBoxUpdateHandler={checkBoxUpdateHandler}
            fieldUpdateHandler={fieldUpdateHandler}
          />
        </div>
        <div id="button-section-wrapper">
          <h2 id="button-heading">Add / Remove / Submit Fields</h2>
          <br />
          <div id="button-wrapper">
            <button
              className="button"
              id="add-table-name-button"
              onClick={addTableName}
            >
              Add New Table
            </button>
            <div id="field-add-btn-tbl-selector-wrapper">
              <div id="table-selector-wrapper">
                <label htmlFor="table-selector">Select Table: </label>
                <select
                  name="table-selector"
                  className="selector"
                  id="table-selector"
                  onChange={setTableSelection}
                >
                  {generateTableOptions()}
                </select>
              </div>
              <div id="field-selector-wrapper">
                <label htmlFor="field-selector">Select Field: </label>
                <select
                  name="field-selector"
                  className="selector"
                  id="field-selector"
                  onChange={setFieldSelection}
                >
                  {generateFieldOptions()}
                </select>
              </div>
              <button
                className="button"
                id="add-field-name-button"
                onClick={addFieldName}
                disabled={!addFieldEnabled}
              >
                Add Field
              </button>
              <button
                className="button"
                id="delete-field-name-button"
                disabled={!deleteFieldEnabled}
                onClick={deleteSelectedField}
              >
                Delete Field(s)
              </button>
            </div>

            <button
              className="button"
              id="submit-field-data-button"
              onClick={exportResultsToExcel}
            >
              Export to Excel
            </button>
            <button
              className="button"
              id="select-deselect-all-button"
              onClick={selectDeselectAll}
            >
              Check / Uncheck All
            </button>
            <button
              className="button"
              id="test-capture-state-button"
              onClick={saveStateToTextFile}
            >
              Save Session Config to .txt
            </button>
            <div id="file-select-upload-wrapper">
              <button
                className="button"
                id="import-data-button"
                onClick={importFromFile}
                disabled={!uploadFromFileEnabled}
              >
                Import Fields from Text File
              </button>
              <input
                ref={inputFile}
                onChange={enableDisableFileUpload}
                type="file"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
