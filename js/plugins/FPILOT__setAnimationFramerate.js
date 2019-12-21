/*:
 * @plugindesc This plugin allows you to simply modify the in-game animations framerate.
 * @author FalconPilot
 * 
 * @param FPS
 * @desc The amount of FPS (Frames Per Second) for in-game animations. Must be set between 10 and 60 (inclusive)
 * @default 15
*/

(function() {

  // Return a number comprised between 'min' and 'max' params
  function numberBoundaries (num, min, max) {
    return num > max ? max : (num < min ? min : num);
  };

  const pluginName = 'SetAnimationFramerate';
  const parameters = PluginManager.parameters(pluginName);
  const _fps = Number(parameters.FPS || 15);
  const fps = numberBoundaries(_fps, 10, 60);

  Sprite_Animation.prototype.setupRate = function () {
    this._rate = Math.ceil(60 / fps);
  };
})();
