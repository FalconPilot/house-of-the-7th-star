/*:
 * @plugindesc Combat system for House of the 7th Star
 * @author FalconPilot
*/

// Game_BattlerBase override

Game_BattlerBase.prototype.maxTp = function () {
  return 3;
};

// Game Battler override

Game_Battler.prototype.regenerateTp = function () {
  const value = 1;
  this.gainSilentTp(value);
};

Game_Battler.prototype.initTp = function () {
  this.setTp(0);
};

Game_Battler.prototype.chargeTpByDamage = function () {
};

// Game Actor override

Game_Actor.prototype.wdmg = function() {
  return this.weapons().reduce(function (dmg, weapon) {
    return dmg + 0;
  }, 0);
};

// Scene_Battle override

Scene_Battle.prototype.actorSpriteY = function () {
  return 300;
};

Scene_Battle.prototype.actorSpriteHeight = function () {
  return 140;
};

Scene_Battle.prototype.actorSpriteWidth = function () {
  return 80;
};

Scene_Battle.prototype.actorSpriteSpacing = function () {
  return this.actorSpriteWidth();
};

Scene_Battle.prototype.createStatusWindow = function () {
  this._statusWindows = [];
  const spriteWidth = this.actorSpriteWidth();
  const spacing = this.actorSpriteSpacing() + this.actorSpriteWidth();
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
    console.log('Member ' + (i + 1));
    const actor = party[i];
    const x = positions[party.length - 1][i];
    const y = spriteY + spriteHeight / 2;
    this.createActorStatus(x, y, spriteWidth, spriteHeight / 2, actor);
  }
  // this._statusWindow = new Window_BattleStatus();
  // this.addWindow(this._statusWindow);
};

Scene_Battle.prototype.createActorStatus = function (x, y, width, height, actor) {
  const window = new Window_FP_BattleStatus(x, y, width, height, actor);
  this._statusWindows.push(window);
  this.addWindow(window);
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
  const y = Graphics.boxHeight - this._actorCommandWindow.windowHeight();
  this._actorWindow = new Window_BattleActor(0, y);
  this._actorWindow.setHandler('ok',     this.onActorOk.bind(this));
  this._actorWindow.setHandler('cancel', this.onActorCancel.bind(this));
  this.addWindow(this._actorWindow);
};

Scene_Battle.prototype.createEnemyWindow = function() {
  const y = Graphics.boxHeight - this._actorCommandWindow.windowHeight();
  this._enemyWindow = new Window_BattleEnemy(0, y);
  this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
  this._enemyWindow.setHandler('ok',     this.onEnemyOk.bind(this));
  this._enemyWindow.setHandler('cancel', this.onEnemyCancel.bind(this));
  this.addWindow(this._enemyWindow);
};

Scene_Battle.prototype.startPartyCommandSelection = function() {
  this.refreshStatus();
  // this._statusWindow.deselect();
  // this._statusWindow.open();
  this._actorCommandWindow.close();
  this._partyCommandWindow.setup();
};

Scene_Battle.prototype.endCommandSelection = function() {
  this._partyCommandWindow.close();
  this._actorCommandWindow.close();
  // this._statusWindow.deselect();
};

Scene_Battle.prototype.stop = function() {
  Scene_Base.prototype.stop.call(this);
  if (this.needsSlowFadeOut()) {
    this.startFadeOut(this.slowFadeSpeed(), false);
  } else {
    this.startFadeOut(this.fadeSpeed(), false);
  }
  this._statusWindows.forEach(function (window) {
    window.close();
  });
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

Scene_Battle.prototype.refreshStatus = function() {
  this._statusWindows.forEach(function (window) {
    window.refresh();
  });
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

Scene_Battle.prototype.startActorCommandSelection = function() {
  this._partyCommandWindow.close();
  this._actorCommandWindow.setup(BattleManager.actor());
};

Scene_Battle.prototype.createDisplayObjects = function() {
  this.createSpriteset();
  this.createWindowLayer();
  this.createAllWindows();
  BattleManager.setLogWindow(this._logWindow);
  BattleManager.setStatusWindow(this._statusWindows);
  BattleManager.setSpriteset(this._spriteset);
  this._logWindow.setSpriteset(this._spriteset);
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

Window_Base.prototype.hpGaugeColor1 = function() {
  return this.textColor(10);
};

Window_Base.prototype.gaugeBorderColor = function () {
  return this.textColor();
};

Window_Base.prototype.drawBorderedGauge = function (x, y, width, rate, color1, color2) {
  const gaugeY = y + this.lineHeight() - 8;
  this.contents.fillRect(x, gaugeY - 1, width + 2, 8, this.gaugeBackColor());
  this.drawGauge(x + 1, y, width - 2, rate, color1, color2);
};

// BattleManager override

BattleManager.refreshStatus = function() {
  this._statusWindows.forEach(function (window) {
    window.refresh();
  });
};

BattleManager.setStatusWindow = function (statusWindows) {
  this._statusWindows = statusWindows;
};

// BattleStatus new window template

function Window_FP_BattleStatus () {
  this.initialize.apply(this, arguments);
};

Window_FP_BattleStatus.prototype = Object.create(Window_Base.prototype);
Window_FP_BattleStatus.prototype.constructor = Window_FP_BattleStatus;

Window_FP_BattleStatus.prototype.initialize = function (x, y, width, height, actor) {
  this._actor = actor;
  Window.prototype.initialize.call(this);
  this.loadWindowskin();
  this.move(x, y, width, height);
  this.updatePadding();
  this.updateBackOpacity();
  this.updateTone();
  this.createContents();
  this._opening = false;
  this._closing = false;
  this._dimmerSprite = null;
  this.drawActorStats();
};

Window_FP_BattleStatus.prototype.contentsWidth = function() {
  return this.width;
};

Window_FP_BattleStatus.prototype.contentsHeight = function() {
  return this.height;
};

Window_FP_BattleStatus.prototype.updatePadding = function () {
  this.padding = 0;
};

Window_FP_BattleStatus.prototype.updateBackOpacity = function () {
  this.opacity = 50;
};

Window_FP_BattleStatus.prototype.drawActorStats = function () {
  // this.resetTextColor();
  // this.setOpacity(255);
  this.drawParamGauge(0, this._actor.hp, this._actor.mhp, this._actor.hpRate(), this.hpGaugeColor1(), this.hpGaugeColor2());
};

Window_FP_BattleStatus.prototype.drawParamGauge = function (y, value, max, rate, color1, color2) {
  const slashWidth = 6;
  const width = (this.width - slashWidth) / 2;
  this.contents.fontSize = 12;
  this.drawText(value, 0, y, width, 'right');
  this.drawText('/', width, y, slashWidth, 'center');
  this.drawText(max, width + slashWidth, y, width, 'left');
  this.drawBorderedGauge(0, y, this.width, rate, color1, color2);
};

Window_FP_BattleStatus.prototype.drawPoints = function (y, value, max, color) {
  this.spacing = 4;
  this.draw
}

Window_FP_BattleStatus.prototype.refresh = function () {
  this.contents.clear();
  this.createContents();
  this.drawActorStats();
};
