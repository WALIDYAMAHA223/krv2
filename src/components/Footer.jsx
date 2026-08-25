import React from 'react'

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
)

export default function Footer({ onOpenAdmin, siteConfig }) {
  const rawNum = siteConfig?.whatsappNumber || '32465983104'
  // Clean phone number (remove spaces, plus sign for wa.me URL)
  const cleanNum = rawNum.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent('Bonjour KRATOSBIO, je souhaite obtenir des informations concernant vos produits.')}`

  return (
    <footer className="footer" style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff', padding: '4rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* TOP BRAND + DESCRIPTION + WHATSAPP BUTTON */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          
          {/* BRAND LOGO & TITLE & DESC */}
          <div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <img 
                src="/images/spartan-transparent.png" 
                alt="KRATOSBIO Spartan Logo" 
                style={{ 
                  height: '38px', 
                  width: 'auto',
                  filter: 'brightness(0)',
                  objectFit: 'contain'
                }} 
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.02 }}>
                <span style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 900, 
                  letterSpacing: '0.12em', 
                  color: 'var(--black)',
                  fontFamily: "'IBM Plex Sans', sans-serif"
                }}>
                  KRATOSBIO
                </span>
                <span style={{ 
                  fontSize: '0.55rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.24em', 
                  color: 'var(--gray-600)',
                  marginTop: '2px'
                }}>
                  PEPTIDE PERFORMANCE
                </span>
              </div>
            </a>

            <p style={{ fontSize: '0.82rem', color: 'var(--gray-600)', lineHeight: 1.65, margin: 0, maxWidth: '480px' }}>
              <strong>KRATOSBIO</strong> est un laboratoire d'excellence dédié à la recherche et à la synthèse de peptides de haute pureté analytique (≥ 99% HPLC). Nos standards stricts de contrôle qualité garantissent la stabilité moléculaire et la précision des données pour l'optimisation métabolique et les études cliniques les plus exigeantes.
            </p>
          </div>

          {/* WHATSAPP CONTACT ACTION CARD */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.8rem 1.5rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', color: 'var(--gray-500)', margin: '0 0 0.4rem 0', textTransform: 'uppercase' }}>
              SERVICE CLIENT & ASSISTANCE DIRECTE
            </p>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 900, color: 'var(--black)', margin: '0 0 1.2rem 0' }}>
              Une question sur nos peptides ?
            </h4>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.7rem',
                background: '#16a34a',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                padding: '0.9rem 1.6rem',
                borderRadius: '99px',
                textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(22, 163, 74, 0.25)',
                transition: 'all 0.2s ease',
                width: '100%'
              }}
            >
              <WhatsAppIcon />
              <span>CONTACTER SUR WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* MIDDLE LINKS NAV */}
        <nav aria-label="Navigation secondaire" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '1.2rem 0', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em' }}>
          <a href="#selection" style={{ color: 'var(--black)', textDecoration: 'none' }}>PRODUITS</a>
          <a href="#science" style={{ color: 'var(--black)', textDecoration: 'none' }}>SCIENCE</a>
          <a href="#guide" style={{ color: 'var(--black)', textDecoration: 'none' }}>PROTOCOLE</a>
          <a href="#calculateur" style={{ color: 'var(--black)', textDecoration: 'none' }}>CALCULATEUR</a>
        </nav>

        {/* BOTTOM COPYRIGHT & SECRET ADMIN TRIGGER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.72rem', color: 'var(--gray-500)' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>
            © {new Date().getFullYear()} <strong>KRATOSBIO</strong>. Tous droits réservés. Marque et Laboratoire de Recherche Peptidique.
          </p>

          {/* SECRET HIDDEN ADMIN TRIGGER */}
          <button 
            type="button"
            onClick={onOpenAdmin}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--gray-400)', 
              fontSize: '0.72rem', 
              cursor: 'pointer',
              opacity: 0.6,
              transition: 'opacity 0.2s ease'
            }}
            title="Espace Administrateur (PIN: 12042006)"
          >
            🔒 Espace Admin
          </button>
        </div>

      </div>
    </footer>
  )
}
