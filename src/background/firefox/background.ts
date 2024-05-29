/// <reference types="firefox-webext-browser"/>

async function onContextMenuCreated() {
  if (browser.runtime.lastError) {
    const currentTab = await browser.tabs.getCurrent();

    await browser.tabs.executeScript(currentTab.id, {
      // TODO: user friendly error code
      code: 'alert("Error creating context menu item");',
    });
  }
}

browser.contextMenus.create({
  id: 'translate-selection',
  title: 'Listen to selected text',
  contexts: ['selection'],
}, onContextMenuCreated);

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case 'translate-selection':
      await translateSelection(info, tab);
      break;
  }
});

async function translateSelection(info: browser.contextMenus.OnClickData, tab: browser.tabs.Tab) {
  await browser.tabs.executeScript(tab.id,{
    file: 'scripts/translation_modal.js',
  });
}
