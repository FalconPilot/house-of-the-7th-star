/*:
 * @plugindesc StatMenu and system for House of the 7th Star
 * @author FalconPilot
*/

// Game Actor modifications

Game_Actor.prototype.paramBase = function (paramId) {
  const advance = Number(this._advances[paramId] || 0);
  return this.currentClass().params[paramId][this._level] + advance;
};

Game_Actor.prototype.getAdvanceable = function () {
  return [2, 3, 4, 5, 6, 7];
};

Game_Actor.prototype.initAdvances = function () {
  this._advances = this.getAdvanceable().reduce(function (acc, id) {
    const item = {};
    item[id] = 0;
    return Object.assign(acc, item);
  }, {});
};

Game_Actor.prototype.increaseAdvance = function (paramId, amount) {
  const advance = this._advances[paramId];
  if (advance) {
    this._advances[paramId] += amount;
  }
};

Game_Actor.prototype.advancePoints = function () {
  return this.availableAdvances() - this.advancesTaken();
};

Game_Actor.prototype.advancesTaken = function () {
  return Object.values(this._advances).reduce(function (total, val) {
    return total + val;
  }, 0);
};

Game_Actor.prototype.availableAdvances = function () {
  return Math.floor(this._level / 2) * 3;
};

Game_Actor.prototype.setup = function(actorId) {
  var actor = $dataActors[actorId];
  this._actorId = actorId;
  this._name = actor.name;
  this._nickname = actor.nickname;
  this._profile = actor.profile;
  this._classId = actor.classId;
  this._level = actor.initialLevel;
  this.initImages();
  this.initAdvances();
  this.initExp();
  this.initSkills();
  this.initEquips(actor.equips);
  this.clearParamPlus();
  this.recoverAll();
};

// Stat window

function Window_FP_Stats () {
  this.initialize.apply(this, arguments);
};

Window_FP_Stats.prototype = Object.create(Window_Selectable.prototype);
Window_FP_Stats.prototype.constructor = Window_FP_Stats;

Window_FP_Stats.prototype.initialize = function (actor, interactive = false) {
  this._actor = actor;
  this._interactive = interactive;
  this._advancesBuffer = actor.getAdvanceable().map(function () { return 0; });
  this.clearCommandList();
  this.makeCommandList();
  const padding = this.horizontalPadding();
  const width = this.windowWidth() - padding * 2;
  const height = this.windowHeight();
  const x = padding;
  const y = Math.floor(Graphics.boxHeight - height) / 2;
  Window_Selectable.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
  this.select(0);
  this.activate();
};

Window_FP_Stats.prototype.isInteractive = function () {
  return this._interactive;
};

Window_FP_Stats.prototype.horizontalPadding = function () {
  return 10;
};

Window_FP_Stats.prototype.windowWidth = function () {
  return Graphics.boxWidth;
};

Window_FP_Stats.prototype.windowHeight = function () {
  return this.fittingHeight(this._actor.getAdvanceable().length);
};

Window_FP_Stats.prototype.clearCommandList = function () {
  this._list = [];
};

Window_FP_Stats.prototype.makeCommandList = function () {
  const advanceable = this._actor.getAdvanceable();
  for (var i = 0; i < advanceable.length; i++) {
    const id = advanceable[i];
    this.addCommand(TextManager.param(id), 'advance_' + id);
  }
};

Window_FP_Stats.prototype.addCommand = function(name, symbol) {
  this._list.push({ name: name, symbol: symbol });
};

Window_FP_Stats.prototype.refresh = function () {
  this.clearCommandList();
  this.makeCommandList();
  this.createContents();
  Window_Selectable.prototype.refresh.call(this); 
};

Window_FP_Stats.prototype.selectWidth = function () {
  return 300;
};

Window_FP_Stats.prototype.itemWidth = function() {
  return this.selectWidth() + this.padding * 2;
};

Window_FP_Stats.prototype.commandName = function (index) {
  return this._list[index].name;
};

Window_FP_Stats.prototype.maxItems = function() {
  return this._list.length;
};

Window_FP_Stats.prototype.numVisibleRows = function() {
  return Math.ceil(this.maxItems() / this.maxCols());
};

Window_FP_Stats.prototype.statValueSize = function () {
  return 30;
};

Window_FP_Stats.prototype.setOpacity = function (value) {
  this.contents.paintOpacity = value;
};

Window_FP_Stats.prototype.distributedPoints = function () {
  return this._advancesBuffer.reduce(function (total, amt) {
    return total + amt;
  }, 0);
};

Window_FP_Stats.prototype.pointsLeft = function () {
  return this._actor.advancePoints() - this.distributedPoints();
};

Window_FP_Stats.prototype.drawItem = function (index) {
  const interactive = this.isInteractive()
  const rect = this.itemRectForText(index);
  const valueSize = this.statValueSize();
  const paramId = this._actor.getAdvanceable()[index];
  const param = this._actor.paramBase(paramId) + this._advancesBuffer[index];
  const iconSize = 32;
  const valueX = rect.width - valueSize - (interactive ? iconSize : 0);

  this.resetTextColor();
  this.setOpacity(255);
  this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'left');
  this.drawText(param, valueX, rect.y, valueSize, 'center');

  if (this._interactive) {
    const transluscent = 80;
    const leftOpacity = this._advancesBuffer[index] > 0 ? 255 : transluscent;
    const rightOpacity = this.pointsLeft() > 0 ? 255 : transluscent;
    this.setOpacity(leftOpacity);
    this.drawIcon(17, rect.width - valueSize - iconSize * 2, rect.y);
    this.setOpacity(rightOpacity);
    this.drawIcon(16, rect.width - iconSize, rect.y);
  }
};

Window_FP_Stats.prototype.cursorRight = function () {
  const index = this.index();
  if (this.pointsLeft() > 0) {
    this._advancesBuffer[index] += 1;
  }
  this.refresh();
};

Window_FP_Stats.prototype.cursorLeft = function () {
  const index = this.index();
  if (this._advancesBuffer[index] > 0) {
    this._advancesBuffer[index] -= 1;
  }
  this.refresh();
};

// StatsMenu Scene

function Scene_FP_StatsMenu () {
  this.initialize.apply(this, arguments);
};

Scene_FP_StatsMenu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_FP_StatsMenu.prototype.constructor = Scene_FP_StatsMenu;

Scene_FP_StatsMenu.prototype.initialize = function () {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_FP_StatsMenu.prototype.actor = function () {
  return $gameParty.menuActor();
};

Scene_FP_StatsMenu.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  this.createStatWindow();
};

Scene_FP_StatsMenu.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
};

Scene_FP_StatsMenu.prototype.createStatWindow = function () {
  this._statWindow = new Window_FP_Stats(this.actor(), true);
  this.addWindow(this._statWindow);
};
