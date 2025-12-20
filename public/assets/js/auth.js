/* auth.js - prototype authentication helpers (stubs) */
(function(){
  console.log('[auth] loaded');
  const user = { id: 'guest', name: 'Guest' };
  window.Auth = {
    current: function(){ return user; },
    login: function(name){ user.name = name || 'Guest'; console.log('Logged in as', user.name); },
    logout: function(){ user.name = 'Guest'; console.log('Logged out'); }
  };
})();
