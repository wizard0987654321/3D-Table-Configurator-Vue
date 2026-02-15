<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfiguratorStore } from '../stores/configurator'

const store = useConfiguratorStore()

const {
  topColor,
  legColor,
  topMaterial,
  legMaterial,
  topTexture,
  width,
  height,
  depth,
  plateShape,
  thicknessCm,
  legType,
  configName,
  editingId,
  price,
} = storeToRefs(store)

const isRound = computed(() => plateShape.value === 'round')
const isLargePlate = computed(() => width.value > 160 || depth.value > 100)
const thinDisabled = computed(() => isLargePlate.value)

const textureOptions = [
  { id: 'none', name: 'Keine' },
  { id: 'smooth', name: 'Glatt' },
  { id: 'rough', name: 'Rau' },
  { id: 'grain', name: 'Maserung' },
]

function onPlateShapeChange(e) {
  const shape = e.target.value
  store.setField('plateShape', shape)
  if (shape === 'round') {
    store.setField('depth', width.value)
    if (legType.value === 'uFrame') store.setField('legType', 'round')
  }
  if (shape === 'rect' && legType.value === 'pedestal') {
    store.setField('legType', 'round')
  }
}

function onWidthChange(e) {
  const w = Number(e.target.value)
  store.setField('width', w)
  if (isRound.value) store.setField('depth', w)
}
</script>

<template>
  <div class="sidebar">
    <h2>Tisch-Konfigurator</h2>

    <label class="config-name-label">
      Name
      <input
        type="text"
        placeholder="Mein Tisch"
        class="config-name-input"
        v-model="configName"
      />
    </label>

    <label>
      Plattenform
      <select :value="plateShape" @change="onPlateShapeChange">
        <option value="rect">Rechteck</option>
        <option value="round">Rund</option>
      </select>
    </label>

    <label>
      Plattenstärke
      <select
        :value="thicknessCm"
        @change="store.setField('thicknessCm', Number($event.target.value))"
      >
        <option :value="3" :disabled="thinDisabled">
          3 cm {{ thinDisabled ? '(für große Platten deaktiviert)' : '' }}
        </option>
        <option :value="4">4 cm</option>
        <option :value="6">6 cm</option>
      </select>
    </label>

    <label>
      Material Tischplatte
      <select v-model="topMaterial">
        <option value="wood">Holz</option>
        <option value="plastic">Kunststoff</option>
        <option value="glass">Glas</option>
      </select>
    </label>

    <label>
      Oberflächen-Struktur
      <select v-model="topTexture" :disabled="topMaterial === 'glass'">
        <option v-for="opt in textureOptions" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>
      <small v-if="topMaterial === 'glass'" class="glass-warning">
        Bei Glas nicht verfügbar
      </small>
    </label>

    <label>
      Farbe Tischplatte
      <input type="color" v-model="topColor" />
    </label>

    <hr class="divider" />

    <label>
      Breite: {{ width }} cm
      <input
        type="range"
        min="100"
        max="200"
        :value="width"
        @input="onWidthChange"
      />
    </label>

    <label>
      Höhe: {{ height }} cm
      <input
        type="range"
        min="60"
        max="110"
        v-model.number="height"
      />
    </label>

    <label>
      Tiefe: {{ depth }} cm
      <input
        type="range"
        min="80"
        max="200"
        v-model.number="depth"
        :disabled="isRound"
      />
      <small v-if="isRound" class="round-hint">
        Bei „Rund" ist Tiefe automatisch = Breite.
      </small>
    </label>

    <hr class="divider" />

    <label>
      Material Beine
      <select v-model="legMaterial">
        <option value="metal">Metall</option>
        <option value="wood">Holz</option>
      </select>
    </label>

    <label>
      Bein-Typ
      <select v-model="legType">
        <option value="square">Vierkant</option>
        <option value="round">Rund (4 Beine)</option>
        <option value="uFrame" :disabled="isRound">
          U-/Rahmen {{ isRound ? '(nur rechteck)' : '' }}
        </option>
        <option value="pedestal" :disabled="!isRound">
          Zentralfuß (nur rund)
        </option>
      </select>
    </label>

    <label>
      Farbe Beine
      <input type="color" v-model="legColor" />
    </label>

    <div class="price">Preis: {{ price }} €</div>

    <div class="actions">
      <button class="save-btn" @click="store.saveConfiguration">
        {{ editingId ? 'Als neue Kopie speichern' : 'Konfiguration speichern' }}
      </button>

      <button v-if="editingId" class="update-btn" @click="store.updateConfiguration">
        Änderungen speichern
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  width: 300px;
  background: #1e1e1e;
  color: #fff;
  overflow-y: auto;
  max-height: 100vh;
}

.sidebar h2 {
  margin: 0 0 10px;
}

.sidebar label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.config-name-input {
  padding: 6px 8px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
}

.sidebar select,
.sidebar input[type="range"] {
  width: 100%;
}

.sidebar select {
  padding: 6px 8px;
  border: 1px solid #555;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
}

.sidebar input[type="color"] {
  width: 100%;
  height: 32px;
  border: none;
  cursor: pointer;
}

.divider {
  margin: 20px 0;
  opacity: 0.2;
}

.glass-warning {
  color: #ff9800;
  display: block;
  margin-top: 4px;
}

.round-hint {
  display: block;
  margin-top: 6px;
  opacity: 0.7;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.save-btn {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  cursor: pointer;
}

.update-btn {
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #ff9800;
  color: white;
  cursor: pointer;
}
</style>
