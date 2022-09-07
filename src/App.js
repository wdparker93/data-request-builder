import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [tableNames, setTableNames] = useState([]);
  const [fieldNames, setFieldNames] = useState([]);

  return (
    <div className="App">
      <h1 id="test">Hello</h1>
      <div id="field-selector-wrapper">
        <form id="selector-array">
          Enter Data Parameters Below
          <br />
          <div id="table-name-entry-wrapper">
            Table Names:
            <br />
            <label for="table-1-name">Table 1 Name: </label>
            <input
              type="text"
              name="table-1-name"
              id="table-1-name"
              size="40"
            ></input>
            <br />
            <label for="table-2-name">Table 2 Name: </label>
            <input
              type="text"
              name="table-2-name"
              id="table-2-name"
              size="40"
            ></input>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
