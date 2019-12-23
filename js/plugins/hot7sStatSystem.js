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
  const width = this.windowWidth();
  const height = this.windowHeight();
  const x = 0;
  const y = 0;
  Window_Selectable.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
  this.select(0);
  this.activate();
  console.log(this._list);
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

Window_FP_Stats.prototype.addCommand = function(name, symbol, enabled = true, ext = undefined) {
  this._list.push({
    name: name,
    symbol: symbol,
    enabled: enabled,
    ext: ext
  });
};

Window_FP_Stats.prototype.refresh = function () {
  this.clearCommandList();
  this.makeCommandList();
  this.createContents();
  Window_Selectable.prototype.refresh.call(this);
};

Window_FP_Stats.prototype.isCommandEnabled = function (index) {
  return this._list[index].enabled;
};

Window_FP_Stats.prototype.commandName = function(index) {
  return this._list[index].name;
};

Window_FP_Stats.prototype.drawItem = function (index) {
  var rect = this.itemRectForText(index);
  var align = this.itemTextAlign();
  this.resetTextColor();
  this.changePaintOpacity(this.isCommandEnabled(index));
  this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
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
