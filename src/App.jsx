import { useState, useEffect } from 'react'
import './index.css'
import Header from './components/Header'
import MolecularBackground from './components/MolecularBackground'
import ProductSelection from './components/ProductSelection'
import ScienceSection from './components/ScienceSection'
import ProtocolSection from './components/ProtocolSection'
import FullProtocolPage from './components/FullProtocolPage'
import DosageCalculator from './components/DosageCalculator'
import Footer from './components/Footer'
import OrderModal from './components/OrderModal'
import AdminDashboard from './components/AdminDashboard'
import { startCloudSyncLoop, pushCloudState } from './utils/cloudSync'

const TargetIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)
const BoltIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const MoleculeIcon2 = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/>
    <line x1="5" y1="19" x2="19" y2="19"/>
  </svg>
)
const SparklesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2"/>
  </svg>
)
const DNAIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M2 9c6.667 6 13.333 0 20 6"/>
    <line x1="9" y1="9" x2="9" y2="15"/><line x1="15" y1="9" x2="15" y2="15"/>
  </svg>
)

const DEFAULT_SITE_CONFIG = {
  products: {
    RETA: {
      name: 'RETA',
      dosage: '10MG',
      price: 60,
      originalPrice: 0,
      stock: 20,
      description: 'RETA est un peptide de recherche de haute pureté destiné à l\'étude des mécanismes de régulation métabolique et de lipolyse.'
    },
    'GHK-Cu': {
      name: 'GHK-Cu',
      dosage: '100MG',
      price: 50,
      originalPrice: 0,
      stock: 9,
      description: 'GHK-Cu est un complexe cuivrique hautement dosé destiné à l\'étude de la régénération cutanée et la synthèse du collagène.'
    }
  },
  promoCodes: [
    { id: '1', code: 'KRATOS10', discountType: 'percent', discountValue: 10, active: true },
    { id: '2', code: 'BIOTECH15', discountType: 'fixed', discountValue: 15, active: true }
  ],
  pack3Price: 150,
  bacWaterPrice: 3,
  whatsappNumber: '32465983104',
  announcement: {
    enabled: false,
    text: '',
    bg: '#0a0a0a',
    textColor: '#ffffff',
    linkText: '',
    linkUrl: '#selection'
  }
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('RETA')

  // Full Guide Page View state
  const [currentView, setCurrentView] = useState(() => {
    return window.location.hash === '#guide-complet' ? 'guide-complet' : 'home'
  })

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#guide-complet') {
        setCurrentView('guide-complet')
        window.scrollTo(0, 0)
      } else {
        setCurrentView('home')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const openFullGuide = () => {
    window.location.hash = '#guide-complet'
    setCurrentView('guide-complet')
    window.scrollTo(0, 0)
  }

  const backToHome = () => {
    window.location.hash = '#guide'
    setCurrentView('home')
  }

  const goToCalculator = () => {
    window.location.hash = '#calculateur'
    setCurrentView('home')
    setTimeout(() => {
      document.getElementById('calculateur')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  // Site Config with localStorage persistence
  const [siteConfig, setSiteConfig] = useState(() => {
    const saved = localStorage.getItem('kratos_site_config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          products: {
            RETA: { ...DEFAULT_SITE_CONFIG.products.RETA, ...(parsed.products?.RETA || {}) },
            'GHK-Cu': { ...DEFAULT_SITE_CONFIG.products['GHK-Cu'], ...(parsed.products?.['GHK-Cu'] || {}) }
          },
          announcement: { ...DEFAULT_SITE_CONFIG.announcement, ...(parsed.announcement || {}) },
          promoCodes: parsed.promoCodes || DEFAULT_SITE_CONFIG.promoCodes,
          whatsappNumber: (parsed.whatsappNumber && parsed.whatsappNumber !== '33700000000') ? parsed.whatsappNumber : '32465983104'
        }
      } catch (e) {
        return DEFAULT_SITE_CONFIG
      }
    }
    return DEFAULT_SITE_CONFIG
  })

  const updateSiteConfig = (newConfig) => {
    setSiteConfig(newConfig)
    pushCloudState({ siteConfig: newConfig })
  }

  // Real-time Cloud Synchronization across PC, Mobile, and all visitors
  useEffect(() => {
    const stopSync = startCloudSyncLoop({
      onSiteConfig: (newConf) => setSiteConfig(newConf)
    }, 3000)
    return () => stopSync()
  }, [])

  // Keyboard shortcut for Admin: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault()
        setAdminOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCardClick = (prod) => {
    setSelectedProduct(prod)
  }

  const handleOrderButtonClick = () => {
    const el = document.getElementById('selection')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.findIndex(i => i.name===item.name && i.dosage===item.dosage)
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = { ...next[existing], qty: next[existing].qty + item.qty }
        return next
      }
      return [...prev, item]
    })
    setModalOpen(true)
  }

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const next = [...prev]
      const oldQty = next[index].qty
      const newQty = oldQty + delta
      if (newQty <= 0) {
        next.splice(index, 1)
      } else {
        const oldBacQty = next[index].bacWaterQty !== undefined ? next[index].bacWaterQty : oldQty
        const shouldSyncBac = oldBacQty === oldQty
        next[index] = { 
          ...next[index], 
          qty: newQty,
          bacWaterQty: shouldSyncBac ? newQty : Math.max(0, oldBacQty + delta)
        }
      }
      return next
    })
  }

  const updateBacWaterQty = (index, delta) => {
    setCart(prev => {
      const next = [...prev]
      const currentBac = next[index].bacWaterQty !== undefined ? next[index].bacWaterQty : next[index].qty
      const newBac = Math.max(0, currentBac + delta)
      next[index] = { 
        ...next[index], 
        bacWaterQty: newBac,
        includeBacWater: newBac > 0
      }
      return next
    })
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce((s,i) => s + i.qty, 0)

  if (currentView === 'guide-complet') {
    return (
      <>
        <FullProtocolPage onBackToHome={backToHome} onGoToCalculator={goToCalculator} />
        <OrderModal 
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          cartItems={cart} 
          siteConfig={siteConfig}
          onUpdateQty={updateCartQty}
          onUpdateBacQty={updateBacWaterQty}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />
        <AdminDashboard 
          isOpen={adminOpen} 
          onClose={() => setAdminOpen(false)} 
          siteConfig={siteConfig}
          onUpdateConfig={updateSiteConfig}
        />
      </>
    )
  }

  return (
    <>
      {/* Dynamic floating molecular network background */}
      <MolecularBackground />

      <Header onCartClick={() => setModalOpen(true)} cartCount={cartCount} siteConfig={siteConfig} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* HERO */}
        <section className="hero">
          <p className="hero-eyebrow">KRATOSBIO LABORATOIRE</p>
          <h1 className="hero-title">SYNTHÈSE PEPTIDIQUE<br/>DE HAUTE PURITÉ.</h1>
          <p className="hero-desc">
            Standard d'excellence analytique pour la recherche scientifique. Découvrez nos deux formules d'exception scellées en laboratoire.
          </p>

          <div className="hero-grid">
            {/* HERO CARD 1: RETA */}
            <div 
              className={`product-card-hero${selectedProduct==='RETA'?' active-hero-card':''}`}
              onClick={() => handleCardClick('RETA')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                overflow: 'hidden',
                borderColor: selectedProduct==='RETA' ? 'var(--black)' : 'rgba(0,0,0,0.08)',
                boxShadow: selectedProduct==='RETA' ? '0 8px 24px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              <div>
                <p className="card-axis">AXE MÉTABOLIQUE</p>
                <h2 className="card-name">RETA</h2>
                <p className="card-desc">Lipolyse, thermogénèse et optimisation du métabolisme.</p>
              </div>
              <div className="card-vial-img" style={{ flexShrink: 0, width: '100px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="/images/reta.png" 
                  alt="KratosBio Retatrutide RETA 10mg - Peptide de recherche haute pureté pour métabolisme" 
                  style={{ 
                    maxHeight: '105px', 
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }} 
                />
              </div>
              <span className="card-dot" style={{ background: selectedProduct==='RETA' ? 'var(--black)' : 'var(--blue-tech)' }}/>
            </div>

            {/* HERO CARD 2: GHK-Cu */}
            <div 
              className={`product-card-hero${selectedProduct==='GHK-Cu'?' active-hero-card':''}`}
              onClick={() => handleCardClick('GHK-Cu')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                overflow: 'hidden',
                borderColor: selectedProduct==='GHK-Cu' ? 'var(--black)' : 'rgba(0,0,0,0.08)',
                boxShadow: selectedProduct==='GHK-Cu' ? '0 8px 24px rgba(0,0,0,0.12)' : 'none'
              }}
            >
              <div>
                <p className="card-axis">AXE RÉGÉNÉRATION</p>
                <h2 className="card-name">GHK-Cu</h2>
                <p className="card-desc">Régénération cutanée et stimulation active du collagène.</p>
              </div>
              <div className="card-vial-img" style={{ flexShrink: 0, width: '100px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="/images/ghkcu.png" 
                  alt="KratosBio GHK-Cu 100mg - Peptide cuivrique haute pureté pour régénération cutanée" 
                  style={{ 
                    maxHeight: '105px', 
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }} 
                />
              </div>
              <span className="card-dot" style={{ background: selectedProduct==='GHK-Cu' ? 'var(--black)' : 'var(--blue-tech)' }}/>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn-primary" id="hero-order-btn" onClick={handleOrderButtonClick}>
              {selectedProduct === 'RETA' ? 'COMMANDER RETA ➜' : 'COMMANDER GHK-Cu ➜'}
            </button>
            <button className="btn-secondary" id="hero-guide-btn" onClick={() => document.getElementById('guide')?.scrollIntoView({behavior:'smooth'})}>
              VOIR LE GUIDE SCIENTIFIQUE
            </button>
          </div>

          {/* DYNAMIC FEATURE PILLS */}
          <div className="hero-features">
            {selectedProduct === 'RETA' ? (
              <>
                <div className="hero-feature">
                  <TargetIcon />
                  <span>GRAISSE VISCÉRALE</span>
                </div>
                <div className="hero-feature">
                  <BoltIcon />
                  <span>ACTIVATION LIPOLYSE</span>
                </div>
                <div className="hero-feature">
                  <MoleculeIcon2 />
                  <span>PURETÉ &gt; 99% HPLC</span>
                </div>
              </>
            ) : (
              <>
                <div className="hero-feature">
                  <SparklesIcon />
                  <span>SYNTHÈSE COLLAGÈNE</span>
                </div>
                <div className="hero-feature">
                  <DNAIcon />
                  <span>RÉGÉNÉRATION CUTANÉE</span>
                </div>
                <div className="hero-feature">
                  <MoleculeIcon2 />
                  <span>PURETÉ &gt; 99% HPLC</span>
                </div>
              </>
            )}
          </div>
        </section>

        <ProductSelection 
          selectedProduct={selectedProduct} 
          onSelectProduct={setSelectedProduct} 
          onAddToCart={addToCart} 
          siteConfig={siteConfig}
        />
        <ScienceSection />
        <ProtocolSection onOpenFullGuide={openFullGuide} />
        <DosageCalculator />
      </main>

      <Footer onOpenAdmin={() => setAdminOpen(true)} siteConfig={siteConfig} />
      <OrderModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        cartItems={cart} 
        siteConfig={siteConfig}
        onUpdateQty={updateCartQty}
        onUpdateBacQty={updateBacWaterQty}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
      
      {/* HIDDEN ADMIN DASHBOARD */}
      <AdminDashboard 
        isOpen={adminOpen} 
        onClose={() => setAdminOpen(false)} 
        siteConfig={siteConfig}
        onUpdateConfig={updateSiteConfig}
      />
    </>
  )
}
