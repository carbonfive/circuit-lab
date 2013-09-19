var fs = require('fs');
var b = require('bonescript');
var c5bone = require('./c5bone');
var Canvas = require('canvas');

var MAX_WIDTH = 64;
var MAX_HEIGHT = 64;
var UPDATE_FREQUENCY = 20;
var SCAN_INTERVAL = 1;

var generatorFn = function() {};
var buffer = new Uint8Array(MAX_WIDTH * MAX_HEIGHT);
var rows = 4;
var columns = 4;
var userState = {};
var curColumn = 0;
var canvas, ctx;

var columnPins = ['P9_13', 'P9_14', 'P9_15', 'P9_16'];
var rowPins = ['P8_7', 'P8_8', 'P8_9', 'P8_10'];
var pins = {};

function initPin(pin) {
  b.pinMode(pin, b.OUTPUT);
  var filename = '/sys/class/gpio/gpio' + c5bone.pins[pin].gpio + '/value';
  pins[pin] = {
    ofp: fs.openSync(filename, 'w'),
    filename: filename
  }
  digitalWrite(pin, b.LOW);
}

function init() {
  columnPins.forEach(function(pinName) {
    initPin(pinName);
  });
  rowPins.forEach(function(pinName) {
    initPin(pinName);
  });
  canvas = new Canvas(columns,rows);
  ctx = canvas.getContext('2d');
  ctx.setGrid = setGrid;
}

function setGrid(grid) {
	var data = this.getImageData(0,0,columns,rows).data;
	for (var i=0; i<data.length/4; i++)
		grid[i] = data[i*4]/255 > .5 ? 1 : 0;
}

function digitalWrite(pin, value) {
  fs.writeSync(pins[pin].ofp, value, 0);
};

exports.updateGenerator = function(codeStr) {
  generatorFn = new Function('state', 'time', 'rows', 'columns', 'grid', 'ctx', codeStr);
  userState = {};
  console.log('New generator function installed:');
  console.log(generatorFn.toString());
};

function tick() {
  generatorFn(userState, new Date().getTime(), rows, columns, buffer, ctx);
  setTimeout(tick, UPDATE_FREQUENCY);
}


function clear() {
  columnPins.forEach(function(col) {
    digitalWrite(col, b.LOW);
  });
  rowPins.forEach(function(row) {
    digitalWrite(row, b.LOW);
  });
}

function scan() {
  clear()
  lightColumn(curColumn);
  curColumn = (curColumn + 1) % columns;
}

function lightColumn(colIdx) {
  digitalWrite(columnPins[colIdx], b.HIGH);
  for (var row = 0; row < rows; row++) {
    digitalWrite(rowPins[row], buffer[row * columns + colIdx] == 0 ? b.LOW : b.HIGH);
  }
}

init();
tick();
setInterval(scan, SCAN_INTERVAL);
