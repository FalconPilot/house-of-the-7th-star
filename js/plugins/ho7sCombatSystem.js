/*:
 * @plugindesc Combat system for House of the 7th Star
 * @author FalconPilot
*/

// Game Battler ovderride

Game_Battler.prototype.regenerateTp = function() {
  const value = 1;
  this.gainSilentTp(value);
};

Game_BattlerBase.prototype.maxTp = function() {
  return 3;
};

Game_Battler.prototype.initTp = function() {
  this.setTp(0);
};
