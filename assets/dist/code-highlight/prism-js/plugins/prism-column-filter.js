// prism-column-filter.js
// 代码前面指定列数的内容不参与高亮（放在最后初始化，保证顺序，不然会和 prism-keep-markup.js 冲突）
!(function() {
    if (typeof Prism === 'undefined' || typeof document === 'undefined') {
        return;
    }
    function beforeHighlight(env) {
        var colCount, filterAttr = env.element.offsetParent.getAttribute('data-filter');
        if(filterAttr !== null && (colCount = parseInt(filterAttr, 10)) > 0){
            env.prefixLinesBuffer = [];
            var lines = env.code.split('\n');

            var processedLines = lines.map(function(line) {
                var escapedPrefix = line.substr(0, colCount);
                escapedPrefix = escapedPrefix.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                env.prefixLinesBuffer.push(escapedPrefix !== '' ? '<span class="token comment">' + escapedPrefix + '</span>' : '');
                return line.substr(colCount);
            });

            env.code = processedLines.join('\n');
            env.element.innerHTML  = env.element.innerHTML.split('\n').map(function(line, index) {
                return line.substr(colCount);
            }).join('\n');
        }
    };
    function afterHighlight(env) {
        if (!env.prefixLinesBuffer || !env.highlightedCode) return;

        var highlightedLines = env.highlightedCode.split('\n');

        // 将暂存的注释数组与高亮后的代码数组强行一一对应合并
        var mergedLines = highlightedLines.map(function(highlitHtml, index) {
            var prefixComment = env.prefixLinesBuffer[index] || '';
            return prefixComment + highlitHtml;
        });

        env.highlightedCode = mergedLines.join('\n');
        env.element.innerHTML = env.highlightedCode;
    };

    var originalBeforeHooks = Prism.hooks.all['before-highlight'] || [];
    var originalAfterHooks = Prism.hooks.all['after-highlight'] || [];

    Prism.hooks.all['before-highlight'] = [beforeHighlight].concat(originalBeforeHooks);
    Prism.hooks.all['after-highlight'] = originalAfterHooks.concat([afterHighlight]);
})();