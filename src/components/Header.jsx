import { useState, useEffect } from 'react'

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function Header({ onCartClick, cartCount, siteConfig }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const announcement = siteConfig?.announcement
  const flashSale = siteConfig?.flashSale

  // Live countdown for flash sale
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0, expired: false })

  useEffect(() => {
    if (!flashSale?.active || !flashSale?.endsAt) return
    const tick = () => {
      const diff = new Date(flashSale.endsAt) - Date.now()
      if (diff <= 0) { setCountdown({ h: 0, m: 0, s: 0, expired: true }); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown({ h, m, s, expired: false })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [flashSale?.active, flashSale?.endsAt])

  const pad = (n) => String(n).padStart(2, '0')
  const showFlashBar = flashSale?.active && !countdown.expired

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navItems = [
    { label: 'PRODUITS', href: '#selection' },
    { label: 'SCIENCE', href: '#science' },
    { label: 'GUIDE / PROTOCOLE', href: '#guide' },
    { label: 'CALCULATEUR', href: '#calculateur' }
  ]

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* TOP ANNOUNCEMENT BAR FOR PROMOS & NOTICES */}
      {announcement?.enabled && (
        <div 
          className="topbar-announcement"
          style={{
            background: announcement.bg || '#0a0a0a',
            color: announcement.textColor || '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '0.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            flexWrap: 'wrap',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          <span>{announcement.text || '⚡ OFFRE SPÉCIALE : -50% SUR CHAQUE 3ÈM FIOLE DE GHK-CU & RETA'}</span>
          {announcement.linkText && (
            <a 
              href={announcement.linkUrl || '#selection'} 
              style={{
                background: 'rgba(255,255,255,0.22)',
                color: announcement.textColor || '#ffffff',
                padding: '0.2rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {announcement.linkText}
            </a>
          )}
        </div>
      )}

      {/* FLASH SALE COUNTDOWN BAR */}
      {showFlashBar && (
        <div style={{
          background: 'linear-gradient(90deg, #b45309 0%, #d97706 50%, #b45309 100%)',
          color: '#ffffff',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          padding: '0.45rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          textAlign: 'center'
        }}>
          <span>🔥 {flashSale.label}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, opacity: 0.85 }}>Se termine dans</span>
            {[
              { val: countdown.h, label: 'H' },
              { val: countdown.m, label: 'MIN' },
              { val: countdown.s, label: 'SEC' }
            ].map(({ val, label }, i) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                {i > 0 && <span style={{ opacity: 0.6, marginRight: '0.1rem' }}>:</span>}
                <span style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '4px',
                  padding: '0.1rem 0.35rem',
                  fontFamily: 'monospace',
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  minWidth: '28px',
                  textAlign: 'center'
                }}>
                  {pad(val)}
                </span>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, opacity: 0.75 }}>{label}</span>
              </span>
            ))}
          </span>
          <a href="#selection" style={{ color: '#fff', background: 'rgba(0,0,0,0.25)', padding: '0.2rem 0.7rem', borderRadius: '4px', textDecoration: 'none', fontSize: '0.65rem', fontWeight: 900, whiteSpace: 'nowrap' }}>
            EN PROFITER ➜
          </a>
        </div>
      )}

      <nav className="navbar" style={{ position: 'relative', top: 'auto' }}>
        {/* LOGO */}
        <a href="#" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', textDecoration: 'none' }}>
          <img 
            src="/images/spartan-transparent.png" 
            alt="KRATOSBIO Spartan Logo" 
            style={{ 
              height: '34px', 
              width: 'auto',
              filter: 'brightness(0)',
              objectFit: 'contain'
            }} 
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.02 }}>
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              letterSpacing: '0.12em', 
              color: 'var(--black)',
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}>
              KRATOSBIO
            </span>
            <span style={{ 
              fontSize: '0.5rem', 
              fontWeight: 700, 
              letterSpacing: '0.22em', 
              color: 'var(--gray-600)',
              marginTop: '2px'
            }}>
              PEPTIDE PERFORMANCE
            </span>
          </div>
        </a>

        {/* DESKTOP NAV LINKS */}
        <div className="nav-links">
          {navItems.map(item => (
            <a key={item.label} href={item.href}>{item.label}</a>
          ))}
        </div>

        {/* NAV RIGHT (CART + HAMBURGER BUTTON) */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button className="cart-btn" onClick={onCartClick} id="cart-btn" aria-label="Panier">
            <CartIcon />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* MOBILE 3 BARS (HAMBURGER) BUTTON */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu de Navigation"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--black)'
            }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {/* MOBILE SLIDE-OVER NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 999999,
            display: 'flex',
            justifyContent: 'flex-end',
            touchAction: 'manipulation'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '82%',
              maxWidth: '320px',
              height: '100%',
              background: 'var(--white)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
              transform: 'translateZ(0)',
              willChange: 'transform'
            }}
          >
            <div>
              {/* DRAWER HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--black)' }}>
                  NAVIGATION
                </span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: 'var(--black)', touchAction: 'manipulation' }}
                >
                  <CloseIcon />
                </button>
              </div>

              {/* NAV LINKS LIST */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {navItems.map(item => (
                  <a 
                    key={item.label} 
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false)
                    }}
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: 'var(--black)',
                      textDecoration: 'none',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      touchAction: 'manipulation'
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>➜</span>
                  </a>
                ))}
              </div>
            </div>

            {/* DRAWER FOOTER */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--black)', margin: '0 0 0.2rem 0' }}>
                KRATOSBIO
              </p>
              <p style={{ fontSize: '0.62rem', color: 'var(--gray-500)', margin: 0 }}>
                Peptide Performance — Pureté ≥ 99%
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
