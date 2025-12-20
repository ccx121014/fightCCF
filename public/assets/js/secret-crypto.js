/* secret-crypto.js
   Prototype cryptographic helpers for secrets (stubs only). Do NOT use in production.
*/
(function(){
  console.log('[secret-crypto] loaded');
  window.SecretCrypto = {
    hash: function(str){
      // naive hash stub
      let h = 0; for (let i=0;i<str.length;i++) h = (h<<5)-h + str.charCodeAt(i);
      return (h>>>0).toString(16);
    }
  };
})();
