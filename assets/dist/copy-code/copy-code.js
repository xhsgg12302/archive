/*!
 * docsify-copy-code
 * v2.1.1
 * https://github.com/jperasmus/docsify-copy-code
 * (c) 2017-2020 JP Erasmus <jperasmus11@gmail.com>
 * MIT license
 * 
 * caution!!! the content is updated to adata hugo
 */
(function() {
    "use strict";
    function styleInject(css, ref) {
        if (ref === void 0) ref = {};
        var insertAt = ref.insertAt;
        if (!css || typeof document === "undefined") {
            return;
        }
        var head = document.head || document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        style.type = "text/css";
        if (insertAt === "top") {
            if (head.firstChild) {
                head.insertBefore(style, head.firstChild);
            } else {
                head.appendChild(style);
            }
        } else {
            head.appendChild(style);
        }
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    function buttonInject(){
        var targetElms = Array.apply(null, document.querySelectorAll("div.outer.yosemite"));
        var i18n = {
            buttonText: "copy",
            errorText: "error",
            successText: "copied"
        };
        var template = [ '<div class="out-show-container"></div>','<button class="docsify-copy-code-button">', '<span class="label">'.concat(i18n.buttonText, "</span>"), '<span class="error">'.concat(i18n.errorText, "</span>"), '<span class="success">'.concat(i18n.successText, "</span>"), "</button>" ].join("");
        targetElms.forEach(function(elm) {
            elm.insertAdjacentHTML("beforeend", template);
        });
 
        var allButtons = document.querySelectorAll(".docsify-copy-code-button");
        allButtons.forEach(button => {

            var preElm = null;
            const outerDiv = button.closest('div.outer');
            if (outerDiv) {
                const nextDiv = outerDiv.nextElementSibling;
                if (nextDiv) {
                    const closeSetPreElement = nextDiv.querySelector('pre');
                    preElm = closeSetPreElement;
                    const showContainer = button.previousElementSibling;
                    if(showContainer) {
                        if (preElm.hasAttribute('data-lang')) showContainer.setAttribute('data-lang',preElm.getAttribute('data-lang'));
                        if (preElm.hasAttribute('data-line')) showContainer.setAttribute('data-line',preElm.getAttribute('data-line'));
                        if (preElm.hasAttribute('data-file')) showContainer.setAttribute('data-file',preElm.getAttribute('data-file'));
                    }
                    closeSetPreElement.addEventListener('mouseenter', () => { button.classList.add('pre-hover');});
                    closeSetPreElement.addEventListener('mouseleave', () => { button.classList.remove('pre-hover'); });
                    outerDiv.addEventListener('mouseenter', () => { button.classList.add('out-div-hover'); });
                    outerDiv.addEventListener('mouseleave', () => { button.classList.remove('out-div-hover'); });
                }
            }

            button.addEventListener('click', function(evt) {
                var buttonElm = evt.target.tagName === "BUTTON" ? evt.target : evt.target.parentNode;
                var range = document.createRange();
                if (!preElm) return;
                var codeElm = preElm.querySelector("code");
                var selection = window.getSelection();
                range.selectNode(codeElm);
                selection.removeAllRanges();
                selection.addRange(range);
                try {
                    var successful = document.execCommand("copy");
                    if (successful) {
                        buttonElm.classList.add("success");
                        setTimeout(function() {
                            buttonElm.classList.remove("success");
                        }, 1e3);
                    }
                } catch (err) {
                    console.error("docsify-copy-code: ".concat(err));
                    buttonElm.classList.add("error");
                    setTimeout(function() {
                        buttonElm.classList.remove("error");
                    }, 1e3);
                }
                selection = window.getSelection();
                if (typeof selection.removeRange === "function") {
                    selection.removeRange(range);
                } else if (typeof selection.removeAllRanges === "function") {
                    selection.removeAllRanges();
                }
            });
        });
    }

    //var css = ".docsify-copy-code-button,.docsify-copy-code-button span{cursor:pointer;transition:all .25s ease}.docsify-copy-code-button{position:absolute;z-index:1;top:0;right:0;overflow:visible;padding:.65em .8em;border:0;border-radius:0;outline:0;font-size:1em;background:grey;background:var(--theme-color,grey);color:#fff;opacity:0}.docsify-copy-code-button span{border-radius:3px;background:inherit;pointer-events:none}.docsify-copy-code-button .error,.docsify-copy-code-button .success{position:absolute;z-index:-100;top:50%;right:0;padding:.5em .65em;font-size:.825em;opacity:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.docsify-copy-code-button.error .error,.docsify-copy-code-button.success .success{right:100%;opacity:1;-webkit-transform:translate(-115%,-50%);transform:translate(-115%,-50%)}.docsify-copy-code-button:focus,pre:hover .docsify-copy-code-button{opacity:1}";
    //var css = ".docsify-copy-code-button,.docsify-copy-code-button span{cursor:pointer;transition:all .25s ease}.docsify-copy-code-button{position:absolute;z-index:1;top:0;right:0;overflow:visible;/*padding:.65em .8em;*/border-radius:5px;outline:0;font-size:1em;background:var(--theme-color,grey);background:#9999AA;color:#36148a;opacity:0}.docsify-copy-code-button span{border-radius:3px;background:inherit;pointer-events:none}.docsify-copy-code-button .error,.docsify-copy-code-button .success{position:absolute;z-index:-100;top:50%;right:0;padding:.5em .65em;font-size:.825em;opacity:0;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.docsify-copy-code-button.error .error,.docsify-copy-code-button.success .success{right:100%;opacity:1;-webkit-transform:translate(-115%,-50%);transform:translate(-115%,-50%)}.docsify-copy-code-button:focus,pre:hover .docsify-copy-code-button{opacity:0.6}"
    //styleInject(css);
    buttonInject();
})();