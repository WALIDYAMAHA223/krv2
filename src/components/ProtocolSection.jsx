const steps = [
  { num:'01', title:'Réception', desc:'Conservez au réfrigérateur (2–8 °C) jusqu\'à utilisation.',
    icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/><circle cx="12" cy="16" r="1.5"/></svg> },
  { num:'02', title:'Reconstitution', desc:'Ajouter l\'eau bactériostatique et agiter doucement.',
    icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 3v11a3 3 0 0 0 6 0V3"/><path d="M6 3h12"/><path d="M15 9h4v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9h4"/></svg> },
  { num:'03', title:'Préparation', desc:'Prélever la dose souhaitée avec une seringue stérile.',
    icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="m18 2 4 4-14 14H4v-4Z"/><path d="m14.5 5.5 4 4"/></svg> },
  { num:'04', title:'Administration', desc:'Suivre le protocole de recherche établi.',
    icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"/></svg> },
]

export default function ProtocolSection({ onOpenFullGuide }) {
  return (
    <section id="guide" className="protocol-section">
      <div className="protocol-inner">
        <div className="protocol-top">
          <p className="section-eyebrow">PROTOCOLE SIMPLE</p>
          <h2 className="section-title">UN PROTOCOLE EN 4 ÉTAPES CLÉS</h2>
          <p className="section-desc">Un processus clair pour des résultats d'analyse mesurables et reproductibles.</p>
        </div>
        <div className="steps-grid">
          {steps.map(s => (
            <div key={s.num} className="step-card">
              <p className="step-num">ÉTAPE {s.num}</p>
              <div className="step-icon">{s.icon}</div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            onClick={onOpenFullGuide}
            className="btn-primary"
            style={{
              padding: '0.95rem 2rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            VOIR LE GUIDE COMPLET DU PROTOCOLE ➔
          </button>
        </div>
      </div>
    </section>
  )
}
