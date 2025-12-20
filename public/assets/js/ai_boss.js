/* ai_boss.js - placeholder boss AI state machine */
(function(){
  console.log('[ai_boss] loaded');
  function BossAI(){
    this.state = 'idle';
  }
  BossAI.prototype.update = function(dt, context){
    // Simple state rotation stub
    if (this.state === 'idle') this.state = 'attack';
    else if (this.state === 'attack') this.state = 'recovery';
    else this.state = 'idle';
    console.log('[BossAI] tick, new state:', this.state);
  };
  window.BossAI = BossAI;
})();
