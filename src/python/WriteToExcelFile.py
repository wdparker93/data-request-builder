import openpyxl
from flask import Flask
from flask import request, make_response
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
#CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/writeToExcelFile", methods=['POST'])
def writeToExcelFile():
    
    print("HERE!")
    print(request)
    print(request.content_type)
    print(request.mimetype)
    print(request.json)
    jsonData = request.json
    value = jsonData['value']
    print(value)
    #print(request.form['value'])
    #jsData = request.form['value']
    #print(jsData)
    
    outputPath = 'C:\\Users\\wdpar\\vs_code_repos\\data-request-builder\\docs\\output\\OutputDataDefinition.xlsx'

    outputDataDefWB = openpyxl.load_workbook(outputPath)
    tableSheet = outputDataDefWB.active

    tableNameEntryCol = 1
    outputRow = 1

    nameArray = ['Will', 'is', 'cool', 'and', 'smart', 'and stuff']

    with(open(outputPath, "a")) as f:
        for i in range(len(nameArray)):
            tableSheet.cell(row=outputRow, column=tableNameEntryCol).value = nameArray[i]
            outputRow += 1
        outputDataDefWB.save(filename='C:\\Users\\wdpar\\vs_code_repos\\data-request-builder\\docs\\output\\OutputDataDefinition.xlsx')
    
    return make_response("Success", 200)


if __name__ == "__main__":
    app.run()