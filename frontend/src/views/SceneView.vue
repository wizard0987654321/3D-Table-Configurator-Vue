<script setup>
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Environment } from '@tresjs/cientos'
import Sidebar from '../components/Sidebar.vue'
import TablePlaceholder from '../components/TablePlaceholder.vue'
import ProfileIcon from '../components/ProfileIcon.vue'
</script>

<template>
  <div class="configurator-layout">
    <Sidebar />
    <div class="canvas-wrapper">
      <TresCanvas clear-color="#f0f0f0">
        <TresPerspectiveCamera :position="[0, 1.5, 4]" :fov="45" />

        <TresAmbientLight :intensity="0.15" />
        <TresDirectionalLight :intensity="1.1" :position="[5, 6, 5]" />
        <TresDirectionalLight :intensity="0.6" :position="[-5, 4, -5]" />

        <Environment preset="city" />
        <OrbitControls />

        <Suspense>
          <TablePlaceholder />
        </Suspense>
      </TresCanvas>
    </div>
    <ProfileIcon />
  </div>
</template>

<style>
.configurator-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.canvas-wrapper {
  flex: 1;
  position: relative;
}
</style>
