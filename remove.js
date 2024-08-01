function removeWorker(name) {
  // delete sign-in
  deleteEachCell(name, 0, 6);

  // delete timebars
  var numCols = Math.pow(generateTimestamps(9, 8, SHIFT_MINUTES).length, 2);
  deleteEachCell(name, COL_OFFSET - 2, numCols);
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function deleteEachCell(name, startCol, numCols) {
  var rangeVals = sheet.getDataRange().getValues();
  var rowsToDelete = [];

  // Mark rows to delete
  for (var i = 0; i < rangeVals.length; i++) {
    if (rangeVals[i][startCol] === name) {
      rowsToDelete.push(i + 1);
    }
  }

  // Delete rows in reverse order
  for (var j = rowsToDelete.length - 1; j >= 0; j--) {
    sheet.deleteRow(rowsToDelete[j]);
  }
}
