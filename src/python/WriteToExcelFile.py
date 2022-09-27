import openpyxl
from flask import Flask
from flask import request, make_response
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/writeToExcelFile", methods=['POST'])
def writeToExcelFile():
    
    print("HERE!")
    print(request.json)
    print(request.json['tableNames'])
    tableNameDict = request.json['tableNames']
    print(request.json['fieldNames'])
    
    outputPath = 'C:\\Users\\wdpar\\vs_code_repos\\data-request-builder\\docs\\output\\OutputDataDefinition.xlsx'

    outputDataDefWB = openpyxl.load_workbook(outputPath)
    tableSheet = outputDataDefWB['Table_Names']
    fieldSheet = outputDataDefWB['Field_Names']

    nameEntryCol = 1
    outputRow = 1

    #nameArray = ['Will', 'is', 'cool', 'and', 'smart', 'and stuff']

    with(open(outputPath, "a")) as f:
        #Clear the previous workbook's contents
        for row in tableSheet['A1':'A100']:
            for cell in row:
                cell.value = None
        for row in fieldSheet['A1':'A100']:
            for cell in row:
                cell.value = None

        for key in tableNameDict:
            tableSheet.cell(row=outputRow, column=nameEntryCol).value = tableNameDict[key]
            outputRow += 1
        outputDataDefWB.save(filename='C:\\Users\\wdpar\\vs_code_repos\\data-request-builder\\docs\\output\\OutputDataDefinition.xlsx')
    
    return make_response("Success", 200)


if __name__ == "__main__":
    app.run()