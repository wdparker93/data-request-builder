import "../css/EntryFields.css";

function EntryFields(props) {
  console.log(props.nameChangeHandler);
  console.log(props.tableNamesParam);
  console.log(props.fieldNamesParam);
  console.log(props.numTablesParam);
  console.log(props.numFieldsParam);

  return (
    <>
      <form id="field-name-array">
        <div className="table-name-section">
          <br />
          <label htmlFor="table-1-name">Table 1 Name: </label>
          <input
            type="text"
            name="table-1-name"
            id="table-1-name"
            size="30"
            className="input-field"
            onChange={props.nameChangeHandler}
          ></input>
          <div className="field-name-section">
            <br />
            <label htmlFor="table-1-field-1-name">Table 1 Field 1 Name: </label>
            <input
              type="text"
              name="table-1-field-1-name"
              id="table-1-field-1-name"
              size="30"
              className="input-field"
              onChange={props.nameChangeHandler}
            ></input>
          </div>
        </div>
      </form>
    </>
  );
}

export default EntryFields;
