'use strict';

// LED at (x, y) is at grid[y * columns + x]
// 0, 0 is upper left
/*
function test(state, rows, columns, grid) {
  if (!state.initialized) {
    state.x = 0;
    state.y = 0;
    state.dx = 1;
    state.dy = 1;
    state.initialized = true;
  }

  var now = parseInt(state.time / 100);

// Update only every second
  if (now == state.lastUpdate) {
    return;
  }

// clear the grid
  for (var i = 0; i < grid.length; i++) {
    grid[i] = 0;
  }

  if ((state.x + state.dx >= columns) || (state.x + state.dx < 0)) {
    state.dx = -state.dx;
  }

  if ((state.y + state.dy >= rows) || (state.y + state.dy < 0)) {
    state.dy = -state.dy;
  }

  state.x += state.dx;
  state.y += state.dy;
  grid[state.y * columns + state.x] = 1;

  state.lastUpdate = now;
}

var testFnStr = test.toString().replace(/function \w+\(.*?\) {/, '').replace(/}$/, '');
*/


$(function() {

  var gridRows = 16;
  var gridCols = 32;
  var userState = {};
  var buf = new Uint8Array(gridRows * gridCols);

  var canvas = document.querySelector('#led-grid');
  var canvasWidth = canvas.clientWidth;

  var grid = window.grid = new LEDGrid(canvas, gridRows, gridCols, buf);

  function resizeCanvas(force) {
    if (force || (canvasWidth != canvas.clientWidth)) {
      console.log('Resizing canvas.');
      canvasWidth = canvas.clientWidth;
      canvas.width = canvasWidth;
      canvas.height = canvasWidth / (gridCols / gridRows);
      grid.render(gridRows, gridCols, buf);
    }
  }

  $(window).on('resize', function() { resizeCanvas(); });
  resizeCanvas(true);

  function generateGenerator(fnStr) {
    return new Function('state', 'rows', 'columns', 'grid', fnStr);
  }
  var generateFn = generateGenerator('');

  function initUI() {
    $('#load-from-url').on('click', function() {
      var url = $('input[name=url]').val();
      $.get('/proxy', { url: url }).then(function(data) {
        $('textarea[name=generator-fn]').val(data);
      });
    });

    $('#update-generator').on('click', function() {
      userState = {};
      generateFn = generateGenerator($('textarea[name=generator-fn]').val());
    })
  }

  initUI();


  function tick() {
    userState.time = new Date().getTime();
    generateFn(userState, gridRows, gridCols, buf);
    grid.render();
    setTimeout(tick, 20);
  }

  tick();

});