// Vercel Serverless Function for KratosBio Real-Time Cloud Sync
let globalState = null

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      if (body) {
        globalState = {
          ...body,
          lastUpdated: Date.now()
        }
      }
      return res.status(200).json({ success: true, state: globalState })
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
  }

  // GET request
  return res.status(200).json(globalState || {})
}
