<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
});
</script>

<template>
  <div class="auth-loading" role="status" aria-live="polite" aria-busy="true">
    <span class="auth-loading__spinner" aria-hidden="true"></span>
    <span class="auth-loading__text">{{ message }}</span>
  </div>
</template>

<style scoped>
.auth-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: rgba(110, 172, 218, 0.18);
  color: #e2e2b6;
  font-size: 0.9rem;
}

.auth-loading__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(226, 226, 182, 0.35);
  border-top-color: #e2e2b6;
  border-radius: 50%;
  animation: auth-loading-spin 0.8s linear infinite;
}

@keyframes auth-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
