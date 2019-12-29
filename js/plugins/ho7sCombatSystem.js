/*:
 * @plugindesc Combat system for House of the 7th Star
 * @author FalconPilot
*/

// Game_BattlerBase override

Game_BattlerBase.prototype.maxTp = function () {
  return 3;
};

// Game Battler ovderride

Game_Battler.prototype.regenerateTp = function () {
  const value = 1;
  this.gainSilentTp(value);
};

Game_Battler.prototype.initTp = function () {
  this.setTp(0);
};

Game_Battler.prototype.chargeTpByDamage = function () {
};

// Scene_Battle override

Scene_Battle.prototype.createStatusWindow = function () {
  const spriteWidth = 80;
  const spacing = 100;
  const party = $gameParty.battleMembers();
  const spriteY = 350;
  const spriteHeight = 140;
  const positions = [
    [
      (Graphics.boxWidth - spriteWidth) / 2
    ],
    [
      (Graphics.boxWidth - spriteWidth) / 2 - spacing / 2,
      (Graphics.boxWidth - spriteWidth) / 2 + spacing / 2
    ],
    [
      (Graphics.boxWidth - spriteWidth) / 2 - spacing,
      (Graphics.boxWidth - spriteWidth) / 2,
      (Graphics.boxWidth - spriteWidth) / 2 + spacing
    ],
    [
      (Graphics.boxWidth - spriteWidth) / 2 - spacing * 1.5,
      (Graphics.boxWidth - spriteWidth) / 2 - spacing / 2,
      (Graphics.boxWidth - spriteWidth) / 2 + spacing / 2,
      (Graphics.boxWidth - spriteWidth) / 2 + spacing * 1.5
    ]
  ]
  for (var i = 0; i < party.length; i++) {
    const actor = party[i];
    const x = positions[party.length - 1][i];
    const y = spriteY + spriteHeight / 2;
    this.createActorStatus(x, y, spriteWidth, spriteHeight / 2, actor);
  }
  // this._statusWindow = new Window_BattleStatus();
  // this.addWindow(this._statusWindow);
};

Scene_Battle.prototype.createActorStatus = function (x, y, width, height, actor) {
  const actorStatusWindow = new Window_FP_BattleStatus(x, y, width, height, actor);
};

// Window_Base override

Window_Base.prototype.drawPoints = function (x, y, width, amount, max, color1, color2) {
  const minPadding = 1;
  const maxPointWidth = width < (20 + minPadding * 2) * 3;
  const padding = 1;
  const pointWidth = (width / max) - (max * padding * 2);
  const pointY = y + this.lineHeight() - 8;
  for (var i = 0; i < max; i++) {
    const pointX = x + (pointWidth + padding) * i;
    this.contents.fillRect(pointX, pointY, pointWidth, 6, this.gaugeBackColor());
    if (amount - 1 >= i) {
      this.contents.gradientFillRect(pointX, pointY + 1, pointWidth - 1, 6, color1, color2);
    }
  }
};

Window_Base.prototype.drawActorTp = function (actor, x, y, width) {
  width = width || 96;
  var color1 = this.tpGaugeColor1();
  var color2 = this.tpGaugeColor2();
  // this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
  this.drawPoints(x, y, width, actor._tp, actor.maxTp(), color1, color2);
  // this.changeTextColor(this.systemColor());
  // this.drawText(TextManager.tpA, x, y, 44);
  this.changeTextColor(this.tpColor(actor));
  this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};

// BattleStatus changes

function Window_FP_BattleStatus () {
  this.initialize.apply(this, arguments);
};

Window_FP_BattleStatus.prototype = Object.create(Window_Base.prototype);
Window_FP_BattleStatus.prototype.constructor = Window_FP_BattleStatus;

Window_FP_Stats.prototype.initialize = function (x, y, width, height, actor) {
  this._x = x;
  this._y = y;
  this._windowWidth = width;
  this._windowHeight = height;
  this._actor = actor;
  Window.prototype.initialize.call(this);
  // this.loadWindowskin();
  this.move(x, y, width, height);
  this.updatePadding();
  // this.updateBackOpacity();
  // this.updateTone();
  this.createContents();
  this._opening = false;
  this._closing = false;
  this._dimmerSprite = null;
};

Window_FP_Stats.prototype.drawActorStats = function () {
  this.drawText('FooBar', this._x, this._y, this._windowWidth, 'center');
};
