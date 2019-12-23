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
  return [ 2, 3, 4, 5, 6, 7 ];
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

Window_FP_Stats.prototype.initialize = function (actor) {
  this._actor = actor;
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
  this._list.push({
    name: name,
    symbol: symbol
  });
};

Window_FP_Stats.prototype.refresh = function () {
  this.clearCommandList();
  this.makeCommandList();
  this.createContents();
  Window_Selectable.prototype.refresh.call(this);
  console.log('Refreshing !');
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

Window_FP_Stats.prototype.drawItem = function (index) {
  const rect = this.itemRectForText(index);
  const align = this.itemTextAlign();
  const valueSize = this.statValueSize();
  const paramId = this._actor.getAdvanceable()[index];
  const param = this._actor.paramBase(paramId);
  const iconSize = 48;

  this.resetTextColor();
  this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
  this.drawText(param, rect.width - valueSize - iconSize, rect.y, valueSize, 'right');
  this.drawIcon(16, rect.width - iconSize, rect.y);
  this.drawIcon(17, rect.width - valueSize - iconSize, rect.y);
};

Window_FP_Stats.prototype.itemTextAlign = function () {
  return 'left';
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
  this._statWindow = new Window_FP_Stats(this.actor());
  this.addWindow(this._statWindow);
};
