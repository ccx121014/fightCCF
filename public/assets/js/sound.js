/* sound.js - stubbed sound manager */
(function(){
  console.log('[sound] loaded');
  window.SoundManager = {
    play: function(name){ console.log('[sound] play', name); },
    stop: function(name){ console.log('[sound] stop', name); }
  };
})();
