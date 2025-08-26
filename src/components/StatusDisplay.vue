<template>
  <div v-if="status.visible" :class="['status-message', status.type]">
    <div class="status-icon">
      <div v-if="status.loading" class="loading-spinner"></div>
      <svg v-if="status.type === 'success' && !status.loading" class="success-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
      </svg>
      <svg v-if="status.type === 'error' && !status.loading" class="error-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
      </svg>
    </div>
    <span class="status-text">{{ status.message }}</span>
  </div>
</template>

<script setup>
defineProps({
  status: {
    type: Object,
    required: true,
  },
});
</script>
