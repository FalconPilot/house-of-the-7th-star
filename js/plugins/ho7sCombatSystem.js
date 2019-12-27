/*:
 * @plugindesc Combat system for House of the 7th Star
 * @author FalconPilot
*/

// Game_BattlerBase override

Game_BattlerBase.prototype.maxTp = function() {
  return 3;
};

// Game Battler ovderride

Game_Battler.prototype.regenerateTp = function() {
  const value = 1;
  this.gainSilentTp(value);
};

Game_Battler.prototype.initTp = function() {
  this.setTp(0);
};

// Window_Base override

Window_Base.prototype.drawPoints = function (x, y, width, amount, max, color1, color2) {
  const padding = 1;
  const pointWidth = (width / max) - (max * padding * 2);
  for (var i = 0; i < max; i++) {
    // const gaugeY = y + this.lineHeight() - 8;
    const pointX = x + (pointWidth + padding) * i;
    this.contents.fillRect(pointX, y, pointWidth, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(pointX, y, pointWidth, 6, color1, color2);
  }
};

Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
  width = width || 96;
  var color1 = this.tpGaugeColor1();
  var color2 = this.tpGaugeColor2();
  // this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
  this.drawPoints(x, y, width, actor._tp, actor.maxTp(), color1, color2);
  this.changeTextColor(this.systemColor());
  this.drawText(TextManager.tpA, x, y, 44);
  this.changeTextColor(this.tpColor(actor));
  this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};
