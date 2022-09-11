import "./App.css";
import EntryFields from "./secondary-components/js/EntryFields.js";
import React, { useState, useEffect } from "react";

function App() {
  const [tableNamesDict, setTableNamesDict] = useState({ 1: "T1", 2: "T2" });
  const [fieldNamesDict, setFieldNamesDict] = useState({
    1: ["T1F1", "T1F2"],
    2: ["T2F1", "T2F2"],
  });
  const [numTables, setNumTables] = useState(1);
  const [numFields, setNumFields] = useState(1);

  const addTableName = () => {
    let workingNumTables = numTables;
    setNumTables(workingNumTables + 1);
  };

  const addFieldName = () => {
    let workingNumFields = numFields;
    setNumFields(workingNumFields + 1);
  };

  const submitFieldData = () => {
    //console.log(tableNames);
    //console.log(fieldNames);
    console.log(numTables);
    console.log(numFields);
  };

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
        let tableNumber = parseInt(inputName.charAt(6));
        tableNamesWorkingDict[tableNumber] =
          document.getElementById(inputId).value;
      } else {
        let tableNumber = parseInt(inputName.charAt(6));
        let addAtFieldIndex = parseInt(inputName.charAt(14)) - 1;
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

  /*
  const handleNameChange = () => {
    let inputs = document.getElementsByClassName("input-field");
    let tableNamesWorkingArr = [];
    let fieldNamesWorkingArr = [];
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];
      let inputName = input.name;
      let inputId = input.id;
      //inputName will either be like table-1-name or table-1-field-1-name
      if (!inputName.includes("field")) {
        let addAtTableIndex = parseInt(inputName.charAt(6)) - 1;
        tableNamesWorkingArr.splice(
          addAtTableIndex,
          0,
          document.getElementById(inputId).value
        );
      } else {
        let addAtTableIndex = parseInt(inputName.charAt(6)) - 1;
        let addAtFieldIndex = parseInt(inputName.charAt(14)) - 1;
        let currentTableFieldNames = fieldNamesWorkingArr[addAtTableIndex];
        if (typeof currentTableFieldNames === "undefined") {
          currentTableFieldNames = [];
        }
        currentTableFieldNames.splice(
          addAtFieldIndex,
          0,
          document.getElementById(inputId).value
        );
        fieldNamesWorkingArr.splice(addAtTableIndex, 0, currentTableFieldNames);
      }
    }
    setTableNames(tableNamesWorkingArr);
    setFieldNames(fieldNamesWorkingArr);
    //console.log(tableNamesWorkingArr);
    //console.log(fieldNamesWorkingArr);
  };
  */

  return (
    <div className="App">
      <h1 id="main-heading">Data Definition Builder</h1>
      <div id="interactive-section-wrapper">
        <div id="field-name-wrapper">
          <h2 id="field-entry-heading">Enter Data Parameter Names</h2>
          <EntryFields
            tableNamesParam={tableNamesDict}
            fieldNamesParam={fieldNamesDict}
            numTablesParam={numTables}
            numFieldsParam={numFields}
          />
        </div>
        <div id="button-section-wrapper">
          <h2 id="button-heading">Add / Remove / Submit Fields</h2>
          <br />
          <div id="button-wrapper">
            <button
              className="table-button"
              id="add-table-name-button"
              onClick={addTableName}
            >
              Add New Table
            </button>
            <button
              className="field-button"
              id="add-field-name-button"
              onClick={addFieldName}
            >
              Add New Field
            </button>
            <button
              className="field-button"
              id="submit-field-data-button"
              onClick={submitFieldData}
            >
              Export Data
            </button>
            <button
              className="field-button"
              id="test-capture-state-button"
              onClick={captureState}
            >
              Save Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
