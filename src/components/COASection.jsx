const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const coaItems = [
  { title:'ANALYSES COMPLÈTES', desc:'Profilage complet par HPLC et Spectrométrie de Masse (MS).' },
  { title:'TRAÇABILITÉ TOTALE', desc:'Numéro de lot unique avec documentation de contrôle.' },
  { title:'LABORATOIRE CERTIFIÉ', desc:'Production soumise aux normes GMP et ISO 17025.' },
]

const labRows = [
  ['Produit','RETA 10 mg'],
  ['Numéro de lot','635966'],
  ['Méthode d\'analyse','HPLC & LC-MS'],
  ['Pureté','99,533 %'],
  ['Endotoxines','< 0,1 EU/mg'],
  ['Stérilité','Conforme'],
  ['Date d\'analyse','01/10/2025'],
  ['Statut','CONFORME'],
]

export default function COASection() {
  return (
    <section id="resultats" className="coa-section">
      <div className="coa-inner">
        <div>
          <p className="section-eyebrow">QUALITÉ CERTIFIÉE</p>
          <h2 className="section-title">TESTÉ. VALIDÉ.<br/>CERTIFIÉ.</h2>
          <p className="section-desc">Chaque lot de RETA est soumis à des tests rigoureux pour garantir sa pureté, son identité et sa sécurité chimique complète.</p>
          <div className="coa-checklist">
            {coaItems.map(i => (
              <div key={i.title} className="coa-item">
                <div className="coa-item-icon"><CheckIcon /></div>
                <div>
                  <h5>{i.title}</h5>
                  <p>{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="lab-report">
            <div className="lab-report-header">RAPPORT DE LABORATOIRE</div>
            <table className="lab-table">
              <tbody>
                {labRows.map(([k,v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>
                      {k==='Statut'
                        ? <span className="status-badge">✓ {v}</span>
                        : v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="coa-download">
            <div className="coa-download-info">
              <span className="coa-download-title">Certificate of Analysis — RETA 10mg</span>
              <span className="coa-download-sub">Lot #635966 · Analysé le 01/10/2025</span>
            </div>
            <button className="btn-download" id="download-coa-btn">
              <DownloadIcon /> TÉLÉCHARGER LE COA
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
