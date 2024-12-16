/**
 * write a simple plugin by self for `fenced code` collapse
 * see: https://github.com/PrismJS/prism/blob/master/plugins/autolinker/prism-autolinker.js
 *      https://github.com/PrismJS/prism/blob/master/plugins/toolbar/prism-toolbar.js
 */
(function () {

	if (typeof Prism === 'undefined' || typeof document === 'undefined') { return; }

    Prism.plugins.codeCollapse = {
        counter: function createCounter() {
            let count = 0;
            return function() {
                return ++count;
            };
        }()
    };

	var hook = Prism.plugins.codeCollapse.hook = function (env) {
		// Check if inline or actual code block (credit to line-numbers plugin)
		var pre = env.element.parentNode;
		if (!pre || !/pre/i.test(pre.nodeName)) {
			return;
		}

        if (!pre.hasAttribute('data-cc')) {
			return;
		}

        pre.style.maxHeight = pre.getAttribute('data-cc');
        let ccIndex = Prism.plugins.codeCollapse.counter();
        pre.insertAdjacentHTML('beforebegin', '<input type="checkbox" id="toggle-cc-' + ccIndex + '"/>');
        pre.insertAdjacentHTML('afterend', '<label for="toggle-cc-' + ccIndex + '" class="hide-pre-code-box"><span class="hide-pre-code-bt"/></label>');

        var eleInput = document.querySelector('input#toggle-cc-'+ ccIndex);
        eleInput.addEventListener('change', function() {
            const lineHighlights = pre.querySelectorAll('div.line-highlight');
            if (this.checked) {
                // 如果复选框被选中，则应用样式（这里假设你有一个默认样式类）
                pre.style.maxHeight = 'none';
            } else {
                // 如果复选框未被选中，则移除样式
                pre.style.maxHeight = pre.getAttribute('data-cc');
            }
        });
	};

	/**
	 * Register the codeCollapse with Prism.
	 */
	Prism.hooks.add('complete', hook);
}());