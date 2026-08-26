// KratosBio Real-Time Cloud Sync System v6
// ─────────────────────────────────────────
// Corrections v6 vs v5 :
//  ✅ Plus de dépendance sur lastSyncTimestamp en mémoire volatile
//  ✅ Comparaison du timestamp via localStorage pour survivre aux refreshs
//  ✅ Intervalle de polling réduit à 5s pour une expérience quasi-temps réel
//  ✅ Les visiteurs reçoivent toujours l'état le plus récent, sans cache

// ─── UTILS LOCAUX ──────────────────────────────────────────────────────────

export const getLocalStore = (key, defaultVal) => {
  try {
    if (typeof localStorage === 'undefined') return defaultVal
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultVal
  } catch { return defaultVal }
}

export const setLocalStore = (key, val) => {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) { console.error('LocalStorage write error:', e) }
}

// Dernier timestamp connu, lu depuis localStorage pour survivre aux refreshs
const getLastKnownTimestamp = () =>
  getLocalStore('kratos_last_cloud_ts', 0)

const saveLastKnownTimestamp = (ts) =>
  setLocalStore('kratos_last_cloud_ts', ts)

// ─── BUNDLE LOCAL ──────────────────────────────────────────────────────────

export const getLocalBundle = () => ({
  siteConfig:   getLocalStore('kratos_site_config', null),
  reviews:      getLocalStore('kratos_reviews', []),
  salesHistory: getLocalStore('kratos_sales_history', [])
})

// ─── DIFFUSION LOCALE (même onglet) ────────────────────────────────────────

const broadcastLocalUpdates = (updates) => {
  if (typeof window === 'undefined') return

  if (updates.siteConfig !== undefined) {
    setLocalStore('kratos_site_config', updates.siteConfig)
    window.dispatchEvent(new CustomEvent('kratos_site_config_updated', { detail: updates.siteConfig }))
  }
  if (updates.reviews !== undefined) {
    setLocalStore('kratos_reviews', updates.reviews)
    window.dispatchEvent(new CustomEvent('kratos_reviews_updated', { detail: updates.reviews }))
  }
  if (updates.salesHistory !== undefined) {
    setLocalStore('kratos_sales_history', updates.salesHistory)
    window.dispatchEvent(new CustomEvent('kratos_sales_updated', { detail: updates.salesHistory }))
  }
}

// ─── PUSH VERS LE CLOUD ─────────────────────────────────────────────────────

export const pushCloudState = async (updates = {}) => {
  const currentBundle = getLocalBundle()
  const newBundle = {
    siteConfig:   updates.siteConfig   !== undefined ? updates.siteConfig   : currentBundle.siteConfig,
    reviews:      updates.reviews      !== undefined ? updates.reviews      : currentBundle.reviews,
    salesHistory: updates.salesHistory !== undefined ? updates.salesHistory : currentBundle.salesHistory,
    lastUpdated: Date.now()
  }

  // Mise à jour locale immédiate pour l'onglet courant
  broadcastLocalUpdates(updates)
  saveLastKnownTimestamp(newBundle.lastUpdated)

  // Push vers l'API Vercel (qui persiste dans KV/JSONBin/npoint)
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBundle)
    })
  } catch (err) {
    console.warn('[KratosBio Sync] Erreur push cloud:', err)
  }
}

// ─── APPLIQUER UN PAYLOAD CLOUD ────────────────────────────────────────────

const applyCloudPayload = (cloudData, onUpdateCallbacks = {}) => {
  if (!cloudData || !cloudData.lastUpdated) return false

  // Ne rien faire si on a déjà ce timestamp (évite les boucles inutiles)
  const knownTs = getLastKnownTimestamp()
  if (cloudData.lastUpdated <= knownTs) return false

  saveLastKnownTimestamp(cloudData.lastUpdated)

  if (cloudData.siteConfig) {
    setLocalStore('kratos_site_config', cloudData.siteConfig)
    if (onUpdateCallbacks.onSiteConfig) onUpdateCallbacks.onSiteConfig(cloudData.siteConfig)
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('kratos_site_config_updated', { detail: cloudData.siteConfig }))
  }

  if (cloudData.reviews) {
    setLocalStore('kratos_reviews', cloudData.reviews)
    if (onUpdateCallbacks.onReviews) onUpdateCallbacks.onReviews(cloudData.reviews)
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('kratos_reviews_updated', { detail: cloudData.reviews }))
  }

  if (cloudData.salesHistory) {
    setLocalStore('kratos_sales_history', cloudData.salesHistory)
    if (onUpdateCallbacks.onSalesHistory) onUpdateCallbacks.onSalesHistory(cloudData.salesHistory)
    if (typeof window !== 'undefined')
      window.dispatchEvent(new CustomEvent('kratos_sales_updated', { detail: cloudData.salesHistory }))
  }

  return true
}

// ─── FETCH DEPUIS LE CLOUD ─────────────────────────────────────────────────

export const fetchCloudState = async (onUpdateCallbacks = {}) => {
  try {
    // cache: 'no-store' force le navigateur à ne JAMAIS utiliser le cache HTTP
    const res = await fetch('/api/sync', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    })
    if (res.ok) {
      const data = await res.json()
      if (data && data.lastUpdated) {
        applyCloudPayload(data, onUpdateCallbacks)
        return data
      }
    }
  } catch (err) {
    console.warn('[KratosBio Sync] Erreur fetch cloud:', err)
  }
  return null
}

// ─── BOUCLE DE SYNC TEMPS RÉEL ─────────────────────────────────────────────

export const startCloudSyncLoop = (onUpdateCallbacks = {}, intervalMs = 5000) => {
  // Fetch immédiat au montage — ignoré si timestamp identique
  fetchCloudState(onUpdateCallbacks)

  // Re-fetch quand l'onglet redevient actif (retour depuis un autre onglet/app)
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') fetchCloudState(onUpdateCallbacks)
  }
  const handleFocus = () => fetchCloudState(onUpdateCallbacks)

  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
  }

  // Polling périodique
  const timer = setInterval(() => fetchCloudState(onUpdateCallbacks), intervalMs)

  // Cleanup
  return () => {
    clearInterval(timer)
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }
}
