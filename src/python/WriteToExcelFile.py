import openpyxl

outputPath = 'C:\\Users\\wdpar\\vs_code_repos\\data-request-builder\\docs\\output\\OutputDataDefinition.xlsx'

outputDataDefWB = openpyxl.load_workbook(outputPath)
tableSheet = outputDataDefWB.active

tableNameEntryCol = 1
outputRow = 1

nameArray = ['Will', 'is', 'cool']

with(open(outputPath, "a")) as f:
    for i in range(len(nameArray)):
        tableSheet.cell(row=outputRow, column=tableNameEntryCol).value = nameArray[i]
        outputRow += 1
    outputDataDefWB.save(filename='C:\\Users\\wdpar\\vs_code_repos\\data-request-builder\\docs\\output\\OutputDataDefinition.xlsx')