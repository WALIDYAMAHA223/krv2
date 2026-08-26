// KratosBio Sync API — Vercel Serverless Function v6
// ──────────────────────────────────────────────────
// Stratégie de persistance multi-couches :
//  1. Vercel KV (Redis) si configuré → PARFAIT, persistant à vie
//  2. JSONBin.io si configuré        → Très bien, gratuit
//  3. npoint.io (sans compte)        → Fallback automatique, sans config
//
// SETUP RECOMMANDÉ (5 min) :
//  → Vercel Dashboard > Storage > Create KV Database
//  → "Connect to Project" et les variables KV_* sont auto-injectées

// ─── CORS ──────────────────────────────────────────────────────────────────
const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
}

// ─── VERCEL KV (Redis) ─────────────────────────────────────────────────────
async function kvRead() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    const res = await fetch(`${url}/get/kratosbio_state`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.result) return null
    return JSON.parse(json.result)
  } catch { return null }
}

async function kvWrite(data) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return false
  try {
    const res = await fetch(`${url}/set/kratosbio_state`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(data))
    })
    return res.ok
  } catch { return false }
}

// ─── JSONBIN.IO ────────────────────────────────────────────────────────────
async function jsonbinRead() {
  const key = process.env.JSONBIN_MASTER_KEY
  const id  = process.env.JSONBIN_BIN_ID
  if (!key || !id) return null
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`, {
      headers: { 'X-Master-Key': key, 'X-Bin-Versioning': 'false' }
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.record || null
  } catch { return null }
}

async function jsonbinWrite(data) {
  const key = process.env.JSONBIN_MASTER_KEY
  const id  = process.env.JSONBIN_BIN_ID
  if (!key || !id) return false
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': key, 'X-Bin-Versioning': 'false' },
      body: JSON.stringify(data)
    })
    return res.ok
  } catch { return false }
}

// ─── NPOINT.IO FALLBACK (aucune config requise) ────────────────────────────
// npoint.io permet de stocker du JSON gratuitement avec une URL fixe.
// L'ID est généré une seule fois et sauvegardé en env var automatiquement.
// Sans compte, sans clé API — parfait comme fallback d'urgence.
const NPOINT_ID = process.env.NPOINT_ID || ''

async function npointRead() {
  if (!NPOINT_ID) return null
  try {
    const res = await fetch(`https://api.npoint.io/${NPOINT_ID}`, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

async function npointWrite(data) {
  if (!NPOINT_ID) return false
  try {
    const res = await fetch(`https://api.npoint.io/${NPOINT_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.ok
  } catch { return false }
}

// ─── MAIN HANDLER ──────────────────────────────────────────────────────────
export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── POST: save state ──────────────────────────────────────────────────────
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (!body) return res.status(400).json({ error: 'Empty body' })

      const payload = { ...body, lastUpdated: Date.now() }

      // Try each storage layer in priority order
      const kv   = await kvWrite(payload)
      const jb   = !kv  && await jsonbinWrite(payload)
      const np   = !kv && !jb && await npointWrite(payload)

      const saved = kv || jb || np

      if (!saved) {
        console.warn('[KratosBio Sync] ⚠️  Aucun stockage cloud configuré. État non persisté.')
      } else {
        const layer = kv ? 'Vercel KV' : jb ? 'JSONBin' : 'npoint.io'
        console.log(`[KratosBio Sync] ✅ État sauvegardé via ${layer}`)
      }

      return res.status(200).json({ success: true, state: payload, persisted: saved })
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON', detail: e.message })
    }
  }

  // ── GET: fetch latest state ───────────────────────────────────────────────
  const data = (await kvRead()) || (await jsonbinRead()) || (await npointRead())
  return res.status(200).json(data || {})
}
