export async function uploadToImgBB(imageData, filename) {
  // 從 background script 獲取 API Key
  const response = await chrome.runtime.sendMessage({ action: 'getApiKey' });
  const apiKey = response.apiKey;

  if (!apiKey) {
    throw new Error('請先設置imgBB API密鑰');
  }

  try {
    // 驗證imageData格式
    if (!imageData || !imageData.startsWith('data:image/')) {
      throw new Error('無效的圖片數據格式');
    }

    // 準備上傳資料
    const base64Data = imageData.split(',')[1]; // 移除data:image/png;base64,前綴

    if (!base64Data) {
      throw new Error('無法提取圖片的base64數據');
    }

    const formData = new FormData();
    formData.append('image', base64Data);
    if (filename) {
      formData.append('name', filename);
    }

    // 發送到imgBB API
    const apiResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    if (!apiResponse.ok) {
      let errorMessage = `HTTP ${apiResponse.status}: ${apiResponse.statusText}`;
      try {
        const errorData = await apiResponse.json();
        if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch (e) {
        // 如果无法解析错误响应，使用默认错误消息
      }
      throw new Error(errorMessage);
    }

    const result = await apiResponse.json();

    if (!result.success) {
      const errorMessage = result.error?.message || '上傳失敗，請檢查API密鑰是否正確';
      throw new Error(errorMessage);
    }

    if (!result.data || !result.data.url) {
      throw new Error('上傳成功但未收到圖片網址');
    }

    return result.data.url;
  } catch (error) {
    console.error('上傳到imgBB失敗:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('網路連接失敗，請檢查網路連接');
    } else if (error.message.includes('API key')) {
      throw new Error('API密鑰無效，請檢查設定');
    } else {
      throw new Error('上傳到imgBB失敗: ' + error.message);
    }
  }
}
