import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfiguratorStore = defineStore('configurator', () => {
  // id to identify if we are in editing mode
  const editingId = ref(null)

  // 1. State: Colors & Materials
  const topColor = ref('#d4c4a8')
  const legColor = ref('#555555')
  const topMaterial = ref('wood')
  const legMaterial = ref('metal')
  const topTexture = ref('none')

  // 2. State: Dimensions (cm)
  const width = ref(120)
  const height = ref(75)
  const depth = ref(80)

  // 3. State: Plate & Legs
  const plateShape = ref('rect')
  const thicknessCm = ref(4)
  const legType = ref('square')

  // State for the Configuration Name
  const configName = ref('')

  // 4. Action: Update fields
  function setField(key, value) {
    const fields = {
      editingId,
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
    }
    if (fields[key]) {
      fields[key].value = value
    }
  }

  // 5. Logic: Calculate Price
  const price = computed(() => {
    let p = 150
    p *= (width.value * depth.value) / (120 * 80)

    if (height.value > 75) p += 50
    if (topMaterial.value === 'glass') p += 80
    if (topMaterial.value === 'wood') p += 40
    if (legMaterial.value === 'wood') p += 20
    if (legType.value === 'uFrame') p += 60
    if (legType.value === 'pedestal') p += 50
    if (thicknessCm.value === 6) p += 70
    if (thicknessCm.value === 3) p -= 20

    return Math.round(p)
  })

  // 6. Action: Save to Database
  async function saveConfiguration() {
    let userId = localStorage.getItem('userId')
    if (!userId) {
      const userJson = localStorage.getItem('user')
      if (userJson) {
        try { userId = JSON.parse(userJson).id } catch (e) { /* ignore */ }
      }
    }

    if (!userId) {
      alert('Please log in to save your design!')
      return
    }

    const payload = {
      userId,
      configName: configName.value,
      topColor: topColor.value,
      legColor: legColor.value,
      topMaterial: topMaterial.value,
      legMaterial: legMaterial.value,
      width: width.value,
      height: height.value,
      depth: depth.value,
      plateShape: plateShape.value,
      thicknessCm: thicknessCm.value,
      legType: legType.value,
      totalPrice: price.value,
      topTexture: topTexture.value,
    }

    try {
      const response = await fetch('http://localhost:3000/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert(`Saved "${configName.value}" successfully!`)
      } else {
        const errorData = await response.json()
        alert('Error: ' + errorData.error)
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Could not connect to server.')
    }
  }

  // Load a configuration from database
  function loadConfiguration(config) {
    editingId.value = config.id
    configName.value = config.config_name
    topColor.value = config.top_color
    legColor.value = config.leg_color
    topMaterial.value = config.top_material
    legMaterial.value = config.leg_material
    width.value = config.width
    height.value = config.height
    depth.value = config.depth
    plateShape.value = config.plate_shape
    thicknessCm.value = config.thickness_cm
    legType.value = config.leg_type
    topTexture.value = config.top_texture || 'none'
  }

  // Reset to defaults
  function resetToDefault() {
    editingId.value = null
    configName.value = ''
    topColor.value = '#6c8bff'
    legColor.value = '#555555'
    width.value = 120
    height.value = 75
    depth.value = 80
    plateShape.value = 'rect'
    thicknessCm.value = 4
    legType.value = 'square'
    topTexture.value = 'none'
  }

  // Update existing configuration
  async function updateConfiguration() {
    const payload = {
      configName: configName.value,
      topColor: topColor.value,
      legColor: legColor.value,
      topMaterial: topMaterial.value,
      legMaterial: legMaterial.value,
      width: width.value,
      height: height.value,
      depth: depth.value,
      plateShape: plateShape.value,
      thicknessCm: thicknessCm.value,
      legType: legType.value,
      totalPrice: price.value,
      topTexture: topTexture.value,
    }

    try {
      const response = await fetch(`http://localhost:3000/api/update-config/${editingId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) alert('Changes saved successfully!')
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  return {
    editingId,
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
    price,
    setField,
    saveConfiguration,
    loadConfiguration,
    resetToDefault,
    updateConfiguration,
  }
})
