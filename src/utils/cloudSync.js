// KratosBio Real-Time Cloud Sync System v5
// Powered by Vercel Serverless Sync API (/api/sync) + LocalStorage + Focus Events

let lastSyncTimestamp = 0

// Helper to get local data safely
export const getLocalStore = (key, defaultVal) => {
  try {
    if (typeof localStorage === 'undefined') return defaultVal
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultVal
  } catch (e) {
    return defaultVal
  }
}

// Helper to set local data safely
export const setLocalStore = (key, val) => {
  try {
    if (typeof localStorage === 'undefined') return
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

// Broadcast updates to local tabs & components
const broadcastLocalUpdates = (updates) => {
  if (typeof window === 'undefined') return

  if (updates.siteConfig) {
    setLocalStore('kratos_site_config', updates.siteConfig)
    window.dispatchEvent(new CustomEvent('kratos_site_config_updated', { detail: updates.siteConfig }))
  }
  if (updates.reviews) {
    setLocalStore('kratos_reviews', updates.reviews)
    window.dispatchEvent(new CustomEvent('kratos_reviews_updated', { detail: updates.reviews }))
  }
  if (updates.salesHistory) {
    setLocalStore('kratos_sales_history', updates.salesHistory)
    window.dispatchEvent(new CustomEvent('kratos_sales_updated', { detail: updates.salesHistory }))
  }
}

// Push state to Cloud for immediate global sync across all devices
export const pushCloudState = async (updates = {}) => {
  const currentBundle = getLocalBundle()
  const newBundle = {
    siteConfig: updates.siteConfig || currentBundle.siteConfig,
    reviews: updates.reviews || currentBundle.reviews,
    salesHistory: updates.salesHistory || currentBundle.salesHistory,
    lastUpdated: Date.now()
  }

  lastSyncTimestamp = newBundle.lastUpdated

  // Update local storage and dispatch events for current tab
  broadcastLocalUpdates(updates)

  // Push to Vercel Serverless Sync API (/api/sync)
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBundle)
    })
  } catch (err) {
    console.warn('Cloud sync push error:', err)
  }

  // Backup push to paste.rs
  try {
    const backupRes = await fetch('https://paste.rs', {
      method: 'POST',
      body: JSON.stringify(newBundle)
    })
    if (backupRes.ok) {
      const backupUrl = await backupRes.text()
      if (backupUrl && backupUrl.trim()) {
        setLocalStore('kratos_backup_url', backupUrl.trim())
      }
    }
  } catch (e) {}
}

// Process cloud payload
const applyCloudPayload = (cloudData, onUpdateCallbacks = {}) => {
  if (!cloudData || !cloudData.lastUpdated) return false
  if (cloudData.lastUpdated <= lastSyncTimestamp) return false

  lastSyncTimestamp = cloudData.lastUpdated

  if (cloudData.siteConfig) {
    setLocalStore('kratos_site_config', cloudData.siteConfig)
    if (onUpdateCallbacks.onSiteConfig) onUpdateCallbacks.onSiteConfig(cloudData.siteConfig)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kratos_site_config_updated', { detail: cloudData.siteConfig }))
    }
  }

  if (cloudData.reviews) {
    setLocalStore('kratos_reviews', cloudData.reviews)
    if (onUpdateCallbacks.onReviews) onUpdateCallbacks.onReviews(cloudData.reviews)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kratos_reviews_updated', { detail: cloudData.reviews }))
    }
  }

  if (cloudData.salesHistory) {
    setLocalStore('kratos_sales_history', cloudData.salesHistory)
    if (onUpdateCallbacks.onSalesHistory) onUpdateCallbacks.onSalesHistory(cloudData.salesHistory)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('kratos_sales_updated', { detail: cloudData.salesHistory }))
    }
  }

  return true
}

// Pull latest global bundle from Cloud
export const fetchCloudState = async (onUpdateCallbacks = {}) => {
  // First try Vercel Sync API
  try {
    const res = await fetch('/api/sync', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (data && data.lastUpdated) {
        applyCloudPayload(data, onUpdateCallbacks)
        return data
      }
    }
  } catch (err) {}

  // Secondary fallback: paste.rs backup URL if saved
  try {
    const backupUrl = getLocalStore('kratos_backup_url', null)
    if (backupUrl) {
      const res = await fetch(backupUrl, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data && data.lastUpdated) {
          applyCloudPayload(data, onUpdateCallbacks)
          return data
        }
      }
    }
  } catch (e) {}

  return null
}

// Start real-time sync + focus listener
export const startCloudSyncLoop = (onUpdateCallbacks = {}, intervalMs = 4000) => {
  // Fetch immediately on mount
  fetchCloudState(onUpdateCallbacks)

  // Fetch when returning to tab / unlocking phone
  const handleFocus = () => {
    fetchCloudState(onUpdateCallbacks)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handleFocus()
    })
  }

  // Periodic polling interval
  const timer = setInterval(() => {
    fetchCloudState(onUpdateCallbacks)
  }, intervalMs)

  return () => {
    clearInterval(timer)
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocus)
    }
  }
}
