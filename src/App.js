import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tableNames, setTableNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);

  const addTableName = () => {
    console.log("added table name");
  };

  const addFieldName = () => {
    console.log("added field name");
  };

  return (
    <div className="App">
      <h1 id="main-heading">Data Definition Builder</h1>
      <div id="interactive-section-wrapper">
        <div id="field-name-wrapper">
          <h2 id="field-entry-heading">Enter Data Parameter Names</h2>
          <form id="field-name-array">
            <div class="table-name-section" id="table-name-entry-wrapper">
              <br />
              <label for="table-1-name">Table 1 Name: </label>
              <input
                type="text"
                name="table-1-name"
                id="table-1-name"
                size="30"
              ></input>
              <div class="field-name-section" id="table-field-entry-wrapper">
                <br />
                <label for="table-1-field-1-name">Table 1 Field 1 Name: </label>
                <input
                  type="text"
                  name="table-1-field-1-name"
                  id="table-1-field-1-name"
                  size="30"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
