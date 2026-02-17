<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfiguratorStore } from '../stores/configurator'

const router = useRouter()
const store = useConfiguratorStore()

const {
  configName, topColor, legColor,
  topMaterial, legMaterial,
  width, height, depth,
  plateShape, thicknessCm, legType,
  price,
} = storeToRefs(store)

// Restore config data on reload
onMounted(() => {
  const savedData = localStorage.getItem('checkoutConfig')
  if (savedData) {
    store.loadConfiguration(JSON.parse(savedData))
  }
})

// Discount logic
const inputCode = ref('')
const discountPercent = ref(0)
const statusMessage = ref('')

const finalPrice = computed(() =>
  Math.round(price.value * (1 - discountPercent.value / 100))
)

const detailItems = computed(() => [
  { label: 'Breite', value: `${width.value} cm` },
  { label: 'Tiefe', value: `${depth.value} cm` },
  { label: 'Höhe', value: `${height.value} cm` },
  { label: 'Form', value: plateShape.value },
  { label: 'Bein-Typ', value: legType.value },
  { label: 'Stärke', value: `${thicknessCm.value} cm` },
  { label: 'Material', value: topMaterial.value },
  { label: 'Beine', value: legMaterial.value },
])

async function handleApplyDiscount() {
  if (!inputCode.value) return

  try {
    const response = await fetch('http://localhost:3000/api/validate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inputCode.value }),
    })

    const data = await response.json()

    if (response.ok && data.valid) {
      discountPercent.value = data.percent
      statusMessage.value = `Erfolg! ${data.percent}% Rabatt angewendet.`
    } else {
      discountPercent.value = 0
      statusMessage.value = 'Ungültiger Code.'
    }
  } catch (error) {
    console.error('Discount check error:', error)
    statusMessage.value = 'Fehler beim Prüfen des Codes.'
  }
}

function handleOrder() {
  alert('Tisch bestellt!')
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-card">
      <!-- Header -->
      <div class="checkout-header">
        <h1>Kasse</h1>
        <div class="price-display">
          <template v-if="discountPercent > 0">
            <span class="price-original">{{ price }} €</span>
            <span class="price-discounted">{{ finalPrice }} €</span>
          </template>
          <span v-else class="price-normal">{{ price }} €</span>
        </div>
      </div>

      <h2 class="config-title">{{ configName || 'Unbenannte Konfiguration' }}</h2>

      <!-- Config details grid -->
      <div class="details-grid">
        <div v-for="(item, i) in detailItems" :key="i" class="detail-item">
          <span class="detail-label">{{ item.label }}</span>
          <p class="detail-value">{{ item.value }}</p>
        </div>
      </div>

      <!-- Color preview -->
      <div class="color-section">
        <span class="detail-label">Farbe Tischplatte</span>
        <div class="color-row">
          <div class="color-swatch" :style="{ background: topColor }"></div>
          <span class="color-value">{{ topColor }}</span>
        </div>
      </div>

      <!-- Discount code -->
      <div class="discount-section">
        <span class="detail-label">Rabattcode</span>
        <input
          type="text"
          placeholder="Code eingeben"
          class="discount-input"
          v-model="inputCode"
        />
        <div class="discount-row">
          <button type="button" class="discount-btn" @click="handleApplyDiscount">
            Rabatt anwenden
          </button>
          <span
            v-if="statusMessage"
            class="discount-status"
            :class="{ success: statusMessage.includes('Erfolg'), error: !statusMessage.includes('Erfolg') }"
          >
            {{ statusMessage }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="checkout-actions">
        <button class="btn-back" @click="goBack">Zurück</button>
        <button class="btn-pay" @click="handleOrder">Jetzt bezahlen</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #0f172a;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
}

.checkout-card {
  width: 100%;
  max-width: 700px;
  background: #1e293b;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid #334155;
}

/* Header */
.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #334155;
  padding-bottom: 20px;
  margin-bottom: 24px;
}

.checkout-header h1 {
  margin: 0;
  font-size: 1.8rem;
}

.price-display {
  text-align: right;
}

.price-original {
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
  margin-right: 10px;
}

.price-discounted {
  font-size: 1.4rem;
  color: #4ade80;
  font-weight: bold;
}

.price-normal {
  font-size: 1.4rem;
  color: #5b8dd9;
  font-weight: bold;
}

.config-title {
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 20px;
}

/* Details grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.detail-label {
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: bold;
}

.detail-value {
  margin: 4px 0 0;
  font-size: 1rem;
  color: #e2e8f0;
}

/* Color preview */
.color-section {
  margin-bottom: 24px;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #f8fafc;
}

.color-value {
  font-size: 1rem;
  color: #e2e8f0;
  font-weight: 500;
}

/* Discount */
.discount-section {
  margin-bottom: 32px;
  border-top: 1px solid #334155;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.discount-input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: #0f172a;
  border: 1px solid #334155;
  color: #f8fafc;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.discount-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.discount-btn {
  width: fit-content;
  padding: 8px 16px;
  border-radius: 6px;
  background: #334155;
  color: #e2e8f0;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s;
}

.discount-btn:hover {
  background: #475569;
}

.discount-status {
  font-size: 0.9rem;
  font-weight: 500;
}

.discount-status.success {
  color: #4ade80;
}

.discount-status.error {
  color: #ef4444;
}

/* Actions */
.checkout-actions {
  display: flex;
  gap: 16px;
}

.btn-back {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #334155;
}

.btn-pay {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  background: #5b8dd9;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-pay:hover {
  background: #4a7bc8;
}
</style>
