'use strict';

function LEDGrid(canvas, panel) {
  this.ctx = canvas.getContext('2d');
  this.panel = panel;
}

LEDGrid.prototype.clear = function() {
  this.ctx.fillStyle = '#222';
  this.ctx.fillRect(0, 0, this.width, this.height);
};

LEDGrid.prototype.renderLEDs = function() {
  this.ledSpacing = this.width / this.panel.columns;
  this.ledRadius = this.ledSpacing * 0.1;

  this.ledGradient = this.ctx.createRadialGradient(0, 0, this.ledRadius * 0.25, 0, 0, this.ledRadius);
  this.ledGradient.addColorStop(0, '#DEF7FF');
  this.ledGradient.addColorStop(1, '#00BFFF');
  this.ctx.fillStyle = this.ledGradient;

  for (var row = 0; row < this.panel.rows; row++) {
    for (var col = 0; col < this.panel.columns; col++) {
      if (this.panel.buf[row * this.panel.columns + col])
        this.drawLED(row, col, this.ledGradient);
      else
        this.drawLED(row, col, '#444');
    }
  }
};

LEDGrid.prototype.drawLED = function(row, column, fill) {
  var x = this.ledSpacing * column + this.ledSpacing * 0.5;
  var y = this.ledSpacing * row + this.ledSpacing * 0.5;
  this.ctx.save();
    this.ctx.fillStyle = fill;
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