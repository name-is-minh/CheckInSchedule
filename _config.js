// get active sheet
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getActiveSheet();

// setup parameters
var SHIFT_MINUTES = 30;
var NUM_HOURS = 8;
var NUM_SHIFTS = 2;
var COL_OFFSET = 9;
var LOCATIONS = ['Away', 'Blocker', 'Henderson', 'Remote'];
var COLORS = ['#ffa600', '#003f5c', '#58508d', '#bc5090', '#ff6361'];
var WORKERS = sheet.getRange('A2:A');
var NUMWORKERS = getArrayNoBlanks(WORKERS).length;
// set up weekday interval
var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var WORKWEEK = WEEKDAYS.slice(1, 6); // Mon-Fri

//menu
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📅 Schedule Management 📂')
    .addItem('Add Worker', 'addWorkerMenu')
    .addItem('Remove Worker', 'removeWorkerMenu')
    .addToUi();
  getCurrentShift();
}

function addWorkerMenu() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'Add Student Worker to Schedule',
    'Full Name',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() == ui.Button.OK) {
    if (response.getResponseText() == '') {
      ui.alert('Name field cannot be empty.', ui.ButtonSet.OK);
    } else {
      addWorker(response.getResponseText());
    }
  }
}
function removeWorkerMenu() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    'Remove Student Worker from Schedule',
    'Full Name',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() == ui.Button.OK) {
    if (response.getResponseText() == '') {
      ui.alert('Name field cannot be empty.', ui.ButtonSet.OK);
    } else {
      removeWorker(response.getResponseText());
    }
  }
}