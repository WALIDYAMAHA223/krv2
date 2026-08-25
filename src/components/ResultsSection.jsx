const stats = [
  { val:'-5kg', label:'PERTE MOYENNE EN 8 SEMAINES' },
  { val:'99,5%', label:'PURETÉ HPLC CERTIFIÉE' },
  { val:'2/2', label:'AVIS CLIENTS 5 ÉTOILES' },
]

export default function ResultsSection() {
  return (
    <section className="results-section">
      <div className="results-inner">
        <p className="section-eyebrow">RÉSULTATS RÉELS</p>
        <h2 className="section-title">DES OBSERVATIONS CLINIQUES.<br/>DES OBJECTIFS ATTEINTS.</h2>
        <p className="section-desc">RETA est au cœur de protocoles de recherche visant la recomposition corporelle et l'optimisation métabolique.</p>
        <div className="results-stats" style={{marginTop:'3rem'}}>
          {stats.map(s => (
            <div key={s.val} className="stat-card">
              <div className="stat-val">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
