import { ensureContentScript } from './scripting.js';

export async function captureCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('無法獲取當前標籤頁');
    }
    const imageData = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'png',
      quality: 100
    });
    if (!imageData) {
      throw new Error('截圖數據為空');
    }
    return imageData;
  } catch (error) {
    console.error('截圖失敗:', error);
    throw new Error('截圖失敗: ' + error.message);
  }
}

function checkTabUrl(tab) {
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    throw new Error('無法在此頁面使用截圖功能');
  }
}

export async function startScreenshot() {
  try {
    console.log('開始啟動截圖功能');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('無法獲取當前標籤頁');

    checkTabUrl(tab);

    await ensureContentScript(tab.id);
    await chrome.tabs.sendMessage(tab.id, { action: 'startSelection' });

  } catch (error) {
    console.error('啟動截圖失敗:', error);
    throw error;
  }
}

export async function startFullScreenshot() {
  try {
    console.log('開始全視窗截圖');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('無法獲取當前標籤頁');

    checkTabUrl(tab);

    await ensureContentScript(tab.id);
    const imageData = await captureCurrentTab();
    await chrome.tabs.sendMessage(tab.id, { action: 'promptForFilename', imageData: imageData });

  } catch (error) {
    console.error('全視窗截圖失敗:', error);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, { action: 'showNotification', message: '全視窗截圖失敗: ' + error.message, type: 'error' });
      }
    } catch (notificationError) {
      console.error('無法顯示錯誤通知:', notificationError);
    }
    throw error;
  }
}

export async function startScrollingScreenshot() {
  try {
    console.log('開始滾動式視窗截圖');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) throw new Error('無法獲取當前標籤頁');

    checkTabUrl(tab);

    await ensureContentScript(tab.id);
    await chrome.tabs.sendMessage(tab.id, { action: 'initiateScrollingCapture' });

  } catch (error) {
    console.error('滾動截圖失敗:', error);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, { action: 'showNotification', message: '滾動截圖失敗: ' + error.message, type: 'error' });
      }
    } catch (notificationError) {
      console.error('無法顯示錯誤通知:', notificationError);
    }
  }
}
