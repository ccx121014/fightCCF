/* ui.js - basic UI helpers */
(function(){
  console.log('[ui] ui.js loaded');
  window.UI = {
    notify: function(msg){
      console.log('[UI] ' + msg);
      // minimal in-page toast
      const el = document.createElement('div');
      el.textContent = msg;
      el.style.position = 'fixed'; el.style.right = '16px'; el.style.bottom = '16px'; el.style.background = '#222'; el.style.color = '#fff'; el.style.padding = '8px';
      document.body.appendChild(el);
      setTimeout(()=>el.remove(), 2000);
    }
  };
})();
