import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tableNames, setTableNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);
  const [numTables, setNumTables] = useState(1);
  const [numFields, setNumFields] = useState(1);

  const addTableName = () => {
    setNumTables(numTables + 1);
  };

  const addFieldName = () => {
    setNumFields(numFields + 1);
  };

  const submitFieldData = () => {
    console.log(tableNames);
    console.log(fieldNames);
    console.log(numTables);
    console.log(numFields);
  };

  useEffect(() => {
    setNumTables(1);
    setNumFields(1);
  }, []);

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
  };

  return (
    <div className="App">
      <h1 id="main-heading">Data Definition Builder</h1>
      <div id="interactive-section-wrapper">
        <div id="field-name-wrapper">
          <h2 id="field-entry-heading">Enter Data Parameter Names</h2>
          <form id="field-name-array">
            <div class="table-name-section">
              <br />
              <label for="table-1-name">Table 1 Name: </label>
              <input
                type="text"
                name="table-1-name"
                id="table-1-name"
                size="30"
                className="input-field"
                onChange={handleNameChange}
              ></input>
              <div class="field-name-section">
                <br />
                <label for="table-1-field-1-name">Table 1 Field 1 Name: </label>
                <input
                  type="text"
                  name="table-1-field-1-name"
                  id="table-1-field-1-name"
                  size="30"
                  className="input-field"
                  onChange={handleNameChange}
                ></input>
              </div>
            </div>
          </form>
        </div>
        <div id="button-section-wrapper">
          <h2 id="button-heading">Add Or Remove Fields</h2>
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
              Submit Fields
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
