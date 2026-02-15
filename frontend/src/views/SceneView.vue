<script setup>
import Sidebar from '../components/Sidebar.vue'
import TablePlaceholder from '../components/TablePlaceholder.vue'
import ProfileIcon from '../components/ProfileIcon.vue'
</script>

<template>
  <div class="about">
    <h1>This is a scene page</h1>
    <ProfileIcon />
    <Sidebar />
    <TablePlaceholder />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
