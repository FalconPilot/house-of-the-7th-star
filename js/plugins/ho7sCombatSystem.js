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

Scene_Battle.prototype.actorSpriteY = function () {
  return 350;
};

Scene_Battle.prototype.actorSpriteHeight = function () {
  return 140;
};

Scene_Battle.prototype.createStatusWindow = function () {
  const spriteWidth = 80;
  const spacing = 100;
  const party = $gameParty.battleMembers();
  const spriteY = this.actorSpriteY();
  const spriteHeight = this.actorSpriteHeight();
  const positions = [[
    (Graphics.boxWidth - spriteWidth) / 2
  ], [
    (Graphics.boxWidth - spriteWidth) / 2 - spacing / 2,
    (Graphics.boxWidth - spriteWidth) / 2 + spacing / 2
  ], [
    (Graphics.boxWidth - spriteWidth) / 2 - spacing,
    (Graphics.boxWidth - spriteWidth) / 2,
    (Graphics.boxWidth - spriteWidth) / 2 + spacing
  ], [
    (Graphics.boxWidth - spriteWidth) / 2 - spacing * 1.5,
    (Graphics.boxWidth - spriteWidth) / 2 - spacing / 2,
    (Graphics.boxWidth - spriteWidth) / 2 + spacing / 2,
    (Graphics.boxWidth - spriteWidth) / 2 + spacing * 1.5
  ]];
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

Scene_Battle.prototype.createSkillWindow = function() {
  const wy = this._helpWindow.y + this._helpWindow.height;
  const wh = Graphics.boxHeight - this._helpWindow.height;
  this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
  this._skillWindow.setHelpWindow(this._helpWindow);
  this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
  this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
  this.addWindow(this._skillWindow);
};

Scene_Battle.prototype.createItemWindow = function() {
  const wy = this._helpWindow.y + this._helpWindow.height;
  const wh = Graphics.boxHeight - this._helpWindow.height;
  this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
  this._itemWindow.setHelpWindow(this._helpWindow);
  this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
  this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
  this.addWindow(this._itemWindow);
};

Scene_Battle.prototype.createActorWindow = function() {
  // this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
  // this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
  // this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
  // this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.createEnemyWindow = function() {
  // this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
  // this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
  // this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
  // this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
  // this.addWindow(this._enemyWindow);
};

Scene_Battle.prototype.stop = function() {
  Scene_Base.prototype.stop.call(this);
  if (this.needsSlowFadeOut()) {
    this.startFadeOut(this.slowFadeSpeed(), false);
  } else {
    this.startFadeOut(this.fadeSpeed(), false);
  }
  // this._statusWindow.close();
  this._partyCommandWindow.close();
  this._actorCommandWindow.close();
};

Scene_Battle.prototype.updateStatusWindow = function() {
  if ($gameMessage.isBusy()) {
    // this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
  } else if (this.isActive() && !this._messageWindow.isClosing()) {
    // this._statusWindow.open();
  }
};

Scene_Battle.prototype.updateWindowPositions = function() {
  // var statusX = 0;
  // if (BattleManager.isInputting()) {
  //   statusX = this._partyCommandWindow.width;
  // } else {
  //   statusX = this._partyCommandWindow.width / 2;
  // }
  // if (this._statusWindow.x < statusX) {
  //   this._statusWindow.x += 16;
  //   if (this._statusWindow.x > statusX) {
  //     this._statusWindow.x = statusX;
  //   }
  // }
  // if (this._statusWindow.x > statusX) {
  //   this._statusWindow.x -= 16;
  //   if (this._statusWindow.x < statusX) {
  //     this._statusWindow.x = statusX;
  //   }
  // }
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

// BattleManager override

BattleManager.refreshStatus = function() {
  // this._statusWindow.refresh();
};

// BattleStatus new window template

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
