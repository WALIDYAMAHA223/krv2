// KratosBio Real-Time Cloud Sync Module
// Uses restful-api.dev object store with local fallback for instant cross-device synchronization (PC, Mobile, Tablet)

const CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a0379936bf1840'

let lastSyncTimestamp = 0

// Helper to get local data safely
export const getLocalStore = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultVal
  } catch (e) {
    return defaultVal
  }
}

// Helper to set local data safely
export const setLocalStore = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.error('LocalStorage write error:', e)
  }
}

// Get combined global data bundle from localStorage
export const getLocalBundle = () => {
  return {
    siteConfig: getLocalStore('kratos_site_config', null),
    reviews: getLocalStore('kratos_reviews', []),
    salesHistory: getLocalStore('kratos_sales_history', [])
  }
}

// Push local bundle to Cloud Endpoint for immediate global sync
export const pushCloudState = async (updates = {}) => {
  const currentBundle = getLocalBundle()
  const newBundle = {
    siteConfig: updates.siteConfig || currentBundle.siteConfig,
    reviews: updates.reviews || currentBundle.reviews,
    salesHistory: updates.salesHistory || currentBundle.salesHistory,
    lastUpdated: Date.now()
  }

  // Save to local storage first
  if (updates.siteConfig) setLocalStore('kratos_site_config', updates.siteConfig)
  if (updates.reviews) setLocalStore('kratos_reviews', updates.reviews)
  if (updates.salesHistory) setLocalStore('kratos_sales_history', updates.salesHistory)

  lastSyncTimestamp = newBundle.lastUpdated

  // Dispatch local events so current tab updates immediately
  if (updates.siteConfig) window.dispatchEvent(new CustomEvent('kratos_site_config_updated', { detail: updates.siteConfig }))
  if (updates.reviews) window.dispatchEvent(new CustomEvent('kratos_reviews_updated', { detail: updates.reviews }))
  if (updates.salesHistory) window.dispatchEvent(new CustomEvent('kratos_sales_updated', { detail: updates.salesHistory }))

  // Push to Cloud API
  try {
    const res = await fetch(CLOUD_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'kratosbio_global_config_v2',
        data: newBundle
      })
    })
    if (!res.ok) {
      console.warn('Cloud sync PUT status:', res.status)
    }
  } catch (err) {
    console.warn('Cloud sync push offline/error:', err)
  }
}

// Pull latest global bundle from Cloud Endpoint
export const fetchCloudState = async (onUpdateCallbacks = {}) => {
  try {
    const res = await fetch(CLOUD_ENDPOINT, { cache: 'no-store' })
    if (!res.ok) return null

    const json = await res.json()
    const cloudData = json?.data
    if (!cloudData || !cloudData.lastUpdated) return null

    // Only update if cloud has newer data than our last sync
    if (cloudData.lastUpdated > lastSyncTimestamp) {
      lastSyncTimestamp = cloudData.lastUpdated

      if (cloudData.siteConfig) {
        setLocalStore('kratos_site_config', cloudData.siteConfig)
        if (onUpdateCallbacks.onSiteConfig) onUpdateCallbacks.onSiteConfig(cloudData.siteConfig)
        window.dispatchEvent(new CustomEvent('kratos_site_config_updated', { detail: cloudData.siteConfig }))
      }

      if (cloudData.reviews) {
        setLocalStore('kratos_reviews', cloudData.reviews)
        if (onUpdateCallbacks.onReviews) onUpdateCallbacks.onReviews(cloudData.reviews)
        window.dispatchEvent(new CustomEvent('kratos_reviews_updated', { detail: cloudData.reviews }))
      }

      if (cloudData.salesHistory) {
        setLocalStore('kratos_sales_history', cloudData.salesHistory)
        if (onUpdateCallbacks.onSalesHistory) onUpdateCallbacks.onSalesHistory(cloudData.salesHistory)
        window.dispatchEvent(new CustomEvent('kratos_sales_updated', { detail: cloudData.salesHistory }))
      }

      return cloudData
    }
  } catch (err) {
    console.warn('Cloud sync pull offline/error:', err)
  }
  return null
}

// Auto-sync polling loop every 3 seconds
export const startCloudSyncLoop = (onUpdateCallbacks = {}, intervalMs = 3000) => {
  // Initial fetch immediately
  fetchCloudState(onUpdateCallbacks)

  // Polling loop
  const timer = setInterval(() => {
    fetchCloudState(onUpdateCallbacks)
  }, intervalMs)

  return () => clearInterval(timer)
}
