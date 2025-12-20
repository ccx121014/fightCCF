/* editor.js - wire up simple character editor UI */
(function(){
  console.log('[editor] loaded');
  document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('char-form');
    const output = document.getElementById('output');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const data = {
        id: (form.name.value || 'unnamed').toLowerCase().replace(/\s+/g,'-'),
        name: form.name.value || 'Unnamed',
        health: Number(form.health.value) || 100
      };
      if (window.CharacterData) window.CharacterData.save(data);
      output.textContent = JSON.stringify(data, null, 2);
      window.UI && window.UI.notify('Character saved (stub)');
    });
  });
})();
