// override themes/amethyst/assets/menu-reset.js

(function () {
    function expandParents(element) {
        if (!element) return;
        var parentLi = element.closest('ul').closest('li');
        while (parentLi && parentLi.closest('nav')) {
            parentLi.querySelector('input').checked = true;
            parentLi = parentLi.closest('ul').closest('li');
        }
    }

    function parseQuery(query) {
        var res = {};
        query = query.trim().replace(/^(\?|#|&)/, '');
        if (!query) { return res; }

        query.split('&').forEach(function (param) {
            var parts = param.replace(/\+/g, ' ').replace(/#.*/, '').split('=');
            res[parts[0]] = parts[1] && decodeURIComponent(parts[1]);
        });
        return res;
    }

    function parse(path) {
        if (path === void 0) path = location.href;
        var query = '', queryIndex = path.indexOf('?');
        if (queryIndex >= 0) {
            query = path.slice(queryIndex + 1);
            path = path.slice(0, queryIndex);
        }
        return { path: path, pathname: location.pathname, query: parseQuery(query) };
    };

    const route = parse();
    if (route.query.side === 'false') {
        let menuAside = document.querySelector('aside.book-menu');
        menuAside.style.display = 'none';
        return;
    }

    const target = route.pathname;
    if (target === '/') return;
    const mainUL = document.querySelector("aside .book-menu-content nav>ul");
    if (mainUL == null) return;
    const sel = 'a[href="' + target + '"]';
    const targetA = mainUL.querySelector(sel);
    expandParents(targetA);
})();