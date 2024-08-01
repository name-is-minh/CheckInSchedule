function addWorker(NAME) {
  // create timestamps for 9am to 5pm with intervals of SHIFT_MINUTES
  var timeRangeDrop, timeRangeHeader;
  timeRangeDrop = generateTimestamps(9, NUM_HOURS, SHIFT_MINUTES);
  timeRangeHeader = generateTimestamps(9, NUM_HOURS, SHIFT_MINUTES);
  timeRangeHeader.pop(); // gets rid of trailing time entry
  var headerArray = ['Start Hour', 'End Hour', 'Hours'];

  // create timestamp headers if not already created
  if (sheet.getRange(1, COL_OFFSET).getValue() == '') {
    var timeStart = sheet.getRange(1, COL_OFFSET);

    for (var i = 0; i < NUM_SHIFTS; i++) {
      for (var j = 0; j < headerArray.length; j++) {
        timeRangeHeader.push(headerArray[j]);
      }
    }

    timeRangeHeader.push('Daily Total');

    for (var i = 0; i < WORKWEEK.length; i++) {
      createTimestampRow(timeStart.getA1Notation(), timeRangeHeader);
      timeStart = sheet.getRange(
        timeStart.getRow() + NUMWORKERS + 2,
        timeStart.getColumn()
      );
    }

    for (var i = 0; i < NUM_SHIFTS; i++) {
      for (var j = 0; j < headerArray.length; j++) {
        timeRangeHeader.pop();
      }
    }

    timeRangeHeader.pop();
  }

  // insert cells under the last worker added
  var NUMWORKERSOffset = NUMWORKERS + 2;
  var workerHeaderRangeString =
    'A' +
    NUMWORKERSOffset +
    ':' +
    sheet.getRange(NUMWORKERSOffset, COL_OFFSET - 3).getA1Notation();
  var workerHeaderRange = sheet.getRange(workerHeaderRangeString);
  workerHeaderRange.insertCells(SpreadsheetApp.Dimension.ROWS);
  sheet.getRange(workerHeaderRange.getRow(), 1).setValue(NAME).setFontColor('black');

  var workerSchedule = sheet.getRange(NUMWORKERS + 2, COL_OFFSET - 1);
  var randColor = selectColor(NUMWORKERS + 1);
  var hourTotal = '=SUM(';

  for (var i = 0; i < WORKWEEK.length; i++) {
    var cellStart = workerSchedule.getA1Notation();
    var cellEnd = sheet
      .getRange(
        workerSchedule.getRow(),
        sheet.getLastColumn()
      )
      .getA1Notation();
    var cellRangeString = cellStart + ':' + cellEnd;
    var cellRange = sheet.getRange(cellRangeString);
    cellRange.insertCells(SpreadsheetApp.Dimension.ROWS);
    workerSchedule.setValue(NAME).setFontColor('black');

    // dropdown var declaration/initialization
    var ddStart, ddEnd;
    var ddRange = sheet.getRange(
      workerSchedule.getRow(),
      timeRangeHeader.length + COL_OFFSET
    );

    var hourDailyFormula;
    var dailyTotalFormula = '=SUM(';
    var dailyTotalArr = [];

    var ddStartArr = [];
    var ddEndArr = [];

    // shift dropdowns
    for (var j = 0; j < NUM_SHIFTS; j++) {
      if (j == 0) {
        hourDailyFormula = '';
        // shift start dropdowns
        createTimeDropdown(ddRange.getA1Notation(), timeRangeDrop);
        ddStart = ddRange;
        ddStart.setValue(timeRangeDrop[0]).setFontColor('black');
        ddStartArr.push(ddStart);

        // shift end dropdowns
        createTimeDropdown(
          sheet
            .getRange(ddRange.getRow(), ddRange.getColumn() + 1)
            .getA1Notation(),
          timeRangeDrop
        );
        ddEnd = sheet.getRange(ddRange.getRow(), ddRange.getColumn() + 1);
        ddEnd.setValue(timeRangeDrop[timeRangeDrop.length - 1]);
        ddEndArr.push(ddEnd);

        // calculate shift lengths
        hourDailyFormula = hourDailyFormula.concat(
          '=IF(OR(ISBLANK(',
          ddEnd.getA1Notation(),
          '),ISBLANK(',
          ddStart.getA1Notation(),
          ')),"",IF(OR(',
          ddEnd.getA1Notation(),
          '="Away",',
          ddStart.getA1Notation(),
          '="Away"),0,IF(',
          ddStart.getA1Notation(),
          '<',
          ddEnd.getA1Notation(),
          ',HOUR(',
          ddEnd.getA1Notation(),
          '-',
          ddStart.getA1Notation(),
          ')+(MINUTE(',
          ddEnd.getA1Notation(),
          '-',
          ddStart.getA1Notation(),
          ')/60),"Invalid Range")))'
        );
        sheet
          .getRange(ddRange.getRow(), ddEnd.getColumn() + 1)
          .setValue(hourDailyFormula);
        sheet
          .getRange(ddRange.getRow(), ddEnd.getColumn() + 1)
          .setNumberFormat('0.00');
        dailyTotalArr.push(
          sheet
            .getRange(ddRange.getRow(), ddEnd.getColumn() + 1)
            .getA1Notation()
        );
      } else {
        for (var k = 0; k < NUM_SHIFTS; k++) {
          hourDailyFormula = '';
          // shift start dropdowns after first one
          createTimeDropdown(
            sheet
              .getRange(ddRange.getRow(), ddRange.getColumn() + k * 3)
              .getA1Notation(),
            timeRangeDrop
          );
          ddStart = sheet.getRange(
            ddRange.getRow(),
            ddRange.getColumn() + k * 3
          );

          ddStart.setValue("Away"); // set the 1st Start Hr to Away instead of 9:00

          ddStartArr.push(ddStart);

          // shift end dropdowns after first one
          createTimeDropdown(
            sheet
              .getRange(ddRange.getRow(), ddRange.getColumn() + 1 + k * 3)
              .getA1Notation(),
            timeRangeDrop
          );
          ddEnd = sheet.getRange(
            ddRange.getRow(),
            ddRange.getColumn() + 1 + k * 3
          );

          ddEnd.setValue("Away"); // set the 1st End Hr to Away instead of 17:00

          ddEndArr.push(ddEnd);

          // calculate shift lengths
          hourDailyFormula = hourDailyFormula.concat(
            '=IF(OR(ISBLANK(',
            ddEnd.getA1Notation(),
            '),ISBLANK(',
            ddStart.getA1Notation(),
            ')),"",IF(OR(',
            ddEnd.getA1Notation(),
            '="Away",',
            ddStart.getA1Notation(),
            '="Away"),0,IF(',
            ddStart.getA1Notation(),
            '<',
            ddEnd.getA1Notation(),
            ',HOUR(',
            ddEnd.getA1Notation(),
            '-',
            ddStart.getA1Notation(),
            ')+(MINUTE(',
            ddEnd.getA1Notation(),
            '-',
            ddStart.getA1Notation(),
            ')/60),"Invalid Range")))'
          );
          sheet
            .getRange(ddRange.getRow(), ddEnd.getColumn() + 1)
            .setValue(hourDailyFormula);
          sheet
            .getRange(ddRange.getRow(), ddEnd.getColumn() + 1)
            .setNumberFormat('0.00');
          dailyTotalArr.push(
            sheet
              .getRange(ddRange.getRow(), ddEnd.getColumn() + 1)
              .getA1Notation()
          );
        }
      }
    }

    // used to offset the excess cells pushed into the array by the function
    while (dailyTotalArr.length > NUM_SHIFTS) {
      dailyTotalArr.shift();
      ddStartArr.shift();
      ddEndArr.shift();
    }

    // create formulas to total the shift hours per day
    for (var l = 0; l < dailyTotalArr.length; l++) {
      if (l == dailyTotalArr.length - 1) {
        dailyTotalFormula = dailyTotalFormula.concat(dailyTotalArr[l]);
      } else {
        dailyTotalFormula = dailyTotalFormula.concat(dailyTotalArr[l], ',');
      }
    }
    sheet
      .getRange(ddRange.getRow(), ddEnd.getColumn() + 2)
      .setValue(dailyTotalFormula + ')').setFontColor('black');
    sheet
      .getRange(ddRange.getRow(), ddEnd.getColumn() + 2)
      .setNumberFormat('0.00').setFontColor('black');

    if (i == WORKWEEK.length - 1) {
      hourTotal = hourTotal.concat(
        sheet.getRange(ddRange.getRow(), ddEnd.getColumn() + 2).getA1Notation()
      );
    } else {
      hourTotal = hourTotal.concat(
        sheet.getRange(ddRange.getRow(), ddEnd.getColumn() + 2).getA1Notation(),
        ','
      );
    }

    // add colored timebars
    var timeBarCell = sheet.getRange(workerSchedule.getRow(), COL_OFFSET);
    createTimeBars(timeBarCell.getA1Notation(), timeRangeHeader, 'white');

    var timeBarCellCopy = timeBarCell;
    var rules = sheet.getConditionalFormatRules();
    for (var k = 0; k < timeRangeHeader.length; k++) {
      for (var j = 0; j < ddStartArr.length; j++) {
        var ruleString = '=';
        ruleString = ruleString.concat(
          'IF(AND(',
          timeBarCellCopy.getA1Notation(),
          '>=',
          ddStartArr[j].getA1Notation(),
          ',',
          timeBarCellCopy.getA1Notation(),
          '<',
          ddEndArr[j].getA1Notation(),
          '),1,0)'
        );
        addConditionalRule(rules, timeBarCellCopy, ruleString, randColor);
      }
      
      // Move the cell by 1 column
      timeBarCellCopy = sheet.getRange(
        timeBarCellCopy.getRow(),
        timeBarCellCopy.getColumn() + 1
      );
    }

    sheet.setConditionalFormatRules(rules);

    workerSchedule = sheet.getRange(
      workerSchedule.getRow() + NUMWORKERS + 3,
      COL_OFFSET - 1
    );
  }

  hourTotal = hourTotal.concat(')');
  sheet.getRange(NUMWORKERS + 2, 2).setValue(hourTotal);

  /** Location Validation */
  var locRange = sheet.getRange(NUMWORKERS + 2, 3);
  var locRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LOCATIONS)
    .build();
  locRange.setDataValidation(locRule);
  var locFormula = '';
  locFormula = locFormula.concat('=IF(', locRange.getA1Notation(), ' = "Away", "Out", "In")');

  var status = sheet.getRange(NUMWORKERS + 2, 4);
  // status.setFormula(checkboxFormula);
  status.setFormula(locFormula);
  addStatusRule(status, 'In', '#90EE90');
  addStatusRule(status, 'Out', '#FFCCCB');

  getCurrentShift(NUMWORKERS + 1);

  // sheet.autoResizeColumns(1, COL_OFFSET - 3);
  // sheet.autoResizeColumns(COL_OFFSET - 1, sheet.getLastColumn() - COL_OFFSET + 2);
  // sheet.setColumnWidth(6, 400);
  createDiv('Hours');
}

function getCurrentShift() {
  // if substring of the shift cell matches the index, put respective worker's shifts here
  var shiftCell = sheet.getRange("E1");
  var shiftSubstring = shiftCell.getValue().substring(0, 3);

  var i = 0;
  while (i < WEEKDAYS.length) {
    if (WEEKDAYS[i] === shiftSubstring) {
      var day = i;
      break;
    }
    i++;
  }
  var dayCell = sheet.getRange(1, COL_OFFSET - 1);


  var i = 0;
  while (dayCell.getValue() !== WEEKDAYS[day]) {
    dayCell = sheet.getRange(dayCell.getRow() + 1, COL_OFFSET - 1);

  }
  var shiftRange = sheet.getRange(2, shiftCell.getColumn(), NUMWORKERS);


  var shiftArray2D = [];
  for (var j = 0; j < NUMWORKERS; j++) {
    var shiftArray = [];

    var shiftString = "=CONCATENATE(";
    for (var k = 0; k < NUM_SHIFTS; k++) {
      var startShift = sheet.getRange(
        dayCell.getRow() + j + 1,
        COL_OFFSET + NUM_HOURS / (SHIFT_MINUTES / 60) + k * 3
      );
      var endShift = sheet.getRange(
        startShift.getRow(),
        startShift.getColumn() + 1
      );
      if (k == NUM_SHIFTS - 1) {
        shiftString = shiftString.concat(
          "TEXT(",
          startShift.getA1Notation(),
          ',"HH:MM"),"-",TEXT(',
          endShift.getA1Notation(),
          ',"HH:MM")'
        );
      } else {
        shiftString = shiftString.concat(
          "TEXT(",
          startShift.getA1Notation(),
          ',"HH:MM"),"-",TEXT(',
          endShift.getA1Notation(),
          ',"HH:MM")," | ",'
        );
      }
    }
    shiftString = shiftString.concat(")");
    shiftArray.push(shiftString);
    shiftArray2D.push(shiftArray);
  }
  shiftRange.setValues(shiftArray2D);
}
