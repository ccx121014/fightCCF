/* sync-ui.js - prototype UI sync helpers (stubs) */
(function(){
  console.log('[sync-ui] loaded');
  window.SyncUI = {
    pushState: function(state){ console.log('pushState (stub)', state); },
    pullState: function(){ console.log('pullState (stub)'); return {}; }
  };
})();
