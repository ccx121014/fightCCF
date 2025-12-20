/* character-data.js - stubbed character storage and API */
(function(){
  console.log('[character-data] loaded');
  const characters = [
    { id: 'hero', name: 'Hero', health: 100, attack: 10 }
  ];

  window.CharacterData = {
    list: function(){ return characters.slice(); },
    get: function(id){ return characters.find(c=>c.id===id) || null; },
    save: function(obj){
      const idx = characters.findIndex(c=>c.id===obj.id);
      if (idx >= 0) characters[idx] = obj; else characters.push(obj);
      return obj;
    }
  };
})();
