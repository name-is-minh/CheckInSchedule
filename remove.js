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

  //Reverse the 'for' loop.
  for (var i = rangeVals.length - 1; i >= 0; i--) {
    Logger.log(rangeVals[i][startCol]);
    if (rangeVals[i][startCol] === name) {
      var cellRange = '';
      var cellStart = sheet.getRange(i + 1, startCol + 1).getA1Notation();
      var cellEnd = sheet.getRange(i + 1, sheet.getLastColumn()).getA1Notation();
      cellRange = cellRange.concat(cellStart, ':', cellEnd);
      sheet.getRange(cellRange).deleteCells(SpreadsheetApp.Dimension.ROWS);
    }
  }
}
