/* level-runner.js - simple game loop and placeholder LevelRunner class */
(function(){
  console.log('[level-runner] loaded');
  function LevelRunner(opts){
    this.ctx = opts && opts.ctx;
    this.running = false;
    this.tick = this.tick.bind(this);
  }

  LevelRunner.prototype.start = function(){
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    requestAnimationFrame(this.tick);
    console.log('LevelRunner started (stub)');
  };

  LevelRunner.prototype.stop = function(){ this.running = false; };

  LevelRunner.prototype.tick = function(now){
    if (!this.running) return;
    const dt = (now - this.last) / 1000;
    this.last = now;
    // Clear
    if (this.ctx){
      const ctx = this.ctx; ctx.fillStyle = '#111'; ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#0f0'; ctx.fillText('Level Runner (stub) - dt:'+dt.toFixed(3), 10, 20);
    }
    // update entities, physics, AI (stubs)
    requestAnimationFrame(this.tick);
  };

  window.LevelRunner = LevelRunner;
})();
