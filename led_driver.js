var b = require('bonescript');

var MAX_WIDTH = 64;
var MAX_HEIGHT = 64;
var UPDATE_FREQUENCY = 20;

var generatorFn = function() {};
var buffer = new Uint8Array(MAX_WIDTH * MAX_HEIGHT);
var rows = 4;
var columns = 4;
var userState = {};
var curColumn = 0;

var columnPins = ['P9_13', 'P9_14', 'P9_15', 'P9_16'];
var rowPins = ['P8_7', 'P8_8', 'P8_9', 'P8_10'];

exports.updateGenerator = function(codeStr) {
  generatorFn = new Function('state', 'time', 'rows', 'columns', 'grid', codeStr);
  userState = {};
  console.log('New generator function installed:');
  console.log(generatorFn.toString());
};

function tick() {
  generatorFn(userState, new Date().getTime(), rows, columns, buffer);
  setTimeout(tick, UPDATE_FREQUENCY);
}


function clear() {
  columnPins.forEach(function(col) {
    b.pinMode(col, b.OUTPUT);
    b.digitalWrite(col, b.LOW);
  });
  rowPins.forEach(function(row) {
    b.pinMode(row, b.OUTPUT);
    b.digitalWrite(row, b.LOW);
  });
}

function scan() {
  clear()
  lightColumn(curColumn);
  curColumn = (curColumn + 1) % columns;
}

function lightColumn(colIdx) {
  b.digitalWrite(columnPins[colIdx], b.HIGH);
  for (var row = 0; row < rows; row++) {
    b.digitalWrite(rowPins[row], buffer[row * columns + colIdx] == 0 ? b.LOW : b.HIGH);
  }
}


tick();
setInterval(scan, 5);
