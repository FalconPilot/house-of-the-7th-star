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

Window_FP_Stats.prototype.initialize = function (x, y) {
  this.clearCommandList();
  this.makeCommandList();
  const width = this.windowWidth();
  const height = this.windowHeight();
  Window_Selectable.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
  this.select(0);
  this.activate();
};

Window_FP_Stats.prototype.windowWidth = function () {
  return 300;
};

Window_FP_Stats.prototype.windowHeight = function () {
  return this.fittingHeight(10);
};

Window_FP_Stats.prototype.clearCommandList = function () {
  this._list = [];
};

Window_FP_Stats.prototype.makeCommandList = function () {
  
};

Window_FP_Stats.prototype.refresh = function () {
  this.clearCommandList();
  this.makeCommandList();
  this.createContents();
  Window_Selectable.prototype.refresh.call(this);
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

Scene_FP_StatsMenu.prototype.create = function () {
  Scene_MenuBase.prototype.create.call(this);
  this.createStatWindow();
};

Scene_FP_StatsMenu.prototype.start = function () {
  Scene_MenuBase.prototype.start.call(this);
};

Scene_FP_StatsMenu.prototype.createStatWindow = function () {
  this._statWindow = new Window_FP_Stats(0, 0);
  this.addWindow(this._statWindow);
};
