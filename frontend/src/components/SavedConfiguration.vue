<script setup>
const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['edit', 'order', 'delete'])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE')
}
</script>

<template>
  <div class="config-card">
    <div class="card-header">
      <h4>{{ config.config_name || 'Unbenannter Tisch' }}</h4>
      <span class="price-badge">{{ config.total_price }} €</span>
    </div>

    <div class="card-details">
      <p><strong>Form:</strong> {{ config.plate_shape === 'rect' ? 'Rechteck' : 'Rund' }}</p>
      <p><strong>Maße:</strong> {{ config.width }}x{{ config.depth }} cm</p>
      <p class="date">Gespeichert am: {{ formatDate(config.created_at) }}</p>

      <div class="card-actions">
        <button class="edit-btn" @click="emit('edit', config)">Bearbeiten</button>
        <button class="order-btn" @click="emit('order', config)">Bestellen</button>
        <button class="delete-btn" @click="emit('delete', config.id)">Löschen</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-card {
  background: #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
}

.config-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.price-badge {
  background: #4caf50;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.card-details p {
  margin: 6px 0;
  font-size: 0.9rem;
  color: #ccc;
}

.date {
  opacity: 0.6;
  font-size: 0.8rem !important;
  margin-top: 10px !important;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.card-actions button {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: opacity 0.2s;
}

.card-actions button:hover {
  opacity: 0.85;
}

.edit-btn {
  background: #6EACDA;
  color: #021526;
}

.order-btn {
  background: #4caf50;
  color: #fff;
}

.delete-btn {
  background: #e74c3c;
  color: #fff;
}
</style>
