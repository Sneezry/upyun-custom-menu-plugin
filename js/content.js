/*
* UPYUN custom menu plugin content script
* 
* @author Sneezry
* @github Sneezry/upyun-custom-menu-plugin
*/

var previousTemplete = null;

function showLayout(layout, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', chrome.extension.getURL('layout/' + layout + '.html'), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      document.getElementById('custom_menu_layout_container').innerHTML = xhr.responseText;
      if(callback) {
        callback();
      }
      document.getElementById('custom_menu_layout').setAttribute('data-close', 'false');
    }
  }
  xhr.send();
}

function getViewName() {
  var hash = location.hash.substr(1);

  return hash;
}

function getTemplete(viewName) {
  var matchedResult = viewName.match(/^\/\S+?\/\S+?\/(\S+?)\//);

  return matchedResult && matchedResult.length > 1 ? matchedResult[1] : null;
}

function isTempleteChanged() {
  var viewName = getViewName();
  if (previousTemplete === null || previousTemplete === getTemplete(getViewName())) {
    return false;
  } else {
    return true;
  }
}

function isBuckets() {
  var viewName = getViewName();

  return /^\/buckets\//.test(viewName);
}

function getBucketName() {
  var viewName = getViewName(),
      matchedResult = viewName.match(/^\/buckets\/(\S+?)\//);

  return matchedResult && matchedResult.length > 1 ? matchedResult[1] : null;
}

function getFirstLevelMenuName(menuDom) {
  var matchedResult = menuDom.getAttribute('ng-class').match(/isOpen\.(\S+?)[\s}]/);
  return matchedResult.length > 1 ? matchedResult[1] : null;
}

function createSubmenu(subMenuName, subMenuItem) {
  var firstLevelMenuIndex,
      firstLevelMenu = document.getElementsByClassName('accordion-group ng-isolate-scope');

  for (firstLevelMenuIndex = 0; firstLevelMenuIndex < firstLevelMenu.length; firstLevelMenuIndex++) {
    if (subMenuItem.parentMenu === getFirstLevelMenuName(firstLevelMenu[firstLevelMenuIndex])) {
      var submenuLI, submenuA,
          submenuShowName = chrome.i18n.getMessage('CM_' + subMenuName),
          submenuContainer = firstLevelMenu[firstLevelMenuIndex].getElementsByTagName('ul')[0];
      submenuLI = document.createElement('li');
      submenuA = document.createElement('a');
      submenuA.id = 'custom_menu_' + subMenuName;
      submenuA.href = '#';
      submenuA.innerText = submenuShowName || '__custom_menu_' + subMenuName + '__';
      submenuA.onclick = function(e) {
        var scope = this;

        if (subMenuItem.layout) {
          showLayout(subMenuItem.layout, function() {
            if (subMenuItem.controller && typeof subMenuItem.controller === 'function') {
              subMenuItem.controller(scope);
            }
          });
        } else if (subMenuItem.controller && typeof subMenuItem.controller === 'function') {
          subMenuItem.controller(scope);
        }

        e.preventDefault();
      }
      submenuLI.appendChild(submenuA);
      submenuContainer.appendChild(submenuLI);

      break;
    }
  }
}

function insertCustomMenu(customMenu) {
  var customMenuItem;

  for (customMenuItem in customMenu) {
    createSubmenu(customMenuItem, customMenu[customMenuItem]);
  }
}

function getCustomMenu(customMenuData) {
  var customMenuItem, customMenu = {};

  for (customMenuItem in customMenuData) {
    customMenu[customMenuItem] = {};
    customMenu[customMenuItem].parentMenu = customMenuData[customMenuItem].parentMenu;

    if (customMenuData[customMenuItem].controller) {
      if (customMenuController[customMenuData[customMenuItem].controller]) {
        customMenu[customMenuItem].controller = customMenuController[customMenuData[customMenuItem].controller];
      } else {
        customMenu[customMenuItem].controller = function() {
          var errMessage = 'ERROR: Function [' + customMenuData[customMenuItem].controller + '] ' +
              'is not defined in js/controller.js, but called by custom menu [' + customMenuItem + ']' +
              ' defined in js/custom-menu.js.';

          alert(errMessage);
        }
      }
    }

    if (customMenuData[customMenuItem].layout) {
      customMenu[customMenuItem].layout = customMenuData[customMenuItem].layout;
    }
  }
  insertCustomMenu(customMenu);
}

function startInsertCustomMenu() {
  if (isBuckets()) {
    chrome.runtime.sendMessage({action: 'get_custom_menu'}, getCustomMenu);
  }

  window.onhashchange = function(e) {
    var previousURL = e.oldURL;

    if (previousURL.indexOf('#') !== -1) {
      previousTemplete = getTemplete(previousURL.split('#')[1]);

      if (isTempleteChanged()) {
        startInsertCustomMenu();
      }
    } else {
      startInsertCustomMenu();
    }
  };
}

function init() {
  var customMenuLayout = document.createElement('div'),
      customMenuLayoutTitleBar = document.createElement('div'),
      customMenuLayoutCloseBtn = document.createElement('a'),
      customMenuLayoutContainer = document.createElement('div');

  customMenuLayout.id = 'custom_menu_layout';
  customMenuLayoutTitleBar.id = 'custom_menu_layout_title';
  customMenuLayoutCloseBtn.innerText = chrome.i18n.getMessage('close'),
  customMenuLayoutCloseBtn.onclick = function() {
    customMenuLayout.setAttribute('data-close', 'true');
  };
  customMenuLayoutTitleBar.appendChild(customMenuLayoutCloseBtn);
  customMenuLayoutContainer.id = 'custom_menu_layout_container';
  customMenuLayout.appendChild(customMenuLayoutTitleBar);
  customMenuLayout.appendChild(customMenuLayoutContainer);
  customMenuLayout.setAttribute('data-close', 'true');
  document.body.appendChild(customMenuLayout);
  startInsertCustomMenu();
}

init();