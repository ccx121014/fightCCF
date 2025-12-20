/* animator.js - animation helper (stubs) */
(function(){
  console.log('[animator] loaded');
  window.Animator = {
    createSprite: function(opts){
      return {
        play: function(name){ console.log('sprite play', name); },
        stop: function(){ console.log('sprite stop'); }
      };
    }
  };
})();
