import "./App.css";
import Axios from "axios";
import EntryFields from "./secondary-components/js/EntryFields.js";
import TableOptionsComponent from "./secondary-components/js/TableOptionsComponent.js";
import FieldOptionsComponent from "./secondary-components/js/FieldOptionsComponent.js";
import React, { useState, useEffect } from "react";

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
  const [checkBoxDictionary, setCheckBoxDictionary] = useState([]);

  //Table selection and handling logic
  const addTableName = () => {
    //Add the table
    let workingTableNamesDict = Object.assign({}, tableNamesDict);
    let newKey = 1;
    for (const [key] of Object.entries(workingTableNamesDict)) {
      if (key > newKey) {
        newKey = key;
      }
    }
    newKey++;
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
    if (tableSelected !== "") {
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
    return optionsArray.map((el) => <TableOptionsComponent elementData={el} />);
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
    if (currentTableSelected !== "") {
      for (const [value] of Object.entries(
        fieldNamesDict[currentTableSelected]
      )) {
        optionsArray.push(value);
      }
    }
    return optionsArray.map((el) => <FieldOptionsComponent elementData={el} />);
  };

  //Saving and processing section
  //submitFieldData needs to call a Python script and output
  //the current data definition to an excel sheet
  const submitFieldData = () => {
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

  //Saves the state of the fields as they appear currently
  const captureState = () => {
    let inputs = document.getElementsByClassName("input-field");
    let tableNamesWorkingDict = {};
    let fieldNamesWorkingDict = {};
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      let inputName = input.name;
      let inputId = input.id;
      //inputName will either be like table-1-name or table-1-field-1-name
      if (!inputName.includes("field")) {
        //a table
        let tableNumber = parseInt(
          inputName.substring(
            inputName.indexOf("table-") + 6,
            inputName.indexOf("-name")
          )
        );
        tableNamesWorkingDict[tableNumber] =
          document.getElementById(inputId).value;
      } else {
        //a field
        let tableNumber = parseInt(
          inputName.substring(
            inputName.indexOf("table-") + 6,
            inputName.indexOf("-field")
          )
        );
        //let oldaddAtFieldIndex = parseInt(inputName.charAt(14)) - 1;
        let addAtFieldIndex =
          parseInt(
            inputName.substring(
              inputName.indexOf("field-") + 6,
              inputName.indexOf("-name")
            )
          ) - 1;
        let currentTableFieldNames = [];
        if (typeof fieldNamesWorkingDict[tableNumber] !== "undefined") {
          currentTableFieldNames = fieldNamesWorkingDict[tableNumber];
        }
        currentTableFieldNames.splice(
          addAtFieldIndex,
          0,
          document.getElementById(inputId).value
        );
        fieldNamesWorkingDict[tableNumber] = currentTableFieldNames;
      }
    }
    setTableNamesDict(tableNamesWorkingDict);
    setFieldNamesDict(fieldNamesWorkingDict);
  };

  useEffect(() => {
    const updateCheckBoxDict = async () => {
      let workingCheckBoxDict = [];
      let checkBoxes = document.getElementsByClassName("checkbox");
      for (let i = 0; i < checkBoxes.length; i++) {
        workingCheckBoxDict[checkBoxes[i].id] = checkBoxes[i].checked;
      }
      setCheckBoxDictionary(workingCheckBoxDict);
    };
    updateCheckBoxDict();
  }, []);

  const checkBoxUpdateHandler = (checkBoxes) => {
    setCheckBoxDictionary(checkBoxes);
  };

  //Render to browser
  return (
    <div className="App">
      <h1 id="main-heading">Data Definition Builder</h1>
      <div id="interactive-section-wrapper">
        <div id="field-name-wrapper">
          <h2 id="field-entry-heading">Enter Data Parameter Names</h2>
          <EntryFields
            tableNamesParam={tableNamesDict}
            fieldNamesParam={fieldNamesDict}
            checkBoxes={checkBoxDictionary}
            checkBoxUpdateHandler={checkBoxUpdateHandler}
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
              >
                Delete Field
              </button>
            </div>
            <button
              className="button"
              id="test-capture-state-button"
              onClick={captureState}
            >
              Save Data
            </button>
            <button
              className="button"
              id="submit-field-data-button"
              onClick={submitFieldData}
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
