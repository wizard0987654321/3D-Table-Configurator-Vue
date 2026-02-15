<template>
  <div
    role="button"
    class="profile-icon"
    @click="$router.push('/saved-configurations')"
  >
    <img :src="profileSvg" alt="" class="profile-img" />
  </div>
</template>

<script setup>
import profileSvg from '../assets/profileIcon.svg';
</script>

<style scoped>
.profile-icon {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #272b35;
  cursor: pointer;
}

.profile-img {
  width: 24px;
}
</style>
