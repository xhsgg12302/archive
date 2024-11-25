(() => {
  const classNames = {
    tabsContainer: 'markdown',
    tabBlock: 'docsify-tabs',
    tabButton: 'docsify-tabs__tab',
    tabButtonActive: 'docsify-tabs__tab--active',
    tabContent: 'docsify-tabs__content'
  }

  const settings = {
    persist: true,
    sync: true,
    theme: 'classic',
    tabComments: true,
    tabHeadings: true
  };

  const storageKeys = {
    get persist() {
      return `docsify-tabs.persist.${window.location.pathname}`;
    },
    sync: 'docsify-tabs.sync'
  };

  // Functions
  // =============================================================================
  /**
   * Traverses the element and its parents until it finds a node that matches the
   * provided selector string. Will return itself or the matching ancestor.
   *
   * @param {object} elm
   * @param {string} closestSelectorString
   * @return {(object|null)}
   */
  function getClosest(elm, closestSelectorString) {
    if (Element.prototype.closest) {
      return elm.closest(closestSelectorString);
    }

    while (elm) {
      const isMatch = matchSelector(elm, closestSelectorString);

      if (isMatch) {
        return elm;
      }

      elm = elm.parentNode || null;
    }

    return elm;
  }

  function matchSelector(elm, selectorString) {
    const matches =
      Element.prototype.matches ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;

    return matches.call(elm, selectorString);
  }
  /**
   * Sets the initial active tab for each tab group: the tab containing the
   * matching element ID from the URL, the first tab in the group, or the last tab
   * clicked (if persist option is enabled).
   */
  function setDefaultTabs() {
    const tabsContainer = document.querySelector(`.${classNames.tabsContainer}`);
    const tabBlocks = tabsContainer
      ? Array.apply(null, tabsContainer.querySelectorAll(`.${classNames.tabBlock}`))
      : [];
    const tabStoragePersist = JSON.parse(sessionStorage.getItem(storageKeys.persist)) || {};
    const tabStorageSync = JSON.parse(sessionStorage.getItem(storageKeys.sync)) || [];

    const uriComponent = window.location.hash || window.location.search;
    setActiveTabFromAnchor(uriComponent);

    tabBlocks.forEach((tabBlock, index) => {
      let activeButton = Array.apply(null, tabBlock.children).filter(elm =>
        matchSelector(elm, `.${classNames.tabButtonActive}`)
      )[0];

      if (!activeButton) {
        if (settings.sync && tabStorageSync.length) {
          activeButton = tabStorageSync
            .map(
              label =>
                Array.apply(null, tabBlock.children).filter(elm =>
                  matchSelector(elm, `.${classNames.tabButton}[data-tab="${label}"]`)
                )[0]
            )
            .filter(elm => elm)[0];
        }

        if (!activeButton && settings.persist) {
          activeButton = Array.apply(null, tabBlock.children).filter(elm =>
            matchSelector(elm, `.${classNames.tabButton}[data-tab="${tabStoragePersist[index]}"]`)
          )[0];
        }

        activeButton = activeButton || tabBlock.querySelector(`.${classNames.tabButton}`);
        activeButton && activeButton.classList.add(classNames.tabButtonActive);
      }
    });
  }

  /**
   * Sets the active tab within a group. Optionally stores the selection so it can
   * persist across page loads and syncs active state to tabs with same data attr.
   *
   * @param {object} elm Tab toggle element to mark as active
   */
  function setActiveTab(elm, _isMatchingTabSync = false) {
    const activeButton = getClosest(elm, `.${classNames.tabButton}`);

    if (activeButton) {
      const activeButtonLabel = activeButton.getAttribute('data-tab');
      const tabsContainer = document.querySelector(`.${classNames.tabsContainer}`);
      const tabBlock = activeButton.parentNode;
      const tabButtons = Array.apply(null, tabBlock.children).filter(elm =>
        matchSelector(elm, 'button')
      );
      const tabBlockOffset = tabBlock.offsetTop;

      tabButtons.forEach(buttonElm => buttonElm.classList.remove(classNames.tabButtonActive));
      activeButton.classList.add(classNames.tabButtonActive);
    }
  }

  /**
   * Sets the active tab based on the anchor ID in the URL
   */
  function setActiveTabFromAnchor(uriComponent) {
    const anchorID = decodeURIComponent((uriComponent.match(/(?:#)([^&]+)/) || [])[1]);
    //document.querySelector('.docsify-tabs [data-tab-content="GPU"]')
    const anchorSelector = anchorID && `.${classNames.tabBlock} [data-tab-content='${anchorID}']`;
    const isAnchorElmInTabBlock = anchorID && document.querySelector(anchorSelector);

    if (isAnchorElmInTabBlock) {
      const anchorElm = document.querySelector(`[data-tab-content='${anchorID}']`);
      let tabContent;
      if (anchorElm.closest) {
        tabContent = anchorElm.closest(`.${classNames.tabContent}`);
      } else {
        tabContent = anchorElm.parentNode;
        while (tabContent !== document.body && !tabContent.classList.contains(`${classNames.tabContent}`)) {
          tabContent = tabContent.parentNode;
        }
      }
      setActiveTab(tabContent.previousElementSibling);
    }
  }


  let hasTabs = true;

  if (hasTabs) {
    setDefaultTabs();
    const tabsContainer = document.querySelector(`.${classNames.tabsContainer}`);

    tabsContainer &&
      tabsContainer.addEventListener('click', function handleTabClick(evt) {
        setActiveTab(evt.target);
      });
    // 监听锚点链接变化，用来激活 tab
    window.addEventListener('hashchange', () => setActiveTabFromAnchor(this.window.location.hash));
  }
})();