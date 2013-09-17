'use strict';

function LEDGrid(canvas, rows, columns, grid) {
  this.ctx = canvas.getContext('2d');
  this.rows = rows;
  this.columns = columns;
  this.grid = grid;
}

LEDGrid.prototype.clear = function() {
  this.ctx.fillStyle = '#222';
  this.ctx.fillRect(0, 0, this.width, this.height);
};

LEDGrid.prototype.renderLEDs = function() {
  this.ledSpacing = this.width / this.columns;
  this.ledRadius = this.ledSpacing * 0.1;

  this.ledGradient = this.ctx.createRadialGradient(0, 0, this.ledRadius * 0.25, 0, 0, this.ledRadius);
  this.ledGradient.addColorStop(0, '#DEF7FF');
  this.ledGradient.addColorStop(1, '#00BFFF');
  this.ctx.fillStyle = this.ledGradient;

  for (var row = 0; row < this.rows; row++) {
    for (var col = 0; col < this.columns; col++) {
      if (this.grid[row * this.columns + col])
        this.illuminateLED(row, col);
    }
  }
};

LEDGrid.prototype.illuminateLED = function(row, column) {
  var x = this.ledSpacing * column + this.ledSpacing * 0.5;
  var y = this.ledSpacing * row + this.ledSpacing * 0.5;
  this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.ledRadius, 0, Math.PI * 2.0);
    this.ctx.fill();
  this.ctx.restore();
};

LEDGrid.prototype.render = function() {
  this.width = this.ctx.canvas.width;
  this.height = this.ctx.canvas.height;
  this.clear();
  this.renderLEDs();
};
