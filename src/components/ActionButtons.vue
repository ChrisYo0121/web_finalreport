<template>
  <div class="main-section">
    <!-- 任意截圖按鈕 -->
    <button :disabled="!hasApiKey || isCapturing" @click="$emit('start-screenshot')" class="btn btn-primary btn-large" :title="buttonTitle">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M9,2V5H7A1,1 0 0,0 6,6V9H3.5A1.5,1.5 0 0,0 2,10.5V12.5A1.5,1.5 0 0,0 3.5,14H6V18A1,1 0 0,0 7,19H9V22H11V19H13V22H15V19H17A1,1 0 0,0 18,18V14H20.5A1.5,1.5 0 0,0 22,12.5V10.5A1.5,1.5 0 0,0 20.5,9H18V6A1,1 0 0,0 17,5H15V2H13V5H11V2H9M16,7V17H8V7H16Z"/></svg>
      任意截圖
      <span class="shortcut">{{ isMac ? 'Cmd+Shift+S' : 'Ctrl+Shift+S' }}</span>
    </button>

    <!-- 全視窗截圖按鈕 -->
    <button :disabled="!hasApiKey || isCapturing" @click="$emit('full-screenshot')" class="btn btn-secondary btn-large" :title="buttonTitle">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/></svg>
      全視窗截圖
      <span class="shortcut">{{ isMac ? 'Cmd+Shift+F' : 'Ctrl+Shift+F' }}</span>
    </button>

    <!-- 滾動式視窗截圖按鈕 -->
    <button :disabled="!hasApiKey || isCapturing" @click="$emit('scrolling-screenshot')" class="btn btn-warning btn-large" :title="buttonTitle">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M15,5H18V2H15V5M15,22H18V19H15V22M13,17H11V7H13V17M9,5H6V2H9V5M9,22H6V19H9V22M5,9H2V6H5V9M22,9H19V6H22V9M5,18H2V15H5V18M22,18H19V15H22V18Z"/></svg>
      滾動式視窗截圖
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  hasApiKey: Boolean,
  isCapturing: Boolean,
  isMac: Boolean,
});

defineEmits([
  'start-screenshot',
  'full-screenshot',
  'scrolling-screenshot',
]);

const buttonTitle = computed(() => props.hasApiKey ? '' : '請先設定API金鑰');
</script>
