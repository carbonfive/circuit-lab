'use strict';

$(function() {
  var ledPanel = {
    setSize: function(rows, columns) {
      this.rows = rows;
      this.columns = columns;
      this.buf = new Uint8Array(rows * columns)
    }
  };
  ledPanel.setSize(8, 16);

  var userState = {};

  var canvas = document.querySelector('#led-grid');
  var canvasWidth = canvas.clientWidth;
  var playCanvas = document.querySelector('#play-canvas');
  playCanvas.width = 16;
  playCanvas.height = 8;
  var playCtx = playCanvas.getContext('2d');
  playCtx.setGrid = function(grid) {
    var data = this.getImageData(0,0,this.canvas.width,this.canvas.height).data;
    for (var i=0; i<data.length/4; i++)
      grid[i] = data[i*4]/255 > .5 ? 1 : 0;
  }

  var grid = new LEDGrid(canvas, ledPanel);

  function resizeCanvas(force) {
    if (force || (canvasWidth != canvas.clientWidth)) {
      console.log('Resizing canvas.');
      canvasWidth = canvas.clientWidth;
      canvas.width = canvasWidth;
      canvas.height = canvasWidth / (ledPanel.columns / ledPanel.rows);
      grid.render();
    }
  }

  $(window).on('resize', function() { resizeCanvas(); });
  resizeCanvas(true);

  function generateGenerator(fnStr) {
    return new Function('state', 'time', 'rows', 'columns', 'grid', 'ctx', fnStr);
  }
  var generateFn = generateGenerator('');

  function initUI() {
    $('form#load-code').on('submit', function(e) {
      e.preventDefault();
      $.get('/proxy', { url: $('#code-url').val() }).then(function(data) {
        editor.getSession().setValue(data);
      });
    });

    // Grid dimensions form
    $('#grid-columns').val(ledPanel.columns);
    $('#grid-rows').val(ledPanel.rows);
    $('#grid-dimensions').on('submit', function(e) {
      e.preventDefault();
      ledPanel.setSize(parseInt($('#grid-rows').val()), parseInt($('#grid-columns').val()));
      userState = {};
      resizeCanvas(true);
      playCanvas.width = ledPanel.columns;
      playCanvas.height = ledPanel.rows;
    });

    $('#update-generator').on('click', function() {
      userState = {};
      generateFn = generateGenerator(editor.getSession().getValue());
    });

    $('#update-driver').on('click', function() {
      $.post('/update_driver', { code: editor.getSession().getValue() });
    });
  }

  function tick() {
    generateFn(userState, new Date().getTime(), ledPanel.rows, ledPanel.columns, ledPanel.buf, playCtx);
    grid.render();
    setTimeout(tick, 5);
  }

  initUI();
  tick();
});
