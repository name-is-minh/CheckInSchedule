function createTimeBars(cell, timeArray, color) {
  var range = createTimestampRow(cell, timeArray);
  range.setFontColor(color);

  return range;
}

function generateRandomColor() {
  var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  while (randomColor == '#FFFFFF') {
    randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  return randomColor;
}

function selectColor(workerCount) {
  return COLORS[(workerCount % COLORS.length)];
}

function addConditionalRule(range, ruleString, color) {
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(ruleString)
    .setFontColor(color)
    .setBackground(color)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function addStatusRule(range, text, color) {
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo(text)
    .setBackground(color)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function createTimestampRow(cell, timeArray) {
  var startCell = sheet.getRange(cell); // this will depend on the number of workers.  Then you can increment accordingly
  var range = sheet.getRange(
    startCell.getRow(),
    startCell.getColumn(),
    1,
    timeArray.length
  );
  var timeArray2D = [];
  timeArray2D.push(timeArray);
  range.setValues(timeArray2D).setFontColor('#000000');

  return range;
}

function createTimeDropdown(cell, timeArray) {
  var startCell = sheet.getRange(cell);
  // appends 'Away' to time array to indicate worker OOO
  timeArray.push('Away');
  // creates data validation rule for timestamp dropdown menu
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(timeArray, true)
    .build();
  startCell.setDataValidation(rule);
  timeArray.pop();
}

function generateTimestamps(startHour, hours, interval) {
  var minuteInterval = interval; //minutes interval
  var times = []; // time array
  var startTime = startHour * 60; // start time
  var ap = ['AM', 'PM']; // AM-PM
  var endTime = (hours + interval / 60) * 60 + startTime; // convert number of hours to end time properly

  //loop to increment the time and push results in array
  for (var i = 0; startTime < endTime; i++) {
    var hh = Math.floor(startTime / 60); // getting hours of day in 0-24 format
    var mm = startTime % 60; // getting minutes of the hour in 0-55 format
    times[i] = ('' + hh).slice(-2) + ':' + ('0' + mm).slice(-2); // pushing data in array in [00:00 - 12:00 AM/PM format]
    startTime = startTime + minuteInterval;
  }

  return times;
}

function getArrayNoBlanks(range) {
  return range.getValues().reduce(function (ar, e) {
    if (e[0]) {
      ar.push(e[0]);
    }
    return ar;
  }, []);
}

function getNumLogEntries(logStart) {
  // argument needs to be in A1 notation
  var checkCell = sheet.getRange(logStart);
  // check each cell vertically to look for start of log merged header, breaks out when found
  while (checkCell.getValue() != 'Log' && !checkCell.isPartOfMerge()) {
    checkCell = sheet.getRange(checkCell.getRow() + 1, checkCell.getColumn());
  }

  // set log range to start at log header and end at bottom of sheet then clean to just include values
  // the substring range is fine because it's the same column
  var logEntryRange = sheet.getRange(
    checkCell
      .getA1Notation()
      .concat(':', checkCell.getA1Notation().substring(0, 1))
  );
  // clean up range to remove blanks
  var logEntryRange = getArrayNoBlanks(logEntryRange);

  // return number of log entries including the header rows
  return logEntryRange.length;
}

function createDiv(searchTerm) {
  var range = sheet.getRange(1, COL_OFFSET);
  var textRange;
  var rangeString = '';

  while (!range.isBlank()) {
    if (range.getValue() === searchTerm) {
      textRange = sheet.getRange(rangeString.concat(range.getA1Notation().slice(0, -1),':',range.getA1Notation().slice(0, -1)));
      textRange.setFontColor('white');
    }
    range = sheet.getRange(1, range.getColumn() + 1);
  }
}