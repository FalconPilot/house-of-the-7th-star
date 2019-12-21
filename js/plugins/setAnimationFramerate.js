/*:
 * @plugindesc This plugin allows you to simply modify the in-game animations framerate.
 * @author FalconPilot
 *
 * @param FPS
 * @type number
 * @max 60
 * @min 10
 * @desc The amount of FPS (Frames Per Second) for in-game animations. Must be set between 10 and 60 (inclusive)
 * @default 15
*/

(function() {

  // Return a number comprised between 'min' and 'max' params

  const pluginName = 'SetAnimationFramerate';
  const parameters = PluginManager.parameters(pluginName);
  const fps = Number(parameters.FPS || 15);
  console.log(parameters);
  console.log(fps);

  Sprite_Animation.prototype.setupRate = function () {
    this._rate = Math.ceil(60 / fps);
  };
})();
