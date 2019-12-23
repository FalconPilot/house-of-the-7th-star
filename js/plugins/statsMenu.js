/*:
 * @plugindesc StatMenu for House of the 7th Star
 * @author FalconPilot
*/

// Stat window

function Window_FP_Stats () {
  this.initialize.apply(this, arguments);
};

Window_FP_Stats.prototype = Object.create(Window_Base.prototype);
Window_FP_Stats.prototype.constructor = Window_FP_Stats;

Window_FP_Stats.prototype.initialize = function (x, y) {
  const width = this.windowWidth();
  const height = this.windowHeight();
  Window_Base.prototype.initialize.call(this, x, y, width, height);
  this.refresh();
};

Window_FP_Stats.prototype.windowWidth = function () {
  return 300;
};

Window_FP_Stats.prototype.windowHeight = function () {
  return this.fittingHeight(10);
};

Window_FP_Stats.prototype.refresh = function () {
  console.log('TODO');
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
