import { useState, useEffect } from 'react'
import { pushCloudState } from '../utils/cloudSync'

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)

const VialIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2h6"/>
    <path d="M10 2v5.5a2.5 2.5 0 0 1-.73 1.77l-4.04 4.04A4 4 0 0 0 4 16.14V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2.86a4 4 0 0 0-1.23-2.83l-4.04-4.04A2.5 2.5 0 0 1 14 7.5V2"/>
  </svg>
)

const MegaphoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l19-9-9 19-2-8-8-2z"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const DEFAULT_SALES_HISTORY = [
  {
    id: 'KB-849201',
    date: new Date(Date.now() - 3600000 * 3).toISOString(),
    formattedDate: new Date(Date.now() - 3600000 * 3).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
    items: [
      { name: 'RETA', dosage: '10MG', qty: 3, peptideCost: 150, bacQty: 3, bacCost: 9, totalCost: 159 }
    ],
    totalVials: 3,
    grandTotal: 159,
    status: 'Confirmé (WhatsApp)'
  },
  {
    id: 'KB-731942',
    date: new Date(Date.now() - 3600000 * 22).toISOString(),
    formattedDate: new Date(Date.now() - 3600000 * 22).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
    items: [
      { name: 'GHK-Cu', dosage: '100MG', qty: 3, peptideCost: 125, bacQty: 3, bacCost: 9, totalCost: 134 }
    ],
    totalVials: 3,
    grandTotal: 134,
    status: 'Confirmé (WhatsApp)'
  },
  {
    id: 'KB-610283',
    date: new Date(Date.now() - 3600000 * 45).toISOString(),
    formattedDate: new Date(Date.now() - 3600000 * 45).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
    items: [
      { name: 'RETA', dosage: '10MG', qty: 6, peptideCost: 300, bacQty: 6, bacCost: 18, totalCost: 318 }
    ],
    totalVials: 6,
    grandTotal: 318,
    status: 'Confirmé (WhatsApp)'
  },
  {
    id: 'KB-529104',
    date: new Date(Date.now() - 3600000 * 70).toISOString(),
    formattedDate: new Date(Date.now() - 3600000 * 70).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
    items: [
      { name: 'GHK-Cu', dosage: '100MG', qty: 1, peptideCost: 50, bacQty: 1, bacCost: 3, totalCost: 53 }
    ],
    totalVials: 1,
    grandTotal: 53,
    status: 'Confirmé (WhatsApp)'
  }
]

export default function AdminDashboard({ isOpen, onClose, siteConfig, onUpdateConfig }) {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)
  const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'announcement' | 'stocks' | 'promocodes' | 'reviews' | 'settings' | 'flashsale' | 'memo'

  // Editable config state
  const [config, setConfig] = useState(siteConfig)
  const [reviews, setReviews] = useState([])
  const [salesHistory, setSalesHistory] = useState([])
  const [saveMessage, setSaveMessage] = useState('')
  const [showManualSaleModal, setShowManualSaleModal] = useState(false)
  
  // Manual sale entry form state
  const [manualProd, setManualProd] = useState('RETA')
  const [manualQty, setManualQty] = useState(3)
  const [manualBac, setManualBac] = useState(true)
  const [manualCustomPrice, setManualCustomPrice] = useState('')  // prix libre saisi par l'admin
  const [manualPriceMode, setManualPriceMode] = useState('auto') // 'auto' | 'custom'

  // Monthly goal
  const [monthlyGoal, setMonthlyGoal] = useState(() => {
    return parseInt(localStorage.getItem('kratos_monthly_goal') || '1000')
  })
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalInput, setGoalInput] = useState('')

  // Admin memo
  const [adminMemo, setAdminMemo] = useState(() => {
    return localStorage.getItem('kratos_admin_memo') || ''
  })
  const [memoSaved, setMemoSaved] = useState(false)

  // Flash sale
  const [flashSaleForm, setFlashSaleForm] = useState({
    label: '',
    endDate: '',
    endTime: '',
    discountType: 'percent',
    discountValue: '',
    minQty: '1',
    products: []
  })

  useEffect(() => {
    if (config?.flashSale) {
      const fs = config.flashSale
      let ed = ''
      let et = ''
      if (fs.endsAt) {
        try {
          const d = new Date(fs.endsAt)
          if (!isNaN(d.getTime())) {
            const pad = (n) => String(n).padStart(2, '0')
            ed = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
            et = `${pad(d.getHours())}:${pad(d.getMinutes())}`
          }
        } catch (e) {}
      }
      setFlashSaleForm(prev => {
        if (!prev.label && !prev.discountValue) {
          return {
            label: fs.label || '',
            endDate: ed,
            endTime: et,
            discountType: fs.discountType || 'percent',
            discountValue: fs.discountValue ? String(fs.discountValue) : '',
            minQty: fs.minQty ? String(fs.minQty) : '1',
            products: fs.products || []
          }
        }
        return prev
      })
    }
  }, [config?.flashSale])

  // Promo code management state
  const [newPromoCode, setNewPromoCode] = useState('')
  const [newPromoType, setNewPromoType] = useState('percent')
  const [newPromoValue, setNewPromoValue] = useState('')

  const handleAddPromo = (e) => {
    e.preventDefault()
    if (!newPromoCode.trim() || !newPromoValue) return
    const codeObj = {
      id: Date.now().toString(),
      code: newPromoCode.trim().toUpperCase(),
      discountType: newPromoType,
      discountValue: Number(newPromoValue),
      active: true
    }
    const updated = [...(config.promoCodes || []), codeObj]
    const newConf = { ...config, promoCodes: updated }
    setConfig(newConf)
    if (onUpdateConfig) onUpdateConfig(newConf)
    pushCloudState({ siteConfig: newConf })
    setNewPromoCode('')
    setNewPromoValue('')
    setSaveMessage('✓ Code promo créé avec succès !')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleTogglePromo = (id) => {
    const updated = (config.promoCodes || []).map(p => p.id === id ? { ...p, active: !p.active } : p)
    const newConf = { ...config, promoCodes: updated }
    setConfig(newConf)
    if (onUpdateConfig) onUpdateConfig(newConf)
    pushCloudState({ siteConfig: newConf })
  }

  const handleDeletePromo = (id) => {
    const updated = (config.promoCodes || []).filter(p => p.id !== id)
    const newConf = { ...config, promoCodes: updated }
    setConfig(newConf)
    if (onUpdateConfig) onUpdateConfig(newConf)
    pushCloudState({ siteConfig: newConf })
  }

  useEffect(() => {
    setConfig(siteConfig)
  }, [siteConfig])

  const loadData = () => {
    // Load reviews
    const storedReviews = JSON.parse(localStorage.getItem('kratos_reviews') || '[]')
    setReviews(storedReviews)

    // Load sales history or initialize default sample sales
    const storedSales = localStorage.getItem('kratos_sales_history')
    if (storedSales) {
      setSalesHistory(JSON.parse(storedSales))
    } else {
      localStorage.setItem('kratos_sales_history', JSON.stringify(DEFAULT_SALES_HISTORY))
      setSalesHistory(DEFAULT_SALES_HISTORY)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
    window.addEventListener('kratos_sales_updated', loadData)
    window.addEventListener('kratos_reviews_updated', loadData)
    return () => {
      window.removeEventListener('kratos_sales_updated', loadData)
      window.removeEventListener('kratos_reviews_updated', loadData)
    }
  }, [isOpen])

  const handleLogin = (e) => {
    e.preventDefault()
    if (pin.trim() === '12042006') {
      setIsAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const updateAndSaveConfig = (newConf) => {
    setConfig(newConf)
    if (onUpdateConfig) onUpdateConfig(newConf)
    pushCloudState({ siteConfig: newConf })
  }

  const handleSaveConfig = () => {
    updateAndSaveConfig(config)
    setSaveMessage('✓ Modifications enregistrées avec succès !')
    setTimeout(() => setSaveMessage(''), 4000)
  }

  const handleApproveReview = (id) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r)
    setReviews(updated)
    pushCloudState({ reviews: updated })
  }

  const handleDeleteReview = (id) => {
    const updated = reviews.filter(r => r.id !== id)
    setReviews(updated)
    pushCloudState({ reviews: updated })
  }

  const handleDeleteSale = (id) => {
    if (window.confirm('Voulez-vous supprimer cette commande de l\'historique des ventes ?')) {
      const updated = salesHistory.filter(s => s.id !== id)
      setSalesHistory(updated)
      pushCloudState({ salesHistory: updated })
    }
  }

  const handleClearAllSales = () => {
    if (window.confirm('ÊTES-VOUS SÛR ? Cela va effacer tout l\'historique du chiffre d\'affaires.')) {
      setSalesHistory([])
      pushCloudState({ salesHistory: [] })
    }
  }

  const calcManualSale = () => {
    let basePrice
    let defaultPack3
    if (manualProd === 'RETA-20MG') {
      basePrice = config.products?.RETA?.dosages?.['20MG']?.price || 95
      defaultPack3 = config.pack3Price20 || (basePrice * 2.5)
    } else if (manualProd === 'RETA' || manualProd === 'RETA-10MG') {
      basePrice = config.products?.RETA?.dosages?.['10MG']?.price || (config.products?.RETA?.price || 60)
      defaultPack3 = (basePrice === 60 && config.pack3Price) ? config.pack3Price : (basePrice * 2.5)
    } else {
      basePrice = config.products?.['GHK-Cu']?.price || 50
      defaultPack3 = basePrice * 2.5
    }
    const bacPrice = config.bacWaterPrice || 3
    const bacCost = manualBac ? (manualQty * bacPrice) : 0
    let peptideCost
    if (manualPriceMode === 'custom' && manualCustomPrice !== '') {
      peptideCost = parseFloat(manualCustomPrice) || 0
    } else {
      const packs = Math.floor(manualQty / 3)
      const remainder = manualQty % 3
      peptideCost = (packs * defaultPack3) + (remainder * basePrice)
    }
    const grandTotal = peptideCost + bacCost
    return { peptideCost, bacCost, grandTotal }
  }

  const handleAddManualSale = (e) => {
    e.preventDefault()
    const { peptideCost, bacCost, grandTotal } = calcManualSale()

    const isReta20 = manualProd === 'RETA-20MG'
    const isGHK = manualProd === 'GHK-Cu'
    const prodName = isGHK ? 'GHK-Cu' : 'RETA'
    const prodDosage = isReta20 ? '20MG' : (isGHK ? '100MG' : '10MG')

    const newOrder = {
      id: 'KB-M' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      formattedDate: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      items: [
        {
          name: prodName,
          dosage: prodDosage,
          qty: manualQty,
          peptideCost,
          bacQty: manualBac ? manualQty : 0,
          bacCost,
          totalCost: grandTotal
        }
      ],
      totalVials: manualQty,
      grandTotal,
      status: manualPriceMode === 'custom' ? 'Manuelle / Prix libre' : 'Manuelle / Comptoir'
    }

    const updated = [newOrder, ...salesHistory]
    setSalesHistory(updated)
    pushCloudState({ salesHistory: updated })
    setShowManualSaleModal(false)
    // Reset
    setManualPriceMode('auto')
    setManualCustomPrice('')
  }

  const exportSalesCSV = () => {
    if (salesHistory.length === 0) return alert('Aucune vente à exporter.')
    let csv = 'ID Commande;Date;Articles;Total Fioles;Montant Total (€);Statut\n'
    salesHistory.forEach(s => {
      const itemsStr = s.items.map(i => `${i.name} (x${i.qty})`).join(' + ')
      csv += `"${s.id}";"${s.formattedDate}";"${itemsStr}";${s.totalVials};${s.grandTotal.toFixed(2)};"${s.status}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `kratosbio_sales_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  // Calculate Key Performance Indicators (KPIs)
  const totalRevenue = salesHistory.reduce((sum, s) => sum + (s.grandTotal || 0), 0)
  const totalOrdersCount = salesHistory.length
  const totalVialsSold = salesHistory.reduce((sum, s) => sum + (s.totalVials || 0), 0)
  const averageOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0

  const retaVialsSold = salesHistory.reduce((sum, s) => {
    const retaItem = s.items?.find(i => i.name.includes('RETA'))
    return sum + (retaItem?.qty || 0)
  }, 0)

  const ghkVialsSold = salesHistory.reduce((sum, s) => {
    const ghkItem = s.items?.find(i => i.name.includes('GHK'))
    return sum + (ghkItem?.qty || 0)
  }, 0)

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  const presetColors = [
    { label: '⬛ Noir Lab', value: '#0a0a0a' },
    { label: '🟦 Bleu Tech', value: '#1d4ed8' },
    { label: '🟩 Vert Émeraude', value: '#15803d' },
    { label: '🟪 Violet Quantum', value: '#6d28d9' },
    { label: '🟥 Rouge Rubis', value: '#b91c1c' },
    { label: '🟨 Or Premium', value: '#b45309' }
  ]

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.78)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        border: '1px solid #cbd5e1'
      }}>
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--black)'
          }}
        >
          ✕
        </button>

        {!isAuthenticated ? (
          /* LOGIN FORM WITH PIN 12042006 */
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto',
              color: '#ffffff'
            }}>
              <LockIcon />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              DASHBOARD KRATOSBIO
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', marginBottom: '1.8rem' }}>
              Accès sécurisé réservé aux administrateurs. Saisissez votre code PIN.
            </p>

            <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '0 auto' }}>
              <input 
                type="password"
                maxLength={12}
                placeholder="Code PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  letterSpacing: '0.25em',
                  borderRadius: '8px',
                  border: pinError ? '2px solid #ef4444' : '1.5px solid var(--gray-300)',
                  outline: 'none',
                  marginBottom: '1rem'
                }}
              />

              {pinError && (
                <p style={{ fontSize: '0.76rem', color: '#ef4444', fontWeight: 800, margin: '-0.5rem 0 1rem 0' }}>
                  Code PIN incorrect. Veuillez réessayez.
                </p>
              )}

              <button 
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.9rem', justifyContent: 'center', fontWeight: 800 }}
              >
                DÉVERROUILLER LE PANNEAU
              </button>
            </form>
          </div>
        ) : (
          /* ADMIN CONTROL PANEL */
          <div>
            {/* HEADER TITLE & TABS */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.2rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--gray-600)', textTransform: 'uppercase' }}>
                    KRATOSBIO LABORATOIRE • SUITE ADMIN
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0.1rem 0 0 0', letterSpacing: '-0.02em' }}>
                    TABLEAU DE BORD & ANALYTICS
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.7rem', background: '#dcfce7', color: '#15803d', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '99px' }}>
                    🟢 SYSTÈME EN LIGNE
                  </span>
                </div>
              </div>

              {/* NAVIGATION TABS BAR */}
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
                {[
                  { id: 'analytics', label: '📊 ANALYTICS & CA', badge: null },
                  { id: 'announcement', label: '📢 BARRE D\'ANNONCE', badge: config?.announcement?.enabled ? 'ACTIF' : 'INACTIF' },
                  { id: 'stocks', label: '📦 STOCKS & PRIX', badge: null },
                  { id: 'flashsale', label: '⚡ FLASH SALE', badge: config?.flashSale?.active ? 'LIVE' : null },
                  { id: 'promocodes', label: '🏷️ CODES PROMO', badge: config?.promoCodes?.filter(p=>p.active!==false)?.length ? `${config.promoCodes.filter(p=>p.active!==false).length}` : null },
                  { id: 'reviews', label: '⭐ AVIS CLIENTS', badge: pendingCount > 0 ? `${pendingCount}` : null },
                  { id: 'memo', label: '📝 MÉMO ADMIN', badge: null },
                  { id: 'settings', label: '⚙️ CONFIGURATION', badge: null }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '0.55rem 0.9rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      borderRadius: '8px',
                      border: activeTab === tab.id ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                      background: activeTab === tab.id ? 'var(--black)' : '#ffffff',
                      color: activeTab === tab.id ? '#ffffff' : 'var(--black)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 900,
                        padding: '0.1rem 0.35rem',
                        borderRadius: '4px',
                        background: activeTab === tab.id ? '#ffffff' : '#1e293b',
                        color: activeTab === tab.id ? 'var(--black)' : '#ffffff'
                      }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {saveMessage && (
              <div style={{ padding: '0.75rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{saveMessage}</span>
                <button onClick={() => setSaveMessage('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontWeight: 900 }}>✕</button>
              </div>
            )}

            {/* TAB 1: FINANCIAL ANALYTICS & REVENUE DASHBOARD */}
            {activeTab === 'analytics' && (
              <div>
                {/* 4 TOP KPI CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.8rem' }}>
                  
                  {/* KPI 1: CHIFFRE D'AFFAIRES */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#15803d', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--gray-600)' }}>CHIFFRE D'AFFAIRES</span>
                      <TrendingUpIcon />
                    </div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--black)', letterSpacing: '-0.02em' }}>
                      {totalRevenue.toFixed(2).replace('.', ',')} €
                    </p>
                    <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700 }}>
                      +100% des ventes WhatsApp
                    </span>
                  </div>

                  {/* KPI 2: COMMANDES TOTALES */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#3b82f6', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--gray-600)' }}>COMMANDES</span>
                      <ShoppingBagIcon />
                    </div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--black)', letterSpacing: '-0.02em' }}>
                      {totalOrdersCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>ventes</span>
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                      Recues via le site
                    </span>
                  </div>

                  {/* KPI 3: FIOLES VENDUES */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8b5cf6', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--gray-600)' }}>FIOLES VENDUES</span>
                      <VialIcon />
                    </div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--black)', letterSpacing: '-0.02em' }}>
                      {totalVialsSold} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>fioles</span>
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--gray-600)', fontWeight: 700 }}>
                      RETA: {retaVialsSold} · GHK: {ghkVialsSold}
                    </span>
                  </div>

                  {/* KPI 4: PANIER MOYEN */}
                  <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f59e0b', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--gray-600)' }}>PANIER MOYEN</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>💶</span>
                    </div>
                    <p style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.2rem 0', color: 'var(--black)', letterSpacing: '-0.02em' }}>
                      {averageOrderValue.toFixed(2).replace('.', ',')} €
                    </p>
                    <span style={{ fontSize: '0.65rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                      Par commande passée
                    </span>
                  </div>

                </div>

                {/* MONTHLY GOAL PROGRESS BAR */}
                {(() => {
                  const now = new Date()
                  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
                  const monthRevenue = salesHistory
                    .filter(s => new Date(s.date) >= monthStart)
                    .reduce((sum, s) => sum + (s.grandTotal || 0), 0)
                  const pct = monthlyGoal > 0 ? Math.min(100, (monthRevenue / monthlyGoal) * 100) : 0
                  const monthName = now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
                  return (
                    <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <p style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gray-600)', margin: '0 0 0.1rem 0' }}>OBJECTIF MENSUEL — {monthName.toUpperCase()}</p>
                          <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0, color: 'var(--black)' }}>
                            <span style={{ fontWeight: 900, fontSize: '1rem' }}>{monthRevenue.toFixed(0)} €</span>
                            <span style={{ color: 'var(--gray-500)' }}> / {monthlyGoal} €</span>
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: pct >= 100 ? '#15803d' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>{pct.toFixed(0)}%</span>
                          {!editingGoal ? (
                            <button type="button" onClick={() => { setGoalInput(monthlyGoal); setEditingGoal(true) }}
                              style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                              ✏️ Modifier
                            </button>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                              <input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)}
                                style={{ width: '90px', padding: '0.3rem 0.5rem', borderRadius: '5px', border: '1.5px solid var(--black)', fontWeight: 800, fontSize: '0.85rem' }} />
                              <span style={{ fontWeight: 800 }}>€</span>
                              <button type="button" onClick={() => { const v = parseInt(goalInput) || 1000; setMonthlyGoal(v); localStorage.setItem('kratos_monthly_goal', v); setEditingGoal(false) }}
                                style={{ fontSize: '0.68rem', fontWeight: 900, padding: '0.3rem 0.6rem', borderRadius: '5px', border: 'none', background: 'var(--black)', color: '#fff', cursor: 'pointer' }}>
                                ✓ OK
                              </button>
                              <button type="button" onClick={() => setEditingGoal(false)}
                                style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.3rem 0.5rem', borderRadius: '5px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${pct}%`, height: '100%', borderRadius: '99px',
                          background: pct >= 100 ? '#15803d' : pct >= 50 ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      {pct >= 100 && (
                        <p style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800, margin: '0.5rem 0 0 0', textAlign: 'center' }}>🎉 Objectif du mois atteint !</p>
                      )}
                    </div>
                  )
                })()}

                {/* SALES HISTORY CONTROLS */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 900, margin: 0 }}>HISTORIQUE DÉTAILLÉ DES VENTES ({salesHistory.length})</h4>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setShowManualSaleModal(true)}
                      style={{
                        padding: '0.45rem 0.8rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        background: 'var(--black)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      + Saisir Vente Manuelle
                    </button>

                    <button
                      type="button"
                      onClick={exportSalesCSV}
                      style={{
                        padding: '0.45rem 0.8rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        background: '#ffffff',
                        color: 'var(--black)',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <DownloadIcon /> Exporter (CSV)
                    </button>

                    {salesHistory.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllSales}
                        style={{
                          padding: '0.45rem 0.8rem',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          borderRadius: '6px',
                          background: '#fef2f2',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          cursor: 'pointer'
                        }}
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </div>

                {/* SALES HISTORY TABLE */}
                {salesHistory.length === 0 ? (
                  <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', border: '1.5px dashed #cbd5e1' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                      Aucune vente enregistrée pour le moment.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: '0 0 1rem 0' }}>
                      Les commandes passées via le panier s'afficheront automatiquement ici.
                    </p>
                    <button onClick={() => setShowManualSaleModal(true)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                      + Ajouter une première vente de test
                    </button>
                  </div>
                ) : (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflowX: 'auto', background: '#ffffff' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: 'var(--gray-600)', fontWeight: 800, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>ID COMMANDE</th>
                          <th style={{ padding: '0.75rem 1rem' }}>DATE & HEURE</th>
                          <th style={{ padding: '0.75rem 1rem' }}>DÉTAIL DES ARTICLES</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>FIOLES</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>MONTANT TOTAL</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesHistory.map((s, idx) => (
                          <tr key={s.id || idx} style={{ borderBottom: idx < salesHistory.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 900, color: 'var(--black)', whiteSpace: 'nowrap' }}>
                              {s.id}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
                              {s.formattedDate}
                            </td>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              {s.items?.map((it, i) => (
                                <div key={i} style={{ marginBottom: '0.15rem' }}>
                                  <strong style={{ color: 'var(--black)' }}>{it.name} {it.dosage}</strong> (x{it.qty})
                                  {it.bacQty > 0 && <span style={{ color: 'var(--gray-500)', fontSize: '0.7rem' }}> + Eau BAC (x{it.bacQty})</span>}
                                </div>
                              ))}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 800 }}>
                              {s.totalVials}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 900, color: 'var(--black)', fontSize: '0.85rem' }}>
                              {(s.grandTotal || 0).toFixed(2).replace('.', ',')} €
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              <button 
                                onClick={() => handleDeleteSale(s.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                                title="Supprimer de l'historique"
                              >
                                <TrashIcon />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB: FLASH SALE */}
            {activeTab === 'flashsale' && (() => {
              // Live price preview
              const retaPrice = config?.products?.RETA?.dosages?.['10MG']?.price || (config?.products?.RETA?.price || 60)
              const reta20Price = config?.products?.RETA?.dosages?.['20MG']?.price || 95
              const ghkPrice = config?.products?.['GHK-Cu']?.price || 50
              const dv = parseFloat(flashSaleForm.discountValue) || 0
              const calcFlashPrice = (base) => {
                if (!dv) return base
                if (flashSaleForm.discountType === 'percent') return Math.max(0, base * (1 - dv / 100))
                return Math.max(0, base - dv)
              }
              const retaFlash = calcFlashPrice(retaPrice)
              const reta20Flash = calcFlashPrice(reta20Price)
              const ghkFlash = calcFlashPrice(ghkPrice)
              const isFormValid = flashSaleForm.label && flashSaleForm.discountValue && flashSaleForm.endDate && flashSaleForm.endTime && flashSaleForm.products?.length > 0
              return (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.3rem' }}>⚡ GESTIONNAIRE FLASH SALE</h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.4rem' }}>
                    Activez une vente flash limitée dans le temps. Un <strong>compte à rebours</strong> apparaîtra en haut du site et le prix réduit s'affichera directement sur la fiche produit.
                  </p>

                  {/* CURRENT STATUS BANNER */}
                  <div style={{ padding: '1rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', border: config?.flashSale?.active ? '2px solid #f59e0b' : '1.5px solid #e2e8f0', background: config?.flashSale?.active ? '#fffbeb' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-600)', margin: '0 0 0.2rem 0' }}>STATUT ACTUEL</p>
                      {config?.flashSale?.active ? (
                        <div>
                          <p style={{ margin: '0 0 0.2rem 0', fontWeight: 900, color: '#d97706', fontSize: '0.9rem' }}>
                            🔥 FLASH SALE EN COURS — {config.flashSale.label}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400e', fontWeight: 700 }}>
                            Produit(s) : {(config.flashSale.products || []).map(p => {
                              if (p === 'RETA-10MG' || p === 'RETA') return 'RETA (10MG)'
                              if (p === 'RETA-20MG') return 'RETA (20MG)'
                              if (p === 'GHK-Cu') return 'GHK-Cu (100MG)'
                              return p
                            }).join(' + ')} &nbsp;·&nbsp;
                            Remise : {config.flashSale.discountType === 'percent' ? `-${config.flashSale.discountValue}%` : `-${config.flashSale.discountValue} €`}
                          </p>
                          {config.flashSale.endsAt && <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: '#92400e' }}>Expire le : {new Date(config.flashSale.endsAt).toLocaleString('fr-FR')}</p>}
                        </div>
                      ) : (
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--gray-500)', fontSize: '0.85rem' }}>Aucune Flash Sale active pour le moment.</p>
                      )}
                    </div>
                    {config?.flashSale?.active && (
                      <button type="button" onClick={() => updateAndSaveConfig({ ...config, flashSale: { ...config.flashSale, active: false } })}
                        style={{ padding: '0.5rem 1rem', fontWeight: 900, fontSize: '0.75rem', borderRadius: '7px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}>
                        🛑 DÉSACTIVER
                      </button>
                    )}
                  </div>

                  {/* FORM */}
                  <div style={{ padding: '1.4rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', display: 'grid', gap: '1.1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 900, margin: 0 }}>CONFIGURER UNE NOUVELLE FLASH SALE</h4>

                    {/* LIBELLÉ */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Libellé affiché sur la barre de comptage</label>
                      <input type="text" value={flashSaleForm.label}
                        onChange={e => setFlashSaleForm(f => ({ ...f, label: e.target.value }))}
                        placeholder="ex: ⚡ VENTE FLASH — Offre limitée sur RETA"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.88rem' }} />
                    </div>

                    {/* PRODUIT CONCERNÉ */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Produit(s) en promotion</label>
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {[
                          { id: 'RETA-10MG', label: '⚗️ RETA (10MG)' },
                          { id: 'RETA-20MG', label: '⚗️ RETA (20MG)' },
                          { id: 'GHK-Cu', label: '🧬 GHK-Cu (100MG)' },
                          { id: 'ALL', label: '⚡ Tous' }
                        ].map(item => {
                          const curProds = flashSaleForm.products || []
                          const isReta10Sel = curProds.some(p => p === 'RETA-10MG' || p === 'RETA')
                          const isReta20Sel = curProds.includes('RETA-20MG')
                          const isGhkSel = curProds.includes('GHK-Cu')
                          const isAllSel = isReta10Sel && isReta20Sel && isGhkSel

                          const isSelected = item.id === 'ALL'
                            ? isAllSel
                            : item.id === 'RETA-10MG'
                              ? isReta10Sel
                              : item.id === 'RETA-20MG'
                                ? isReta20Sel
                                : isGhkSel

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                if (item.id === 'ALL') {
                                  if (isAllSel) {
                                    setFlashSaleForm(f => ({ ...f, products: [] }))
                                  } else {
                                    setFlashSaleForm(f => ({ ...f, products: ['RETA-10MG', 'RETA-20MG', 'GHK-Cu'] }))
                                  }
                                } else if (item.id === 'RETA-10MG') {
                                  if (isReta10Sel) {
                                    setFlashSaleForm(f => ({
                                      ...f,
                                      products: (f.products || []).filter(p => p !== 'RETA-10MG' && p !== 'RETA')
                                    }))
                                  } else {
                                    setFlashSaleForm(f => ({
                                      ...f,
                                      products: [...new Set([...(f.products || []), 'RETA-10MG'])]
                                    }))
                                  }
                                } else {
                                  const cur = flashSaleForm.products || []
                                  const next = cur.includes(item.id)
                                    ? cur.filter(p => p !== item.id)
                                    : [...cur, item.id]
                                  setFlashSaleForm(f => ({ ...f, products: [...new Set(next)] }))
                                }
                              }}
                              style={{
                                padding: '0.5rem 1.1rem',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                borderRadius: '7px',
                                cursor: 'pointer',
                                border: isSelected ? '2px solid #f59e0b' : '1px solid #cbd5e1',
                                background: isSelected ? '#fffbeb' : '#ffffff',
                                color: isSelected ? '#d97706' : 'var(--black)',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                      {(!flashSaleForm.products || flashSaleForm.products.length === 0) && (
                        <p style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, margin: '0.3rem 0 0 0' }}>⚠ Sélectionnez au moins un produit</p>
                      )}
                    </div>

                    {/* TYPE + VALEUR RÉDUCTION */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Type de réduction</label>
                        <select value={flashSaleForm.discountType}
                          onChange={e => setFlashSaleForm(f => ({ ...f, discountType: e.target.value }))}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}>
                          <option value="percent">Pourcentage — ex: -20%</option>
                          <option value="fixed">Montant fixe — ex: -15 €</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          {flashSaleForm.discountType === 'percent' ? 'Réduction (%)' : 'Réduction (€)'}
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input type="number" min={1}
                            value={flashSaleForm.discountValue}
                            onChange={e => setFlashSaleForm(f => ({ ...f, discountValue: e.target.value }))}
                            placeholder={flashSaleForm.discountType === 'percent' ? 'ex: 20' : 'ex: 15'}
                            style={{ width: '100%', padding: '0.65rem 2rem 0.65rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, boxSizing: 'border-box' }} />
                          <span style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#64748b' }}>
                            {flashSaleForm.discountType === 'percent' ? '%' : '€'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PREVIEW PRIX */}
                    {dv > 0 && (flashSaleForm.products || []).length > 0 && (
                      <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '8px', padding: '0.8rem 1rem', display: 'grid', gap: '0.6rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#92400e', margin: '0 0 0.2rem 0' }}>APERÇU DES PRIX APRÈS RÉDUCTION</p>
                        {((flashSaleForm.products || []).includes('RETA-10MG') || (flashSaleForm.products || []).includes('RETA')) && (
                          <div style={{ borderBottom: '1px dashed #fde68a', paddingBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 700 }}>RETA (10MG) — À l'unité</span>
                              <span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.5rem' }}>{retaPrice.toFixed(2)} €</span>
                                <span style={{ fontWeight: 900, color: '#d97706', fontSize: '1rem' }}>{retaFlash.toFixed(2)} €</span>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400e', marginTop: '0.15rem' }}>
                              <span style={{ fontWeight: 600 }}>└ Pack 3 Fioles (-50% sur la 3e)</span>
                              <span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.4rem' }}>{(config.pack3Price || 150).toFixed(2)} €</span>
                                <span style={{ fontWeight: 900, color: '#d97706' }}>{(retaFlash * 2.5).toFixed(2)} €</span>
                              </span>
                            </div>
                          </div>
                        )}
                        {(flashSaleForm.products || []).includes('RETA-20MG') && (
                          <div style={{ borderBottom: '1px dashed #fde68a', paddingBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 700 }}>RETA (20MG) — À l'unité</span>
                              <span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.5rem' }}>{reta20Price.toFixed(2)} €</span>
                                <span style={{ fontWeight: 900, color: '#d97706', fontSize: '1rem' }}>{reta20Flash.toFixed(2)} €</span>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400e', marginTop: '0.15rem' }}>
                              <span style={{ fontWeight: 600 }}>└ Pack 3 Fioles (-50% sur la 3e)</span>
                              <span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.4rem' }}>{(config.pack3Price20 !== undefined ? config.pack3Price20 : 237.5).toFixed(2)} €</span>
                                <span style={{ fontWeight: 900, color: '#d97706' }}>{(reta20Flash * 2.5).toFixed(2)} €</span>
                              </span>
                            </div>
                          </div>
                        )}
                        {(flashSaleForm.products || []).includes('GHK-Cu') && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <span style={{ fontWeight: 700 }}>GHK-Cu (100MG) — À l'unité</span>
                              <span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.5rem' }}>{ghkPrice.toFixed(2)} €</span>
                                <span style={{ fontWeight: 900, color: '#d97706', fontSize: '1rem' }}>{ghkFlash.toFixed(2)} €</span>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400e', marginTop: '0.15rem' }}>
                              <span style={{ fontWeight: 600 }}>└ Pack 3 Fioles (-50% sur la 3e)</span>
                              <span>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '0.4rem' }}>{(ghkPrice * 2.5).toFixed(2)} €</span>
                                <span style={{ fontWeight: 900, color: '#d97706' }}>{(ghkFlash * 2.5).toFixed(2)} €</span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}


                    {/* QUANTITÉ MINIMUM */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Quantité minimum pour bénéficier du prix</label>
                        <div style={{ position: 'relative' }}>
                          <input type="number" min={1}
                            value={flashSaleForm.minQty}
                            onChange={e => setFlashSaleForm(f => ({ ...f, minQty: e.target.value }))}
                            style={{ width: '100%', padding: '0.65rem 3rem 0.65rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, boxSizing: 'border-box' }} />
                          <span style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>fiole{parseInt(flashSaleForm.minQty) > 1 ? 's' : ''}</span>
                        </div>
                        <p style={{ fontSize: '0.68rem', color: '#64748b', margin: '0.3rem 0 0 0' }}>ex: 2 = le prix flash s'active à partir de 2 fioles</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '1.8rem' }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.6rem', fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                          💡 En dessous de {flashSaleForm.minQty || 1} fiole{parseInt(flashSaleForm.minQty) > 1 ? 's' : ''}, le prix normal s'affiche avec un badge d'invitation.
                        </div>
                      </div>
                    </div>

                    {/* DATE + HEURE FIN */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Date de fin</label>
                        <input type="date" value={flashSaleForm.endDate}
                          onChange={e => setFlashSaleForm(f => ({ ...f, endDate: e.target.value }))}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Heure de fin</label>
                        <input type="time" value={flashSaleForm.endTime}
                          onChange={e => setFlashSaleForm(f => ({ ...f, endTime: e.target.value }))}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }} />
                      </div>
                    </div>

                    <button type="button" disabled={!isFormValid}
                      onClick={() => {
                        const endDateTime = new Date(`${flashSaleForm.endDate}T${flashSaleForm.endTime}`)
                        updateAndSaveConfig({
                          ...config,
                          flashSale: {
                            active: true,
                            label: flashSaleForm.label,
                            products: flashSaleForm.products,
                            discountType: flashSaleForm.discountType,
                            discountValue: parseFloat(flashSaleForm.discountValue),
                            minQty: parseInt(flashSaleForm.minQty) || 1,
                            endsAt: endDateTime.toISOString()
                          }
                        })
                        setSaveMessage('⚡ Flash Sale activée et diffusée en direct !')
                        setTimeout(() => setSaveMessage(''), 4000)
                      }}
                      style={{
                        width: '100%', padding: '0.95rem', fontWeight: 900, fontSize: '0.88rem',
                        borderRadius: '8px', border: 'none', cursor: isFormValid ? 'pointer' : 'not-allowed',
                        background: isFormValid ? '#f59e0b' : '#cbd5e1',
                        color: '#ffffff',
                        transition: 'all 0.2s'
                      }}>
                      ⚡ LANCER LA FLASH SALE EN DIRECT
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* TAB: MÉMO ADMIN */}
            {activeTab === 'memo' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.3rem' }}>📝 MÉMO ADMIN</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.2rem' }}>
                  Votre bloc-notes privé. Notez des infos importantes : numéros de clients, commandes en attente, rappels, stocks à commander...
                </p>

                <div style={{ position: 'relative' }}>
                  <textarea
                    value={adminMemo}
                    onChange={e => { setAdminMemo(e.target.value); setMemoSaved(false) }}
                    placeholder={`Exemples de notes :\n• Client Ahmed — commande 6x RETA — livraison lundi\n• Réapprovisionner GHK-Cu avant fin du mois\n• Appeler fournisseur : +33 6 XX XX XX XX\n• Penser à activer le code promo RENTRÉE25`}
                    rows={16}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      lineHeight: 1.7,
                      resize: 'vertical',
                      outline: 'none',
                      background: '#fffdf5',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('kratos_admin_memo', adminMemo)
                      setMemoSaved(true)
                      setTimeout(() => setMemoSaved(false), 3000)
                    }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', fontWeight: 900, fontSize: '0.85rem' }}
                  >
                    💾 SAUVEGARDER LE MÉMO
                  </button>
                  {memoSaved && (
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d' }}>✓ Mémo sauvegardé localement</span>
                  )}
                  <button
                    type="button"
                    onClick={() => { if (window.confirm('Effacer tout le mémo ?')) { setAdminMemo(''); localStorage.setItem('kratos_admin_memo', '') } }}
                    style={{ marginLeft: 'auto', padding: '0.6rem 1rem', fontSize: '0.72rem', fontWeight: 800, borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                  >
                    🗑️ Effacer
                  </button>
                </div>

                <div style={{ marginTop: '1.2rem', padding: '0.8rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                  💡 Le mémo est sauvegardé localement sur cet appareil. Il ne sera pas synchronisé entre plusieurs appareils.
                </div>
              </div>
            )}

            {/* TAB 2: TOP ANNOUNCEMENT BAR PROMO MANAGER */}
            {activeTab === 'announcement' && (
              <div>
                <div style={{ padding: '1.4rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>BARRE D'ANNONCE EN HAUT DU SITE (HEADER)</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: '0.2rem 0 0 0' }}>
                        Affichez un bandeau promotionnel personnalisable tout en haut de la page.
                      </p>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', background: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <input 
                        type="checkbox"
                        checked={Boolean(config.announcement?.enabled)}
                        onChange={(e) => updateAndSaveConfig({
                          ...config,
                          announcement: {
                            ...(config.announcement || {}),
                            enabled: e.target.checked
                          }
                        })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--black)', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.78rem', fontWeight: 900 }}>
                        {config.announcement?.enabled ? '🟢 ANNONCE ACTIVÉE' : '🔴 ANNONCE DESACTIVÉE'}
                      </span>
                    </label>
                  </div>

                  {/* ANNOUNCEMENT LIVE PREVIEW BOX */}
                  <div style={{ marginBottom: '1.4rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem', color: 'var(--gray-600)' }}>
                      APERÇU EN DIRECT DU BANDEAU DU SITE :
                    </label>
                    <div 
                      style={{
                        background: config.announcement?.bg || '#0a0a0a',
                        color: config.announcement?.textColor || '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.6rem 1.2rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.8rem',
                        flexWrap: 'wrap',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <span>{config.announcement?.text || 'Saisissez votre message promotionnel...'}</span>
                      {config.announcement?.linkText && (
                        <span style={{
                          background: 'rgba(255,255,255,0.22)',
                          color: config.announcement?.textColor || '#ffffff',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 800
                        }}>
                          {config.announcement.linkText}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FORM FIELDS FOR ANNOUNCEMENT BAR */}
                  <div style={{ display: 'grid', gap: '1.2rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                        TEXTE DE L'ANNONCE PROMOTIONNELLE
                      </label>
                      <input 
                        type="text" 
                        value={config.announcement?.text || ''}
                        onChange={(e) => updateAndSaveConfig({
                          ...config,
                          announcement: {
                            ...(config.announcement || {}),
                            text: e.target.value
                          }
                        })}
                        placeholder="ex: ⚡ OFFRE EXCLUSIVE : -50% SUR CHAQUE 3ÈM FIOLE DE GHK-CU & RETA • EXPÉDITION 24/48H"
                        style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                      />
                    </div>

                    {/* COLOR PRESETS ROW */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                        COULEUR DE FOND DU BANDEAU (THÈMES PRÉDÉFINIS)
                      </label>
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {presetColors.map(c => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => updateAndSaveConfig({
                              ...config,
                              announcement: {
                                ...(config.announcement || {}),
                                bg: c.value
                              }
                            })}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              borderRadius: '6px',
                              border: config.announcement?.bg === c.value ? '2px solid var(--black)' : '1px solid #cbd5e1',
                              background: c.value,
                              color: '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                          TEXTE DU BOUTON CTA (OPTIONNEL)
                        </label>
                        <input 
                          type="text" 
                          value={config.announcement?.linkText || ''}
                          onChange={(e) => updateAndSaveConfig({
                            ...config,
                            announcement: {
                              ...(config.announcement || {}),
                              linkText: e.target.value
                            }
                          })}
                          placeholder="ex: PROFITER DE L'OFFRE ➜"
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                          LIEN DU BOUTON (EX: #selection)
                        </label>
                        <input 
                          type="text" 
                          value={config.announcement?.linkUrl || '#selection'}
                          onChange={(e) => updateAndSaveConfig({
                            ...config,
                            announcement: {
                              ...(config.announcement || {}),
                              linkUrl: e.target.value
                            }
                          })}
                          placeholder="ex: #selection"
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <button 
                  onClick={handleSaveConfig}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontWeight: 900, fontSize: '0.85rem' }}
                >
                  ENREGISTRER LA BARRE D'ANNONCE
                </button>
              </div>
            )}

            {/* TAB 3: STOCKS & PRICING CONTROL */}
            {activeTab === 'stocks' && (() => {
              const reta10Stock = config.products?.RETA?.dosages?.['10MG']?.stock ?? (config.products?.RETA?.stock ?? 0)
              const reta10Price = config.products?.RETA?.dosages?.['10MG']?.price ?? (config.products?.RETA?.price ?? 60)
              const reta10Orig  = config.products?.RETA?.dosages?.['10MG']?.originalPrice ?? (config.products?.RETA?.originalPrice ?? 0)

              const reta20Stock = config.products?.RETA?.dosages?.['20MG']?.stock ?? 15
              const reta20Price = config.products?.RETA?.dosages?.['20MG']?.price ?? 95
              const reta20Orig  = config.products?.RETA?.dosages?.['20MG']?.originalPrice ?? 0

              const updateReta10 = (updates) => {
                const nextStock = updates.stock !== undefined ? updates.stock : reta10Stock
                const nextPrice = updates.price !== undefined ? updates.price : reta10Price
                const nextOrig  = updates.originalPrice !== undefined ? updates.originalPrice : reta10Orig
                updateAndSaveConfig({
                  ...config,
                  products: {
                    ...config.products,
                    RETA: {
                      ...config.products?.RETA,
                      stock: nextStock,
                      price: nextPrice,
                      originalPrice: nextOrig,
                      dosages: {
                        ...(config.products?.RETA?.dosages || {}),
                        '10MG': {
                          ...(config.products?.RETA?.dosages?.['10MG'] || {}),
                          stock: nextStock,
                          price: nextPrice,
                          originalPrice: nextOrig
                        },
                        '20MG': {
                          ...(config.products?.RETA?.dosages?.['20MG'] || {}),
                          stock: reta20Stock,
                          price: reta20Price,
                          originalPrice: reta20Orig
                        }
                      }
                    }
                  }
                })
              }

              const updateReta20 = (updates) => {
                const nextStock = updates.stock !== undefined ? updates.stock : reta20Stock
                const nextPrice = updates.price !== undefined ? updates.price : reta20Price
                const nextOrig  = updates.originalPrice !== undefined ? updates.originalPrice : reta20Orig
                updateAndSaveConfig({
                  ...config,
                  products: {
                    ...config.products,
                    RETA: {
                      ...config.products?.RETA,
                      dosages: {
                        ...(config.products?.RETA?.dosages || {}),
                        '10MG': {
                          ...(config.products?.RETA?.dosages?.['10MG'] || {}),
                          stock: reta10Stock,
                          price: reta10Price,
                          originalPrice: reta10Orig
                        },
                        '20MG': {
                          ...(config.products?.RETA?.dosages?.['20MG'] || {}),
                          stock: nextStock,
                          price: nextPrice,
                          originalPrice: nextOrig
                        }
                      }
                    }
                  }
                })
              }

              return (
                <div>
                  <div style={{ display: 'grid', gap: '1.4rem' }}>
                    
                    {/* RETA 10MG PRODUCT CONTROL */}
                    <div style={{ padding: '1.2rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>RETA (Retatrutide 10mg)</h4>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Dosage standard 10mg</span>
                        </div>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          background: reta10Stock > 0 ? '#dcfce7' : '#fee2e2',
                          color: reta10Stock > 0 ? '#15803d' : '#ef4444'
                        }}>
                          {reta10Stock > 0 ? `🟢 EN STOCK (${reta10Stock})` : '🔴 RUPTURE DE STOCK'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                            STOCK DISPONIBLE (UNITÉS)
                          </label>
                          <input 
                            type="number" 
                            min={0}
                            value={reta10Stock}
                            onChange={(e) => updateReta10({ stock: parseInt(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                          />
                          {/* QUICK STOCK ADJUSTMENT BUTTONS */}
                          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {[-5, -1, 1, 5].map(delta => (
                              <button
                                key={delta}
                                type="button"
                                onClick={() => updateReta10({ stock: Math.max(0, reta10Stock + delta) })}
                                style={{ flex: 1, padding: '0.25rem', fontSize: '0.68rem', fontWeight: 800, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => updateReta10({ stock: 0 })}
                              style={{ padding: '0.25rem 0.4rem', fontSize: '0.65rem', fontWeight: 800, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Rupture
                            </button>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.4rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                                PRIX DE VENTE (€)
                              </label>
                              <input 
                                type="number" 
                                value={reta10Price}
                                onChange={(e) => updateReta10({ price: parseFloat(e.target.value) || 0 })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }}
                              />
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800 }}>
                                  PRIX BARRÉ (€)
                                </label>
                                {Boolean(reta10Orig && reta10Orig > reta10Price) && (
                                  <button
                                    type="button"
                                    onClick={() => updateReta10({ originalPrice: 0 })}
                                    style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '0.1rem 0.3rem', cursor: 'pointer' }}
                                  >
                                    ❌ Enlever
                                  </button>
                                )}
                              </div>
                              <input 
                                type="number" 
                                value={reta10Orig || ''}
                                placeholder="0 (Désactivé)"
                                onChange={(e) => updateReta10({ originalPrice: parseFloat(e.target.value) || 0 })}
                                style={{ 
                                  width: '100%', 
                                  padding: '0.6rem', 
                                  borderRadius: '6px', 
                                  border: (reta10Orig > reta10Price) ? '1.5px solid #16a34a' : '1px solid #cbd5e1', 
                                  fontSize: '0.85rem', 
                                  fontWeight: 800 
                                }}
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontStyle: 'italic' }}>
                            💡 Mettez 0 ou effacez pour ne PAS afficher de prix barré sur RETA 10mg.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RETA 20MG PRODUCT CONTROL */}
                    <div style={{ padding: '1.2rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>RETA (Retatrutide 20mg)</h4>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Haut dosage 20mg</span>
                        </div>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          background: reta20Stock > 0 ? '#dcfce7' : '#fee2e2',
                          color: reta20Stock > 0 ? '#15803d' : '#ef4444'
                        }}>
                          {reta20Stock > 0 ? `🟢 EN STOCK (${reta20Stock})` : '🔴 RUPTURE DE STOCK'}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                            STOCK DISPONIBLE (UNITÉS)
                          </label>
                          <input 
                            type="number" 
                            min={0}
                            value={reta20Stock}
                            onChange={(e) => updateReta20({ stock: parseInt(e.target.value) || 0 })}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                          />
                          {/* QUICK STOCK ADJUSTMENT BUTTONS */}
                          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {[-5, -1, 1, 5].map(delta => (
                              <button
                                key={delta}
                                type="button"
                                onClick={() => updateReta20({ stock: Math.max(0, reta20Stock + delta) })}
                                style={{ flex: 1, padding: '0.25rem', fontSize: '0.68rem', fontWeight: 800, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                {delta > 0 ? `+${delta}` : delta}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => updateReta20({ stock: 0 })}
                              style={{ padding: '0.25rem 0.4rem', fontSize: '0.65rem', fontWeight: 800, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Rupture
                            </button>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.4rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                                PRIX DE VENTE (€)
                              </label>
                              <input 
                                type="number" 
                                value={reta20Price}
                                onChange={(e) => updateReta20({ price: parseFloat(e.target.value) || 0 })}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }}
                              />
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800 }}>
                                  PRIX BARRÉ (€)
                                </label>
                                {Boolean(reta20Orig && reta20Orig > reta20Price) && (
                                  <button
                                    type="button"
                                    onClick={() => updateReta20({ originalPrice: 0 })}
                                    style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '0.1rem 0.3rem', cursor: 'pointer' }}
                                  >
                                    ❌ Enlever
                                  </button>
                                )}
                              </div>
                              <input 
                                type="number" 
                                value={reta20Orig || ''}
                                placeholder="0 (Désactivé)"
                                onChange={(e) => updateReta20({ originalPrice: parseFloat(e.target.value) || 0 })}
                                style={{ 
                                  width: '100%', 
                                  padding: '0.6rem', 
                                  borderRadius: '6px', 
                                  border: (reta20Orig > reta20Price) ? '1.5px solid #16a34a' : '1px solid #cbd5e1', 
                                  fontSize: '0.85rem', 
                                  fontWeight: 800 
                                }}
                              />
                            </div>
                          </div>
                          <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontStyle: 'italic' }}>
                            💡 Mettez 0 ou effacez pour ne PAS afficher de prix barré sur RETA 20mg.
                          </p>
                        </div>
                      </div>
                    </div>

                  {/* GHK-Cu PRODUCT CONTROL */}
                  <div style={{ padding: '1.2rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>GHK-Cu (100mg)</h4>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        background: config.products['GHK-Cu'].stock > 0 ? '#dcfce7' : '#fee2e2',
                        color: config.products['GHK-Cu'].stock > 0 ? '#15803d' : '#ef4444'
                      }}>
                        {config.products['GHK-Cu'].stock > 0 ? `🟢 EN STOCK (${config.products['GHK-Cu'].stock})` : '🔴 RUPTURE DE STOCK'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                          STOCK DISPONIBLE (UNITÉS)
                        </label>
                        <input 
                          type="number" 
                          min={0}
                          value={config.products['GHK-Cu'].stock}
                          onChange={(e) => updateAndSaveConfig({
                            ...config,
                            products: {
                              ...config.products,
                              'GHK-Cu': { ...config.products['GHK-Cu'], stock: parseInt(e.target.value) || 0 }
                            }
                          })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                        />
                        {/* QUICK STOCK ADJUSTMENT BUTTONS */}
                        <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem' }}>
                          {[-5, -1, 1, 5].map(delta => (
                            <button
                              key={delta}
                              type="button"
                              onClick={() => updateAndSaveConfig({
                                ...config,
                                products: {
                                  ...config.products,
                                  'GHK-Cu': { ...config.products['GHK-Cu'], stock: Math.max(0, config.products['GHK-Cu'].stock + delta) }
                                }
                              })}
                              style={{ flex: 1, padding: '0.25rem', fontSize: '0.68rem', fontWeight: 800, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => updateAndSaveConfig({
                              ...config,
                              products: {
                                ...config.products,
                                'GHK-Cu': { ...config.products['GHK-Cu'], stock: 0 }
                              }
                            })}
                            style={{ padding: '0.25rem 0.4rem', fontSize: '0.65rem', fontWeight: 800, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Rupture
                          </button>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.4rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                              PRIX DE VENTE (€)
                            </label>
                            <input 
                              type="number" 
                              value={config.products['GHK-Cu'].price}
                              onChange={(e) => updateAndSaveConfig({
                                ...config,
                                products: {
                                  ...config.products,
                                  'GHK-Cu': { ...config.products['GHK-Cu'], price: parseFloat(e.target.value) || 0 }
                                }
                              })}
                              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }}
                            />
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800 }}>
                                PRIX BARRÉ (€)
                              </label>
                              {Boolean(config.products['GHK-Cu'].originalPrice && config.products['GHK-Cu'].originalPrice > config.products['GHK-Cu'].price) && (
                                <button
                                  type="button"
                                  onClick={() => updateAndSaveConfig({
                                    ...config,
                                    products: {
                                      ...config.products,
                                      'GHK-Cu': { ...config.products['GHK-Cu'], originalPrice: 0 }
                                    }
                                  })}
                                  style={{ fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', padding: '0.1rem 0.3rem', cursor: 'pointer' }}
                                >
                                  ❌ Enlever
                                </button>
                              )}
                            </div>
                            <input 
                              type="number" 
                              value={config.products['GHK-Cu'].originalPrice || ''}
                              placeholder="0 (Désactivé)"
                              onChange={(e) => updateAndSaveConfig({
                                ...config,
                                products: {
                                  ...config.products,
                                  'GHK-Cu': { ...config.products['GHK-Cu'], originalPrice: parseFloat(e.target.value) || 0 }
                                }
                              })}
                              style={{ 
                                width: '100%', 
                                padding: '0.6rem', 
                                borderRadius: '6px', 
                                border: (config.products['GHK-Cu'].originalPrice > config.products['GHK-Cu'].price) ? '1.5px solid #16a34a' : '1px solid #cbd5e1', 
                                fontSize: '0.85rem', 
                                fontWeight: 800 
                              }}
                            />
                          </div>
                        </div>
                        <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontStyle: 'italic' }}>
                          💡 Mettez 0 ou effacez pour ne PAS afficher de prix barré sur GHK-Cu.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PACK & OPTIONS CONTROL */}
                  <div style={{ padding: '1.2rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 1rem 0' }}>OFFRES SPÉCIALES & TARIFS</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                          PRIX PACK 3 FIOLES RETA 10MG (€)
                        </label>
                        <input 
                          type="number" 
                          value={config.pack3Price || 150}
                          onChange={(e) => updateAndSaveConfig({ ...config, pack3Price: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                          PRIX PACK 3 FIOLES RETA 20MG (€)
                        </label>
                        <input 
                          type="number" 
                          value={config.pack3Price20 !== undefined ? config.pack3Price20 : 237.5}
                          onChange={(e) => updateAndSaveConfig({ ...config, pack3Price20: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                          PRIX EAU BACTÉRIOSTATIQUE (€ / fiole)
                        </label>
                        <input 
                          type="number" 
                          value={config.bacWaterPrice || 3}
                          onChange={(e) => updateAndSaveConfig({ ...config, bacWaterPrice: parseFloat(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <button 
                  onClick={handleSaveConfig}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', fontWeight: 900, fontSize: '0.85rem' }}
                >
                  ENREGISTRER TOUS LES STOCKS ET PRIX
                </button>
              </div>
            )})()}

            {/* TAB: PROMO CODES MANAGEMENT */}
            {activeTab === 'promocodes' && (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏷️ GESTIONNAIRE DES CODES PROMO
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1.4rem' }}>
                  Créez vos propres codes de réduction. Vous pouvez appliquer des pourcentages (-10%, -20%) ou des remises fixes en Euros (-15€).
                </p>

                {/* CREATE PROMO FORM */}
                <form onSubmit={handleAddPromo} style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 900, margin: '0 0 1rem 0' }}>Nouveau Code Promo</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto', gap: '0.8rem', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>CODE PROMO</label>
                      <input 
                        type="text" 
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                        placeholder="Code promo"
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>TYPE DE REMISE</label>
                      <select 
                        value={newPromoType}
                        onChange={(e) => setNewPromoType(e.target.value)}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }}
                      >
                        <option value="percent">Pourcentage (%)</option>
                        <option value="fixed">Montant Fixe (€)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, marginBottom: '0.3rem' }}>VALEUR</label>
                      <input 
                        type="number" 
                        min="1"
                        value={newPromoValue}
                        onChange={(e) => setNewPromoValue(e.target.value)}
                        placeholder={newPromoType === 'percent' ? "ex: 15 (%)" : "ex: 10 (€)"}
                        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 800 }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ padding: '0.65rem 1.2rem', fontSize: '0.78rem', fontWeight: 900, borderRadius: '6px', cursor: 'pointer', height: '40px' }}
                    >
                      + CRÉER
                    </button>
                  </div>
                </form>

                {/* PROMO CODES LIST */}
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  {(config.promoCodes || []).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '10px', color: '#64748b' }}>
                      Aucun code promo créé pour le moment.
                    </div>
                  ) : (
                    (config.promoCodes || []).map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.2rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 900, background: 'var(--black)', color: '#ffffff', padding: '0.3rem 0.7rem', borderRadius: '6px', letterSpacing: '0.06em' }}>
                            {p.code}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d' }}>
                            {p.discountType === 'percent' ? `-${p.discountValue}% sur la commande` : `-${p.discountValue}.00 € sur la commande`}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <button 
                            type="button"
                            onClick={() => handleTogglePromo(p.id)}
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 900,
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              border: 'none',
                              background: p.active !== false ? '#dcfce7' : '#fee2e2',
                              color: p.active !== false ? '#15803d' : '#ef4444',
                              cursor: 'pointer'
                            }}
                          >
                            {p.active !== false ? '🟢 ACTIF' : '🔴 INACTIF'}
                          </button>

                          <button 
                            type="button"
                            onClick={() => handleDeletePromo(p.id)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#ef4444',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div>
                {reviews.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.85rem', padding: '2.5rem 0' }}>
                    Aucun avis client soumis pour le moment.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {reviews.map(rev => (
                      <div 
                        key={rev.id}
                        style={{
                          padding: '1.1rem',
                          borderRadius: '10px',
                          border: rev.status === 'approved' ? '2px solid #22c55e' : '1.5px solid #cbd5e1',
                          background: rev.status === 'approved' ? '#f0fdf4' : '#ffffff',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 900, fontSize: '0.88rem' }}>{rev.name}</span>
                            <span style={{ fontSize: '0.68rem', background: '#e2e8f0', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                              {rev.product}
                            </span>
                            <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>{'★'.repeat(rev.stars)}</span>
                            <span style={{ fontSize: '0.68rem', color: rev.status === 'approved' ? '#16a34a' : '#d97706', fontWeight: 800 }}>
                              [{rev.status === 'approved' ? 'Publié ✓' : 'En attente de validation ⏳'}]
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--gray-800)', margin: 0, lineHeight: 1.5 }}>
                            « {rev.text} »
                          </p>
                          {rev.photo && (
                            <div style={{ marginTop: '0.6rem' }}>
                              <img 
                                src={rev.photo} 
                                alt="Photo jointe par le client" 
                                style={{ height: '70px', borderRadius: '6px', border: '1px solid #cbd5e1', objectFit: 'cover' }} 
                              />
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {rev.status !== 'approved' && (
                            <button
                              onClick={() => handleApproveReview(rev.id)}
                              style={{
                                background: '#22c55e',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 0.8rem',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                            >
                              <CheckIcon /> VALIDER ET PUBLIER
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              padding: '0.5rem 0.8rem',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <TrashIcon /> SUPPRIMER
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: GLOBAL SETTINGS & EXPORT */}
            {activeTab === 'settings' && (
              <div>
                <div style={{ padding: '1.4rem', border: '1.5px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: '0 0 1rem 0' }}>COORDONNÉES ET CONTACT WHATSAPP</h4>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                      NUMÉRO WHATSAPP RECEVANT LES COMMANDES (FORMAT INTERNATIONAL EX: 32465983104)
                    </label>
                    <input 
                      type="text" 
                      value={config.whatsappNumber || ''}
                      placeholder="ex: 32465983104"
                      onChange={(e) => updateAndSaveConfig({ ...config, whatsappNumber: e.target.value })}
                      style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800 }}
                    />
                    <span style={{ fontSize: '0.68rem', color: 'var(--gray-600)', display: 'block', marginTop: '0.3rem' }}>
                      C'est à ce numéro que sont envoyés les récapitulatifs complets de commandes générés par le site.
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleSaveConfig}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontWeight: 900, fontSize: '0.85rem' }}
                >
                  ENREGISTRER LA CONFIGURATION GLOBALE
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* MANUAL SALE MODAL */}
      {showManualSaleModal && (() => {
        const { peptideCost, bacCost, grandTotal } = calcManualSale()
        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}>
            <div style={{
              background: '#ffffff',
              width: '100%',
              maxWidth: '460px',
              borderRadius: '14px',
              padding: '1.8rem',
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
            }}>
              <button onClick={() => { setShowManualSaleModal(false); setManualPriceMode('auto'); setManualCustomPrice('') }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 800 }}>✕</button>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 0.3rem 0' }}>SAISIR UNE VENTE MANUELLE</h4>
              <p style={{ fontSize: '0.72rem', color: 'var(--gray-600)', margin: '0 0 1.2rem 0' }}>Enregistrez une vente effectuée hors site.</p>
              
              <form onSubmit={handleAddManualSale}>
                {/* PRODUIT */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Produit</label>
                  <select 
                    value={manualProd}
                    onChange={(e) => setManualProd(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}
                  >
                    <option value="RETA-10MG">RETA (10MG) — {config.products?.RETA?.dosages?.['10MG']?.price || config.products?.RETA?.price || 60}€</option>
                    <option value="RETA-20MG">RETA (20MG) — {config.products?.RETA?.dosages?.['20MG']?.price || 95}€</option>
                    <option value="GHK-Cu">GHK-Cu (100MG) — {config.products?.['GHK-Cu']?.price || 50}€</option>
                  </select>
                </div>

                {/* QUANTITÉ */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.3rem', textTransform: 'uppercase' }}>Quantité de fioles</label>
                  <input 
                    type="number"
                    min={1}
                    value={manualQty}
                    onChange={(e) => setManualQty(parseInt(e.target.value) || 1)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, fontSize: '0.9rem' }}
                  />
                </div>

                {/* PRIX — MODE AUTO / PERSONNALISÉ */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, marginBottom: '0.4rem', textTransform: 'uppercase' }}>Prix peptides</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={() => setManualPriceMode('auto')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        border: manualPriceMode === 'auto' ? '2px solid var(--black)' : '1px solid #cbd5e1',
                        background: manualPriceMode === 'auto' ? 'var(--black)' : '#f8fafc',
                        color: manualPriceMode === 'auto' ? '#fff' : 'var(--black)',
                        cursor: 'pointer'
                      }}
                    >
                      🔄 Auto (tarif site)
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualPriceMode('custom')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        borderRadius: '6px',
                        border: manualPriceMode === 'custom' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                        background: manualPriceMode === 'custom' ? '#7c3aed' : '#f8fafc',
                        color: manualPriceMode === 'custom' ? '#fff' : 'var(--black)',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Prix libre
                    </button>
                  </div>

                  {manualPriceMode === 'auto' && (
                    <div style={{ padding: '0.55rem 0.8rem', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--gray-600)', fontWeight: 600 }}>
                      Prix calculé automatiquement selon le tarif configuré dans « Stocks & Prix ».
                    </div>
                  )}

                  {manualPriceMode === 'custom' && (
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="Ex: 125.00"
                        value={manualCustomPrice}
                        onChange={(e) => setManualCustomPrice(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 2.2rem 0.65rem 0.8rem',
                          borderRadius: '6px',
                          border: '2px solid #7c3aed',
                          fontWeight: 800,
                          fontSize: '1rem',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#7c3aed', fontSize: '1rem' }}>€</span>
                    </div>
                  )}
                </div>

                {/* EAU BAC */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox"
                      checked={manualBac}
                      onChange={(e) => setManualBac(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--black)' }}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Inclure Eau Bactériostatique (+{config.bacWaterPrice || 3}€/fiole)</span>
                  </label>
                </div>

                {/* RÉCAPITULATIF DYNAMIQUE */}
                <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.2rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--gray-600)', margin: '0 0 0.6rem 0' }}>Récapitulatif</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Peptides ({manualQty} fiole{manualQty > 1 ? 's' : ''})</span>
                    <span style={{ fontWeight: 800 }}>{peptideCost.toFixed(2).replace('.', ',')} €</span>
                  </div>
                  {manualBac && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: 'var(--gray-600)' }}>Eau BAC ({manualQty} fiole{manualQty > 1 ? 's' : ''})</span>
                      <span style={{ fontWeight: 800 }}>{bacCost.toFixed(2).replace('.', ',')} €</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.4rem' }}>
                    <span style={{ fontWeight: 900 }}>TOTAL</span>
                    <span style={{ fontWeight: 900, color: grandTotal > 0 ? '#15803d' : 'var(--gray-400)' }}>{grandTotal.toFixed(2).replace('.', ',')} €</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={manualPriceMode === 'custom' && manualCustomPrice === ''}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem', fontWeight: 900, opacity: (manualPriceMode === 'custom' && manualCustomPrice === '') ? 0.5 : 1 }}
                >
                  + ENREGISTRER — {grandTotal.toFixed(2).replace('.', ',')} €
                </button>
              </form>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
