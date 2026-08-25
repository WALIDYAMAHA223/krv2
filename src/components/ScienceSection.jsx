import { useState } from 'react'

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const MoleculeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
    <line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/>
  </svg>
)

const DNAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M2 9c6.667 6 13.333 0 20 6"/>
    <line x1="9" y1="9" x2="9" y2="15"/><line x1="15" y1="9" x2="15" y2="15"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2"/>
  </svg>
)

const faqCommentCommander = {
  q: "Comment passer commande ?",
  a: "Pour commander, validez votre panier pour échanger directement avec notre conseiller sur WhatsApp. Nous créons ensuite un lien Vinted personnalisé pour finaliser votre achat en toute sécurité (avec la protection acheteur Vinted). L'expédition est garantie sous 24h à 48h via Mondial Relay. Nous acceptons également les paiements par virement bancaire ainsi que la livraison / remise en main propre sur Bruxelles."
}

const faqsRETA = [
  faqCommentCommander,
  { q: "Qu'est-ce que Retatrutide (RETA) ?", a: "Retatrutide (RETA 10mg) est un triple agoniste récepteur ciblant simultanément GLP-1, GIP et Glucagon, offrant des propriétés uniques pour l'étude du métabolisme et de la lipolyse ciblée." },
  { q: "Pourquoi la présence d'Eau Bactériostatique 3ml est-elle obligatoire ?", a: "La fiole d'Eau Bactériostatique 3ml contient 0.9% d'alcool benzylique stérile. Elle est indispensable pour dissoudre le lyophilisat stérile et préserver la stabilité moléculaire des peptides après reconstitution." },
  { q: "Quelle est la différence entre RETA et la Tirzépatide ?", a: "Contrairement à la Tirzépatide (double agoniste), le Retatrutide intègre un 3ème axe récepteur (Glucagon), activant l'oxydation directe des graisses et la dépense énergétique au repos." },
  { q: "Comment conserver la fiole de RETA 10mg ?", a: "À conserver à l'abri de la lumière entre 2°C et 8°C après reconstitution stérile avec l'eau bactériostatique 3ml fournies." },
]

const faqsGHKCU = [
  faqCommentCommander,
  { q: "Qu'est-ce que GHK-Cu 100mg ?", a: "GHK-Cu 100mg (Glycyl-L-Histidyl-L-Lysine Copper) est un tripeptide cuivrique naturel hautement dosé étudié pour sa capacité unique à stimuler la régénération du collagène, l'élasticité cutanée et la réparation des tissus." },
  { q: "Quels sont les effets principaux observés sur le derme et le collagène ?", a: "Le GHK-Cu stimule directement les fibroblastes pour multiplier la synthèse de collagène de type I et III, d'élastine et de glycosaminoglycanes (GAGs), restaurant l'épaisseur et la fermeté cutanée." },
  { q: "Pourquoi choisir le dosage 100mg ?", a: "Le dosage 100mg permet un protocole de recherche étendu et régulier sans rupture d'approvisionnement, garantissant une concentration optimale après dissolution stérile." },
  { q: "Comment s'effectue la reconstitution de GHK-Cu 100mg ?", a: "Il est obligatoire d'injecter l'Eau Bactériostatique 3ml fournie dans le flacon lyophilisé pour obtenir une solution limpide de couleur violette naturelle." }
]

export default function ScienceSection() {
  const [activeTab, setActiveTab] = useState('RETA')
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = activeTab === 'RETA' ? faqsRETA : faqsGHKCU

  return (
    <section id="science" className="science-section">
      <div className="science-inner">
        <div className="science-top">
          <p className="section-eyebrow">RECHERCHE & DONNÉES SCIENTIFIQUES</p>
          <h2 className="section-title">MÉCANISMES D'ACTION DES PEPTIDES</h2>
          <p className="section-desc">
            Explorez les fondements biochimiques de nos deux références de laboratoire haute pureté.
          </p>

          <div className="tab-links" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
            <button 
              className={`tab-link${activeTab==='RETA'?' active':''}`} 
              onClick={() => { setActiveTab('RETA'); setOpenFaq(null); }}
            >
              MÉCANISME RETA
            </button>
            <button 
              className={`tab-link${activeTab==='GHK-Cu'?' active':''}`} 
              onClick={() => { setActiveTab('GHK-Cu'); setOpenFaq(null); }}
            >
              MÉCANISME GHK-Cu
            </button>
          </div>
        </div>

        {/* DYNAMIC SCIENCE CARDS */}
        {activeTab === 'RETA' ? (
          <div className="science-grid">
            <div className="science-card">
              <div className="science-icon"><MoleculeIcon /></div>
              <h4>TRIPLE AGONISTE</h4>
              <p>Activation simultanée des récepteurs GLP-1, GIP et Glucagon pour une synergie métabolique inégalée.</p>
            </div>
            <div className="science-card">
              <div className="science-icon"><DNAIcon /></div>
              <h4>LIPOLYSE AVANCÉE</h4>
              <p>Cible directement le tissu adipeux viscéral et accélère l'oxydation des acides gras récalcitrants.</p>
            </div>
            <div className="science-card">
              <div className="science-icon"><ShieldIcon /></div>
              <h4>SATIÉTÉ CIBLÉE</h4>
              <p>Régulation fine des signaux de faim centraux et ralentissement contrôlé de la vidange gastrique.</p>
            </div>
            <div className="science-card">
              <div className="science-icon"><SparklesIcon /></div>
              <h4>THERMOGÉNÈSE</h4>
              <p>Augmentation de la dépense calorique basale sans altération du système nerveux central.</p>
            </div>
          </div>
        ) : (
          <div className="science-grid">
            <div className="science-card">
              <div className="science-icon"><SparklesIcon /></div>
              <h4>SYNTHÈSE DU COLLAGÈNE</h4>
              <p>Stimulation directe des fibroblastes et multiplication des collagènes de type I & III pour le derme.</p>
            </div>
            <div className="science-card">
              <div className="science-icon"><DNAIcon /></div>
              <h4>RÉPARATION TISSULAIRE</h4>
              <p>Accélération de la cicatrisation cutanée et restructuration des glycosaminoglycanes (GAGs).</p>
            </div>
            <div className="science-card">
              <div className="science-icon"><ShieldIcon /></div>
              <h4>ACTION ANTI-INFLAMMATOIRE</h4>
              <p>Réduction ciblée des cytokines pro-inflammatoires (TNF-α, IL-6) et protection antioxydante.</p>
            </div>
            <div className="science-card">
              <div className="science-icon"><MoleculeIcon /></div>
              <h4>DENSITÉ CUTANÉE & CHEVEUX</h4>
              <p>Amélioration prouvée de l'épaisseur du derme et stimulation de la santé des follicules.</p>
            </div>
          </div>
        )}

        {/* GUIDE & FAQ */}
        <div id="guide" className="guide-grid" style={{ marginTop: '3rem' }}>
          <div>
            <p className="section-eyebrow">GUIDE D'UTILISATION DE LABORATOIRE</p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '1rem' }}>
              FOIRE AUX QUESTIONS ({activeTab})
            </h3>
            <p className="section-desc" style={{ marginBottom: '1.8rem' }}>
              {activeTab === 'RETA'
                ? "Retrouvez les détails essentiels sur le Retatrutide 10mg et son protocole de reconstitution stérile avec l'Eau Bactériostatique 3ml."
                : "Retrouvez les détails essentiels sur le complexe cuivrique GHK-Cu 100mg et sa reconstitution stérile avec l'Eau Bactériostatique 3ml."}
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item${openFaq===i?' open':''}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  <span>{f.q}</span>
                  <PlusIcon />
                </button>
                <div className="faq-answer">
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
