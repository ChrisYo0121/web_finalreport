export async function saveApiKey(apiKey) {
  try {
    await chrome.storage.sync.set({ imgbbApiKey: apiKey });
  } catch (error) {
    console.error('儲存API密鑰失敗:', error);
    throw new Error('儲存API密鑰失敗: ' + error.message);
  }
}

export async function getApiKey() {
  try {
    const result = await chrome.storage.sync.get(['imgbbApiKey']);
    return result.imgbbApiKey || '';
  } catch (error) {
    console.error('獲取API密鑰失敗:', error);
    return '';
  }
}
