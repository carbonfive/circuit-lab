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
    return new Function('state', 'time', 'rows', 'columns', 'grid', fnStr);
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
    generateFn(userState, new Date().getTime(), ledPanel.rows, ledPanel.columns, ledPanel.buf);
    grid.render();
    setTimeout(tick, 5);
  }

  initUI();
  tick();
});