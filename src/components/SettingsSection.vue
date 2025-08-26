<template>
  <div class="settings-section">
    <h3 class="section-title">設定</h3>
    <div class="setting-item">
      <label for="apiKey" class="setting-label">imgBB API金鑰</label>
      <div class="input-group">
        <input
            :type="apiKeyInputType"
            id="apiKey"
            class="input"
            placeholder="請輸入您的imgBB API金鑰"
            autocomplete="off"
            :value="apiKey"
            @input="$emit('update:apiKey', $event.target.value)"
            @keyup.enter="$emit('save-settings')"
        >
        <button @click="$emit('toggle-visibility')" class="btn btn-icon-only" title="顯示/隱藏密鑰">
          <svg class="eye-icon" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="apiKeyInputType === 'password'" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
            <path v-else d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
          </svg>
        </button>
      </div>
      <div class="setting-help">
        <a href="https://api.imgbb.com/" target="_blank" rel="noopener">
          還沒有API金鑰？點此取得 →
        </a>
      </div>
    </div>
    <button @click="$emit('save-settings')" :disabled="isSaving" class="btn btn-save">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"/>
      </svg>
      {{ isSaving ? '儲存中...' : '儲存設定' }}
    </button>
  </div>
</template>

<script setup>

defineProps({
  apiKey: String,
  apiKeyInputType: String,
  isSaving: Boolean,
});

defineEmits([
  'update:apiKey',
  'toggle-visibility',
  'save-settings',
]);

</script>
