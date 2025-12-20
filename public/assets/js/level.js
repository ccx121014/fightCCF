/* level.js - level format helpers (stubs) */
(function(){
  console.log('[level] loaded');
  window.Level = {
    create: function(config){ return Object.assign({ entities: [], width:800, height:450 }, config); },
    sample: function(){ return window.Level.create({ id:'sample', name:'Sample Level' }); }
  };
})();
