<script setup>
import { storeToRefs } from 'pinia'
import { useConfiguratorStore } from '../stores/configurator'

const store = useConfiguratorStore()
const { width, height, depth, topColor, topMaterial, legType, price } = storeToRefs(store)
</script>

<template>
  <div class="table-placeholder">
    <h3>Live Preview (from Store)</h3>
    <div class="preview-box" :style="{ borderColor: topColor }">
      <p><strong>Breite:</strong> {{ width }} cm</p>
      <p><strong>Höhe:</strong> {{ height }} cm</p>
      <p><strong>Tiefe:</strong> {{ depth }} cm</p>
      <p><strong>Material:</strong> {{ topMaterial }}</p>
      <p><strong>Bein-Typ:</strong> {{ legType }}</p>
      <p><strong>Farbe:</strong> <span class="color-swatch" :style="{ background: topColor }"></span> {{ topColor }}</p>
      <p class="price"><strong>Preis: {{ price }} €</strong></p>
    </div>
  </div>
</template>

<style scoped>
.table-placeholder {
  padding: 20px;
  flex: 1;
}

.preview-box {
  border: 3px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  max-width: 400px;
  background: #f9f9f9;
}

.preview-box p {
  margin: 8px 0;
  font-size: 15px;
}

.color-swatch {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  vertical-align: middle;
  border: 1px solid #999;
}

.price {
  margin-top: 16px;
  font-size: 18px;
  color: #4caf50;
}
</style>
