<template>
  <div class="popup-container">
    <Header />
    <ActionButtons
      :has-api-key="hasApiKey"
      :is-capturing="isCapturing"
      :is-mac="isMac"
      @start-screenshot="handleStartScreenshot"
      @full-screenshot="handleFullScreenshot"
      @scrolling-screenshot="handleScrollingScreenshot"
    />
    <StatusDisplay :status="status" />
    <SettingsSection
      :api-key="apiKey"
      :api-key-input-type="apiKeyInputType"
      :is-saving="isSaving"
      @update:api-key="apiKey = $event"
      @toggle-visibility="toggleApiKeyVisibility"
      @save-settings="handleSaveSettings"
    />
    <HelpSection :is-mac="isMac" />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from './components/Header.vue';
import ActionButtons from './components/ActionButtons.vue';
import StatusDisplay from './components/StatusDisplay.vue';
import SettingsSection from './components/SettingsSection.vue';
import HelpSection from './components/HelpSection.vue';
import Footer from './components/Footer.vue';

// --- Reactive State ---
const apiKey = ref('');
const apiKeyInputType = ref('password');
const isSaving = ref(false);
const isCapturing = ref(false);
const isMac = ref(false);
const status = ref({
  visible: false,
  message: '',
  type: 'info', // info, success, error
  loading: false,
});

// --- Computed Properties ---
const hasApiKey = computed(() => apiKey.value.trim().length > 0);

// --- Functions ---
const showStatus = (message, type = 'info', showLoading = false) => {
  status.value = {
    visible: true,
    message,
    type,
    loading: showLoading,
  };

  if (!showLoading) {
    setTimeout(() => {
      status.value.visible = false;
    }, 3000);
  }
};

const sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (response && !response.success) {
        return reject(new Error(response.error || 'An unknown error occurred.'));
      }
      resolve(response);
    });
  });
};

const loadSettings = async () => {
  try {
    const response = await sendMessage({ action: 'getApiKey' });
    if (response.apiKey) {
      apiKey.value = response.apiKey;
    }
  } catch (error) {
    console.error('載入設定失敗:', error);
  }
};

const handleStartScreenshot = async () => {
  if (!hasApiKey.value) {
    showStatus('請先設定imgBB API金鑰', 'error');
    return;
  }
  isCapturing.value = true;
  showStatus('正在啟動截圖...', 'info', true);
  try {
    await sendMessage({ action: 'startScreenshot' });
    showStatus('請在網頁上選擇截圖區域', 'info');
    setTimeout(() => window.close(), 1000);
  } catch (error) {
    console.error('開始截圖失敗:', error);
    showStatus(`啟動失敗: ${error.message}`, 'error');
  } finally {
    isCapturing.value = false;
  }
};

const handleFullScreenshot = async () => {
   if (!hasApiKey.value) {
    showStatus('請先設定imgBB API金鑰', 'error');
    return;
  }
  isCapturing.value = true;
  showStatus('正在啟動全視窗截圖...', 'info', true);
  try {
    await sendMessage({ action: 'fullScreenshot' });
    showStatus('全視窗截圖成功', 'success');
  } catch (error) {
    console.error('全視窗截圖失敗:', error);
    showStatus(`全視窗截圖失敗: ${error.message}`, 'error');
  } finally {
    isCapturing.value = false;
  }
};

const handleScrollingScreenshot = async () => {
  if (!hasApiKey.value) {
    showStatus('請先設定imgBB API金鑰', 'error');
    return;
  }
  isCapturing.value = true;
  showStatus('正在啟動滾動截圖...', 'info', true);
  try {
    await sendMessage({ action: 'startScrollingScreenshot' });
    showStatus('滾動截圖已啟動', 'info');
    setTimeout(() => window.close(), 1000);
  } catch (error) {
    console.error('滾動截圖失敗:', error);
    showStatus(`滾動截圖失敗: ${error.message}`, 'error');
  } finally {
    isCapturing.value = false;
  }
};

const toggleApiKeyVisibility = () => {
  apiKeyInputType.value = apiKeyInputType.value === 'password' ? 'text' : 'password';
};

const handleSaveSettings = async () => {
  if (!apiKey.value.trim()) {
    showStatus('請輸入API金鑰', 'error');
    return;
  }
  if (!/^[a-zA-Z0-9]{32}$/.test(apiKey.value.trim())) {
    showStatus('API金鑰格式不正確', 'error');
    return;
  }

  isSaving.value = true;
  showStatus('正在儲存設定...', 'info', true);
  try {
    await sendMessage({ action: 'saveApiKey', apiKey: apiKey.value.trim() });
    showStatus('設定已儲存', 'success');
  } catch (error) {
    console.error('儲存設定失敗:', error);
    showStatus(`儲存失敗: ${error.message}`, 'error');
  } finally {
    isSaving.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  loadSettings();

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateStatus') {
      showStatus(request.message, request.type, request.showLoading);
    }
  });

  sendMessage({ action: 'getScreenshotState' })
    .then(response => {
      if (response && response.isCapturing) {
        isCapturing.value = true;
        showStatus('正在處理截圖...', 'info', true);
      }
    })
    .catch(error => console.error('無法獲取截圖狀態:', error));

  // Keyboard shortcuts
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveSettings();
    }
    if (e.key === 'Escape') {
      window.close();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
});
</script>

<style>
/* The existing styles from popup.css can be imported in main.js or placed here */
</style>
