export async function injectContentScript(tabId) {
  try {
    console.log('開始注入 content script 到標籤頁:', tabId);
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
    await chrome.scripting.insertCSS({
      target: { tabId: tabId },
      files: ['assets/content.css']
    });
    // 等待一下確保腳本載入完成
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Content script 注入成功');
  } catch (error) {
    console.error('注入內容腳本失敗:', error);
    throw new Error('無法在此頁面注入截圖功能：' + error.message);
  }
}

export async function ensureContentScript(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'ping' });
  } catch (error) {
    console.log('Content script 未注入，開始注入...');
    await injectContentScript(tabId);
  }
}
