<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfiguratorStore } from '../stores/configurator'
import SavedConfiguration from '../components/SavedConfiguration.vue'

const router = useRouter()
const store = useConfiguratorStore()

const configs = ref([])
const loading = ref(true)

function getUserId() {
  let userId = localStorage.getItem('userId')
  if (!userId) {
    const userJson = localStorage.getItem('user')
    if (userJson) {
      try { userId = JSON.parse(userJson).id } catch (e) { /* ignore */ }
    }
  }
  return userId
}

onMounted(async () => {
  const userId = getUserId()

  if (!userId) {
    router.push('/')
    return
  }

  try {
    const response = await fetch(`http://localhost:3000/api/user-configs/${userId}`)
    const data = await response.json()
    configs.value = data
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
})

function handleEdit(config) {
  store.loadConfiguration(config)
  router.push('/scene')
}

function handleOrder(config) {
  localStorage.setItem('checkoutConfig', JSON.stringify(config))
  store.loadConfiguration(config)
  router.push('/checkout')
}

async function handleDelete(configId) {
  if (!window.confirm('Möchten Sie diese Konfiguration wirklich löschen?')) return

  try {
    const response = await fetch(`http://localhost:3000/api/delete-config/${configId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      configs.value = configs.value.filter((c) => c.id !== configId)
      alert('Konfiguration erfolgreich gelöscht.')
    } else {
      alert('Fehler - nicht gelöscht')
    }
  } catch (error) {
    console.error('Delete error:', error)
    alert('Fehler - nicht gelöscht')
  }
}

function handleNewTable() {
  store.resetToDefault()
  router.push('/scene')
}
</script>

<template>
  <div class="saved-page">
    <div class="saved-header">
      <h2>Meine gespeicherten Tische</h2>
      <button class="back-btn" @click="handleNewTable">+ Neuer Tisch</button>
    </div>

    <p v-if="loading" class="saved-status">Lädt...</p>

    <p v-else-if="configs.length === 0" class="saved-status">
      Noch keine Tische gespeichert.
    </p>

    <div v-else class="config-grid">
      <SavedConfiguration
        v-for="config in configs"
        :key="config.id"
        :config="config"
        @edit="handleEdit"
        @order="handleOrder"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<style scoped>
.saved-page {
  min-height: 100vh;
  background: #021526;
  padding: 40px 24px;
  box-sizing: border-box;
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 900px;
  margin: 0 auto 30px;
}

.saved-header h2 {
  color: #fff;
  margin: 0;
  font-size: 1.5rem;
}

.back-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #6EACDA;
  color: #021526;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #fff;
}

.saved-status {
  text-align: center;
  color: #ccc;
  font-size: 1.1rem;
  margin-top: 60px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}
</style>
