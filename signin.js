function onEdit(e) {
  if (
    e.range.getRow() >= 2 &&
    e.range.getColumn() == 3 &&
    e.range.getSheet().getName() == "schedule"
    ) {
    updateLog(e.range);
  }
}

function updateLog(range) {
  var logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("log");

  //** get values for log entry */
  var name = sheet.getRange(range.getRow(), range.getColumn() - 2);
  // get status
  var status = sheet.getRange(range.getRow(), range.getColumn() + 1);
  // get location
  var location = sheet.getRange(range.getRow(), range.getColumn());
  // create time and date stamps
  var d = new Date();
  var timestamp = Utilities.formatDate(d, "CST", "HH:mm");
  var month = Utilities.formatDate(d, "CST", "MMMM").substring(0, 3);
  var datestamp = Utilities.formatDate(d, "CST", "dd")
    .concat(" ", month, " ")
    .concat(Utilities.formatDate(d, "CST", "YYYY"));
  var day = WEEKDAYS[d.getDay()];
  // get check-in status and location
  var statusConcat = "";
  if (status.getValue() == "Out") {
    statusConcat = status.getValue();
  } else {
    statusConcat = statusConcat.concat(
      status.getValue(),
      " - ",
      location.getValue()
    );
  }
  //** construct log array */
  var logArray = [
    [datestamp,
    day,
    timestamp,
    name.getValue(),
    statusConcat,
    ""],
  ];
  //** insert cells for new log entry */
  logSheet
    .getRange(3, 1, 1, logArray[0].length)
    .insertCells(SpreadsheetApp.Dimension.ROWS);
  logSheet.getRange(3,1,1,logArray[0].length).setValues(logArray);
}