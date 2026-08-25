// KratosBio Real-Time Cloud Sync Module v3
// Powered by High-Speed PubSub SSE (ntfy.sh) + Polling Fallback + Local Storage

const TOPIC = 'kratosbio_config_sync_v3'
const PUBLISH_URL = `https://ntfy.sh/${TOPIC}`
const POLL_URL = `https://ntfy.sh/${TOPIC}/json?poll=1`
const SSE_URL = `https://ntfy.sh/${TOPIC}/sse`

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

  // Push to Cloud API (ntfy.sh)
  try {
    const res = await fetch(PUBLISH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBundle)
    })
    if (!res.ok) {
      console.warn('Cloud sync push status:', res.status)
    }
  } catch (err) {
    console.warn('Cloud sync push error:', err)
  }
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
  try {
    const res = await fetch(POLL_URL, { cache: 'no-store' })
    if (!res.ok) return null

    const text = await res.text()
    if (!text || !text.trim()) return null

    const lines = text.trim().split('\n').filter(Boolean)
    const validMsgs = []

    for (const l of lines) {
      try {
        const obj = JSON.parse(l)
        if (obj.event === 'message' && obj.message) {
          const payload = typeof obj.message === 'string' ? JSON.parse(obj.message) : obj.message
          if (payload && payload.lastUpdated) validMsgs.push(payload)
        }
      } catch (e) {
        // Skip unparseable lines
      }
    }

    if (validMsgs.length === 0) return null

    // Sort by lastUpdated ascending and pick latest
    validMsgs.sort((a, b) => a.lastUpdated - b.lastUpdated)
    const latest = validMsgs[validMsgs.length - 1]

    applyCloudPayload(latest, onUpdateCallbacks)
    return latest
  } catch (err) {
    console.warn('Cloud sync fetch error:', err)
  }
  return null
}

// Start real-time SSE listener + fallback polling
export const startCloudSyncLoop = (onUpdateCallbacks = {}, intervalMs = 6000) => {
  // Initial fetch immediately
  fetchCloudState(onUpdateCallbacks)

  // Real-time EventSource (SSE) for instant zero-latency updates
  let eventSource = null
  if (typeof window !== 'undefined' && window.EventSource) {
    try {
      eventSource = new EventSource(SSE_URL)
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data && data.message) {
            const payload = typeof data.message === 'string' ? JSON.parse(data.message) : data.message
            applyCloudPayload(payload, onUpdateCallbacks)
          }
        } catch (e) {
          console.warn('SSE message parse error:', e)
        }
      }
      eventSource.onerror = (e) => {
        // SSE temporary disconnect, fallback polling handles it
      }
    } catch (e) {
      console.warn('EventSource initialization error:', e)
    }
  }

  // Polling loop as backup
  const timer = setInterval(() => {
    fetchCloudState(onUpdateCallbacks)
  }, intervalMs)

  return () => {
    clearInterval(timer)
    if (eventSource) eventSource.close()
  }
}
