var MAX_WIDTH = 64;
var MAX_HEIGHT = 64;
var UPDATE_FREQUENCY = 100;

var generatorFn = function() {};
var buffer = new Uint8Array(MAX_WIDTH * MAX_HEIGHT);
var rows = 8;
var columns = 16;
var userState = {};
var curScanColumn = 0;

exports.updateGenerator = function(codeStr) {
  generatorFn = new Function('state', 'time', 'rows', 'columns', 'grid', codeStr);
  console.log('New generator function installed:');
  console.log(generatorFn.toString());
};

function tick() {
  generatorFn(userState, new Date().getTime(), rows, columns, buffer);
  setTimeout(tick, UPDATE_FREQUENCY);
}

function setColumnStates() {
  // clear all columns
  // set line HI/LO for curScanColumn
}

function setRowState(idx, state) {
  // set line HI/LO for row idx
}

function lightEmUp() {
  setColumnStates();
  for (var row = 0; row < rows; row++) {
    setRowState(row, buffer[row * columns + curScanColumn] != 0)
  }
  setTimeout(lightEmUp, 5);
}

tick();
lightEmUp();