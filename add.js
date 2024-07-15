function addWorker(NAME) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  // Find the last row with content in column A
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;

  // Add the new worker's basic info
  sheet.getRange(newRow, 1).setValue(NAME);
  sheet.getRange(newRow, 2).setFormula(`=SUM(AF${newRow}:AF${newRow+4})`); // Total hours
  sheet.getRange(newRow, 3).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(LOCATIONS).build()); // Location dropdown
  sheet.getRange(newRow, 4).setFormula(`=IF(C${newRow}="Away","Out","In")`); // Status
  sheet.getRange(newRow, 5).setFormula(`=CONCATENATE(TEXT(Y${newRow},"HH:MM"),"-",TEXT(Z${newRow},"HH:MM")," | ",TEXT(AB${newRow},"HH:MM"),"-",TEXT(AC${newRow},"HH:MM"))`); // Fri Shift
  
  // Set up the weekly schedule
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeSlots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  
  for (let i = 0; i < 5; i++) {
    const scheduleRow = lastRow + 2 + (i * (getNumWorkers() + 1));
    
    // Set day of week and worker name
    sheet.getRange(scheduleRow, 6).setValue(daysOfWeek[i]);
    sheet.getRange(scheduleRow, 7).setValue(NAME);

    // Set time slots
    sheet.getRange(scheduleRow, 8, 1, timeSlots.length).setValues([timeSlots]);

    // Set shift dropdowns
    const startHour1 = sheet.getRange(scheduleRow, 24);
    const endHour1 = sheet.getRange(scheduleRow, 25);
    const startHour2 = sheet.getRange(scheduleRow, 27);
    const endHour2 = sheet.getRange(scheduleRow, 28);

    const timeValidation = SpreadsheetApp.newDataValidation().requireValueInList(['Away'].concat(timeSlots).concat(['17:00'])).build();

    startHour1.setDataValidation(timeValidation).setValue('9:00');
    endHour1.setDataValidation(timeValidation).setValue('17:00');
    startHour2.setDataValidation(timeValidation).setValue('Away');
    endHour2.setDataValidation(timeValidation).setValue('Away');

    // Set up formulas for hours calculation
    sheet.getRange(scheduleRow, 26).setFormula(`=IF(OR(X${scheduleRow}="Away",Y${scheduleRow}="Away"),0,(Y${scheduleRow}-X${scheduleRow})*24)`);
    sheet.getRange(scheduleRow, 29).setFormula(`=IF(OR(AA${scheduleRow}="Away",AB${scheduleRow}="Away"),0,(AB${scheduleRow}-AA${scheduleRow})*24)`);
    sheet.getRange(scheduleRow, 32).setFormula(`=SUM(Z${scheduleRow},AC${scheduleRow})`);

    // Set up conditional formatting for the time bar
    const timeBar = sheet.getRange(scheduleRow, 8, 1, timeSlots.length);
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(`=OR(AND($X${scheduleRow}<>"",$Y${scheduleRow}<>"",H$1>=$X${scheduleRow},H$1<$Y${scheduleRow}),AND($AA${scheduleRow}<>"",$AB${scheduleRow}<>"",H$1>=$AA${scheduleRow},H$1<$AB${scheduleRow}))`)
      .setBackground(getWorkerColor(NAME))
      .setRanges([timeBar])
      .build();
    const rules = sheet.getConditionalFormatRules();
    rules.push(rule);
    sheet.setConditionalFormatRules(rules);
  }

  // Refresh the sheet
  SpreadsheetApp.flush();
}

function getNumWorkers() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  let count = 0;
  for (let i = 2; i <= lastRow; i++) {
    if (sheet.getRange(i, 1).getValue() !== '') {
      count++;
    }
  }
  return count;
}

function getWorkerColor(name) {
  // Implement a color selection logic here
  // For example, you could use a predefined list of colors and cycle through them
  const colors = ['#FF6361', '#BC5090', '#58508D', '#003F5C', '#FFA600'];
  const index = name.length % colors.length;
  return colors[index];
}