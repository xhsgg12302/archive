// override themes/amethyst/assets/menu-reset.js

(function() {
    function expandParents(element) {
      var parentLi = element.closest('ul').closest('li');
      while (parentLi && parentLi.closest('nav')) {
          parentLi.querySelector('input').checked = true;
          parentLi = parentLi.closest('ul').closest('li');
      }
    }
  
    const target = window.location.pathname;
    if(target === '/') return;
    const mainUL = document.querySelector("aside .book-menu-content nav>ul");
    const sel = 'a[href="' + target + '"]';
    const targetA = mainUL.querySelector(sel);
    expandParents(targetA);
})();