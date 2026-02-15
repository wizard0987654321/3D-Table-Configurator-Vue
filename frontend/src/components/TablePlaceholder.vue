<script setup>
import { computed, watch, shallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfiguratorStore } from '../stores/configurator'
import { TextureLoader, RepeatWrapping } from 'three'

const store = useConfiguratorStore()
const {
  topColor, legColor, topMaterial, legMaterial,
  plateShape, thicknessCm, legType,
  width, height, depth, topTexture,
} = storeToRefs(store)

// --- DYNAMIC TEXTURE LOADING ---
const textureLoader = new TextureLoader()
const loadedTexture = shallowRef(null)

watch(topTexture, (val) => {
  if (val === 'none') {
    loadedTexture.value = null
    return
  }
  textureLoader.load(`/textures/${val}.jpg`, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(1, 1)
    loadedTexture.value = tex
  })
}, { immediate: true })

const showTexture = computed(() => topTexture.value !== 'none' && topMaterial.value !== 'glass')
const activeTexture = computed(() => showTexture.value ? loadedTexture.value : null)

// --- DIMENSIONS ---
const baseW = 120
const baseD = 80
const scaleX = computed(() => width.value / baseW)
const scaleZ = computed(() => depth.value / baseD)
const h = computed(() => height.value / 100)
const t = computed(() => thicknessCm.value / 100)
const topY = computed(() => h.value + t.value / 2)
const legY = computed(() => h.value / 2)

// --- MATERIALS ---
const topMatProps = computed(() => {
  if (topMaterial.value === 'glass') {
    return {
      roughness: 0.0, metalness: 0.0, transparent: true, opacity: 0.35,
      transmission: 1, thickness: 0.05, ior: 1.45,
    }
  }
  // Reset glass-specific props explicitly when switching away from glass
  const base = { transparent: false, opacity: 1, transmission: 0 }
  if (topMaterial.value === 'wood') return { ...base, roughness: 0.95, metalness: 0.0 }
  return { ...base, roughness: 0.25, metalness: 0.0 }
})

const legMatProps = computed(() => {
  return legMaterial.value === 'metal'
    ? { roughness: 0.35, metalness: 1.0 }
    : { roughness: 0.8, metalness: 0.0 }
})

// --- GEOMETRY HELPERS ---
const isRound = computed(() => plateShape.value === 'round')
const roundRadius = computed(() => 0.5 * scaleX.value)

// Leg positions
const edgeOffset = 0.08
const halfW = computed(() => 0.5 * scaleX.value)
const halfD = computed(() => 0.5 * scaleZ.value)

const legPositions = computed(() => {
  if (isRound.value) {
    return [0, 90, 180, 270].map((d) => [
      Math.cos((d * Math.PI) / 180) * (halfW.value - edgeOffset),
      Math.sin((d * Math.PI) / 180) * (halfW.value - edgeOffset),
    ])
  }
  return [
    [-halfW.value + edgeOffset, -halfD.value + edgeOffset],
    [halfW.value - edgeOffset, -halfD.value + edgeOffset],
    [-halfW.value + edgeOffset, halfD.value - edgeOffset],
    [halfW.value - edgeOffset, halfD.value - edgeOffset],
  ]
})

// U-Frame helpers
const frameX = computed(() => halfW.value - 0.12)
const frameZ = computed(() => halfD.value - 0.12)
const uFrameSides = computed(() => [-frameX.value, frameX.value])

// Pedestal helpers
const pedestalBaseRadius = computed(() => Math.min(halfW.value, halfD.value) * 0.6)

// Material key to force re-creation when material type or texture changes
const topMaterialKey = computed(() => `${topMaterial.value}-${topTexture.value}`)
</script>

<template>
  <TresGroup>
    <!-- ===== TABLE TOP ===== -->

    <!-- Round plate -->
    <TresMesh v-if="isRound" :position="[0, topY, 0]">
      <TresCylinderGeometry :args="[roundRadius, roundRadius, t, 48]" />
      <TresMeshPhysicalMaterial
        :key="topMaterialKey"
        :color="topColor"
        :map="activeTexture"
        v-bind="topMatProps"
      />
    </TresMesh>

    <!-- Rectangular plate -->
    <TresMesh v-else :position="[0, topY, 0]" :scale="[scaleX, 1, scaleZ]">
      <TresBoxGeometry :args="[1, t, 1]" />
      <TresMeshPhysicalMaterial
        :key="topMaterialKey"
        :color="topColor"
        :map="activeTexture"
        v-bind="topMatProps"
      />
    </TresMesh>

    <!-- ===== LEGS ===== -->

    <!-- Square or Round legs (4 legs) -->
    <template v-if="legType === 'square' || legType === 'round'">
      <TresMesh
        v-for="(pos, i) in legPositions"
        :key="`leg-${i}`"
        :position="[pos[0], legY, pos[1]]"
      >
        <TresCylinderGeometry v-if="legType === 'round'" :args="[0.04, 0.04, h, 32]" />
        <TresBoxGeometry v-else :args="[0.085, h, 0.085]" />
        <TresMeshStandardMaterial :color="legColor" v-bind="legMatProps" />
      </TresMesh>
    </template>

    <!-- U-Frame legs -->
    <template v-else-if="legType === 'uFrame'">
      <TresGroup
        v-for="(sx, idx) in uFrameSides"
        :key="`uframe-${idx}`"
        :position="[sx, 0, 0]"
      >
        <!-- Left vertical -->
        <TresMesh :position="[0, h / 2, -frameZ]">
          <TresBoxGeometry :args="[0.08, h, 0.08]" />
          <TresMeshStandardMaterial :color="legColor" v-bind="legMatProps" />
        </TresMesh>
        <!-- Right vertical -->
        <TresMesh :position="[0, h / 2, frameZ]">
          <TresBoxGeometry :args="[0.08, h, 0.08]" />
          <TresMeshStandardMaterial :color="legColor" v-bind="legMatProps" />
        </TresMesh>
        <!-- Bottom horizontal bar -->
        <TresMesh :position="[0, 0.02, 0]">
          <TresBoxGeometry :args="[0.08, 0.08, frameZ * 2]" />
          <TresMeshStandardMaterial :color="legColor" v-bind="legMatProps" />
        </TresMesh>
      </TresGroup>
    </template>

    <!-- Pedestal leg -->
    <template v-else-if="legType === 'pedestal'">
      <TresGroup>
        <!-- Base disc -->
        <TresMesh :position="[0, 0.015, 0]">
          <TresCylinderGeometry :args="[pedestalBaseRadius, pedestalBaseRadius, 0.03, 48]" />
          <TresMeshStandardMaterial :color="legColor" v-bind="legMatProps" />
        </TresMesh>
        <!-- Central column -->
        <TresMesh :position="[0, h / 2, 0]">
          <TresCylinderGeometry :args="[0.07, 0.1, h, 32]" />
          <TresMeshStandardMaterial :color="legColor" v-bind="legMatProps" />
        </TresMesh>
      </TresGroup>
    </template>
  </TresGroup>
</template>
