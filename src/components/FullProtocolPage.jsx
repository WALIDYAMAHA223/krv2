import React from 'react'

export default function FullProtocolPage({ onBackToHome, onGoToCalculator }) {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: 'var(--black)', fontFamily: "'IBM Plex Sans', sans-serif", paddingBottom: '5rem' }}>
      
      {/* HEADER BAR */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        background: 'rgba(255,255,255,0.92)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0', 
        padding: '0.8rem 1.5rem' 
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={onBackToHome} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              color: 'var(--black)',
              background: '#f1f5f9',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ← RETOUR À L'ACCUEIL
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.12em' }}>KRATOSBIO</span>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 1.2rem 1.2rem 1.2rem' }}>
        
        {/* HERO TITLE SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            padding: '0.4rem 1rem', 
            borderRadius: '99px', 
            background: '#ffffff', 
            border: '1px solid #cbd5e1', 
            fontSize: '0.68rem', 
            fontWeight: 800, 
            letterSpacing: '0.14em', 
            textTransform: 'uppercase',
            color: 'var(--gray-800)',
            marginBottom: '1.2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            🛡️ PROTOCOLE OFFICIEL DE LABORATOIRE
          </div>
          
          <h1 style={{ fontSize: '2.1rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 1rem 0' }}>
            RECONSTITUTION ET UTILISATION DU RÉTATRUTIDE
          </h1>
          
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-600)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Ce guide détaille la procédure stricte pour préparer (reconstituer) le rétatrutide à partir de poudre lyophilisée, ainsi que le protocole pour l'administrer correctement selon les données des essais cliniques.
          </p>
        </div>

        {/* PARTIE 1 : CHOISIR LA SERINGUE IDÉALE */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>✏️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0 }}>
              PARTIE 1 : CHOISIR LA SERINGUE IDÉALE
            </h2>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Le choix de la seringue est crucial pour garantir une injection indolore et s'assurer que le produit reste bien dans la graisse sous-cutanée.
          </p>

          <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.78rem', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem', color: 'var(--black)' }}>
              SPÉCIFICATIONS RECOMMANDÉES POUR LES SERINGUES À INSULINE :
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { num: '1', title: 'Le type : Seringues U-100', desc: 'Graduées de 0 à 100 unités, où 1 ml = 100 unités. C\'est le standard de correspondance universel pour la dilution.' },
                { num: '2', title: 'La capacité : 0,5 ml ou 1 ml', desc: 'Une seringue de 0,5 ml (50 unités) ou 1 ml (100 unités) est idéale. Les seringues de 0,5 ml offrent une meilleure lisibilité pour mesurer précisément les petites doses.' },
                { num: '3', title: "Le diamètre d'aiguille (Gauge) : 30G ou 31G", desc: 'Recherchez des aiguilles fines de 30G ou 31G. Plus le chiffre est grand, plus l\'aiguille est fine, ce qui garantit une insertion quasiment indolore.' },
                { num: '4', title: "La longueur d'aiguille : 6 mm ou 8 mm", desc: 'Les deux longueurs standards sont 6 mm (aiguille courte) ou 8 mm (aiguille standard). Elles permettent de cibler précisément la couche sous-cutanée.' }
              ].map(spec => (
                <div key={spec.num} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--black)', color: '#ffffff', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {spec.num}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--black)' }}>
                      {spec.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
                      {spec.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PARTIE 2 : LA RECONSTITUTION (LE MÉLANGE) */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💧</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0 }}>
              PARTIE 2 : LA RECONSTITUTION (LE MÉLANGE)
            </h2>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Le rétatrutide en fiole se présente sous forme de poudre sèche et fragile. Pour pouvoir l'injecter, il faut la mélanger à de l'eau bactériostatique (eau stérile contenant 0,9 % d'alcool benzylique, ce qui permet de conserver le produit au frais après ouverture).
          </p>

          {/* 1. RATIO DILUTION */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, margin: '0 0 0.5rem 0', color: 'var(--black)' }}>
              1. La Règle d'Or de Dilution (Ratio Standardisé)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: '0 0 1.2rem 0', lineHeight: 1.5 }}>
              Pour simplifier les calculs et éviter les erreurs, nous appliquons un ratio unique de <strong>10 mg de produit pour 1 ml d'eau</strong>. Ainsi, la concentration est toujours la même, peu importe la taille de votre fiole :
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
              {[
                { fiole: 'Fiole de 5 mg', BAC: '0,5 ml d\'eau BAC' },
                { fiole: 'Fiole de 10 mg', BAC: '1,0 ml d\'eau BAC' },
                { fiole: 'Fiole de 20 mg', BAC: '2,0 ml d\'eau BAC' }
              ].map((r, i) => (
                <div key={i} style={{ background: '#ffffff', borderRadius: '8px', padding: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--gray-500)', margin: '0 0 0.3rem 0', textTransform: 'uppercase' }}>
                    {r.fiole}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--black)', margin: 0 }}>
                    {r.BAC}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: '#854d0e', margin: 0, lineHeight: 1.5 }}>
                💡 <strong>Correspondance universelle :</strong> Avec cette méthode, le calcul sur une seringue d'insuline standard U-100 (1 ml = 100 unités) devient ultra-simple : <strong>1 mg de Rétatrutide = 10 unités sur la seringue</strong>.
              </p>
            </div>
          </div>

          {/* 2. ETAPE PAR ETAPE */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 900, margin: '0 0 1.2rem 0', color: 'var(--black)' }}>
              2. Protocole de préparation étape par étape
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { step: '1', title: 'Hygiène stricte', desc: 'Lavez-vous soigneusement les mains à l\'eau et au savon. Installez-vous sur une surface propre (désinfectée au préalable).' },
                { step: '2', title: 'Préparation des opercules', desc: 'Retirez le capuchon en plastique coloré de la fiole de Rétatrutide et de la fiole d\'eau. Nettoyez vigoureusement la partie en caoutchouc de chaque fiole avec un tampon d\'alcool isopropylique à 70 %. Laissez sécher à l\'air libre.' },
                { step: '3', title: 'Prélèvement de l\'eau', desc: 'Prenez une seringue neuve et aspirez un volume d\'air égal à la quantité d\'eau requise (ex: 1 ml d\'air pour une fiole de 10 mg). Plantez l\'aiguille dans l\'eau bactériostatique, injectez l\'air pour équilibrer la pression, retournez la fiole et aspirez précisément votre volume d\'eau (0,5 ml, 1 ml ou 2 ml selon la fiole). Retirez l\'aiguille.' },
                { step: '4', title: 'L\'introduction de l\'eau (Étape critique)', desc: 'Insérez l\'aiguille dans la fiole de Rétatrutide en orientant la pointe vers la paroi en verre, et non directement vers la poudre. Les fioles étant souvent sous vide, le piston peut descendre tout seul. Retenez-le fermement pour injecter l\'eau le long de la paroi, le plus lentement possible. Un jet trop violent écrasé sur la poudre peut briser les chaînes de peptides et dégrader le produit.' },
                { step: '5', title: 'La dissolution', desc: 'Retirez l\'aiguille. Ne secouez jamais la fiole. Faites-la tourner très délicatement entre vos doigts (mouvement de rotation doux). Laissez la fiole reposer quelques minutes si nécessaire jusqu\'à ce que le liquide soit parfaitement transparent et limpide comme de l\'eau.' }
              ].map(s => (
                <div key={s.step} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--black)', color: '#ffffff', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {s.step}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--black)' }}>
                      {s.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.55 }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PARTIE 3 : PROTOCOLE DE TITRATION ET CALENDRIER */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0 }}>
              PARTIE 3 : PROTOCOLE DE TITRATION ET CALENDRIER
            </h2>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Pour minimiser les effets secondaires (notamment les nausées) et permettre à l'organisme de s'adapter au triple mécanisme d'action (GLP-1 / GIP / Glucagon), les doses augmentent progressivement par paliers de 4 semaines. L'injection est hebdomadaire (une fois par semaine), à jour fixe, à n'importe quelle heure.
          </p>

          {/* TABLE */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>PHASE</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>SEMAINES</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>DOSE</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>GRADUATION SERINGUE U-100</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>VOLUME</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { phase: 'Initiation', sem: 'Semaines 1 à 4', dose: '2 mg', u100: '20 unités', vol: '0,2 ml' },
                  { phase: 'Palier 2', sem: 'Semaines 5 à 8', dose: '4 mg', u100: '40 unités', vol: '0,4 ml' },
                  { phase: 'Palier 3', sem: 'Semaines 9 à 12', dose: '6 mg', u100: '60 unités', vol: '0,6 ml' },
                  { phase: 'Palier 4', sem: 'Semaines 13 à 16', dose: '9 mg', u100: '90 unités', vol: '0,9 ml' },
                  { phase: 'Maximal', sem: 'Semaines 17+', dose: '12 mg', u100: '120 unités (voir note)', vol: '1,2 ml' }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--black)' }}>{row.phase}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>{row.sem}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--black)' }}>{row.dose}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--green)' }}>{row.u100}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--gray-600)' }}>{row.vol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ALERT BOX 12MG */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '1.2rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 800, margin: '0 0 0.4rem 0' }}>
              ⚠️ NOTE IMPORTANTE POUR LA DOSE À 12 MG
            </p>
            <p style={{ fontSize: '0.76rem', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
              Les seringues d'insuline standard s'arrêtent généralement à 100 unités (1 ml). Pour injecter 12 mg (120 unités), il faudra soit faire deux injections séparées (ex: 60 unités + 60 unités), soit utiliser une seringue de plus grande capacité (2 ml).
            </p>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--gray-500)', fontStyle: 'italic', margin: 0 }}>
            * Rappel : Tout le monde n'a pas besoin d'atteindre 12 mg. Si la perte de poids est excellente et les effets secondaires présents à 4 mg ou 6 mg, il est recommandé de rester à cette dose de confort.
          </p>
        </div>

        {/* PARTIE 4 : OUTIL DE VÉRIFICATION VISUELLE */}
        <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🖥️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0, color: '#ffffff' }}>
              PARTIE 4 : OUTIL DE VÉRIFICATION VISUELLE
            </h2>
          </div>

          <p style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', color: '#38bdf8', marginBottom: '0.6rem' }}>
            🖥️ DOUBLE CONTRÔLE DE SÉCURITÉ
          </p>

          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.8rem' }}>
            Pour éliminer tout doute avant de remplir votre seringue, il est fortement recommandé d'utiliser notre outil de simulation en ligne. En y entrant vos données (la quantité de peptide dans votre fiole, la quantité d'eau bactériostatique injectée, votre type de seringue et la dose souhaitée), le site générera une visualisation graphique exacte de votre seringue. Cela vous permet de caler visuellement votre piston réel sur le modèle affiché à l'écran, garantissant un prélèvement sans erreur.
          </p>

          <button 
            onClick={onGoToCalculator}
            style={{ 
              background: '#ffffff', 
              color: '#0f172a', 
              border: 'none', 
              padding: '0.85rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: 800, 
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s ease'
            }}
          >
            <span>ACCÉDER AU SIMULATEUR DE SERINGUE</span>
            <span>➜</span>
          </button>
        </div>

        {/* PARTIE 5 : TECHNIQUE D'INJECTION SOUS-CUTANÉE (WITH Sleek ILLUSTRATION CARDS) */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💉</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0 }}>
              PARTIE 5 : TECHNIQUE D'INJECTION SOUS-CUTANÉE
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {[
              { num: '01', title: 'DÉSINFECTION', desc: 'Nettoyez l\'opercule en caoutchouc de votre fiole de rétatrutide reconstitué avec un tampon d\'alcool isopropylique.', img: '/images/step1-disinfection.png' },
              { num: '02', title: 'PRÉLÈVEMENT D\'AIR', desc: 'Prenez une seringue à insuline neuve. Aspirez de l\'air jusqu\'à la graduation de votre dose (ex: 20 unités pour une dose de 2 mg).', img: '/images/step2-air.png' },
              { num: '03', title: 'ASPIRATION', desc: 'Plantez l\'aiguille dans la fiole, injectez l\'air, retournez le tout verticalement à hauteur d\'yeux, et aspirez le liquide un peu au-delà de la dose.', img: '/images/step3-aspiration.png' },
              { num: '04', title: 'CHASSER L\'AIR', desc: 'Tapotez le corps de la seringue pour faire remonter les bulles d\'air vers le haut, puis poussez le piston pour chasser l\'air et caler le caoutchouc pile sur votre graduation. Retirez l\'aiguille.', img: '/images/step4-clear-air.png' },
              { num: '05', title: 'ZONE D\'INJECTION', desc: 'Ciblez le gras de l\'abdomen (à 5 cm du nombril), le haut de la cuisse ou l\'arrière du bras. Alternez les sites d\'injection d\'une semaine à l\'autre.', img: '/images/step5-site.png' },
              { num: '06', title: 'L\'INJECTION', desc: 'Pincez un pli de peau, insérez l\'aiguille verticalement (90°) d\'un geste franc. Poussez le piston régulièrement, attendez 5 secondes avant de retirer.', img: '/images/step6-injection.png' }
            ].map(step => (
              <div key={step.num} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '160px', width: '100%', borderRadius: '8px', background: '#ffffff', overflow: 'hidden', border: '1px solid #cbd5e1', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={step.img} 
                      alt={step.title}
                      style={{ maxHeight: '150px', maxWidth: '90%', objectFit: 'contain' }}
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '0.82rem', fontWeight: 900, margin: 0, color: 'var(--black)' }}>
                      {step.title}
                    </h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gray-400)' }}>
                      {step.num}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PARTIE 6 : CONSERVATION, STOCKAGE ET SÉCURITÉ */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '2rem', marginBottom: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.04em', margin: 0 }}>
              PARTIE 6 : CONSERVATION, STOCKAGE ET SÉCURITÉ
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.2rem' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem 0', color: 'var(--black)' }}>
                AVANT MÉLANGE (POUDRE)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
                Les fioles sèches se conservent au réfrigérateur (2°C - 8°C) pour une utilisation rapide, ou au congélateur pour une conservation à très long terme (plusieurs mois/années).
              </p>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1', padding: '1.2rem' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem 0', color: 'var(--green)' }}>
                APRÈS MÉLANGE (LIQUIDE)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.5 }}>
                Une fois l'eau bactériostatique ajoutée, la fiole doit impérativement rester au réfrigérateur. <strong style={{ color: '#dc2626' }}>Ne jamais congeler un peptide une fois qu'il est liquide.</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e2e8f0' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--black)' }}>
                Durée de conservation :
              </p>
              <p style={{ fontSize: '0.76rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.55 }}>
                Une fiole reconstituée avec de l'eau bactériostatique se conserve au frais pendant un maximum de <strong>6 semaines (42 jours)</strong>. Au-delà, l'action de l'alcool benzylique s'estompe, le risque bactérien augmente et le peptide commence à perdre progressivement de sa puissance.
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--black)' }}>
                Contrôle visuel :
              </p>
              <p style={{ fontSize: '0.76rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.55 }}>
                Avant chaque injection, vérifiez la fiole à la lumière. Si le liquide devient trouble, change de couleur ou présente des dépôts/particules, ne l'utilisez pas et jetez la fiole.
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--black)' }}>
                Gestion des oublis :
              </p>
              <p style={{ fontSize: '0.76rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.55 }}>
                Si vous oubliez votre injection, vous pouvez la faire jusqu'à 2 jours (48 heures) avant la date théorique de la prochaine injection. Si vous êtes plus proche que cela, sautez la dose oubliée et reprenez votre jour habituel. Ne doublez jamais les doses.
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 800, margin: '0 0 0.2rem 0', color: 'var(--black)' }}>
                Matériel à usage unique :
              </p>
              <p style={{ fontSize: '0.76rem', color: 'var(--gray-600)', margin: 0, lineHeight: 1.55 }}>
                Une seringue = une injection. Ne réutilisez jamais une aiguille, même si elle ne vous semble pas émoussée, afin d'éviter les infections locales ou l'apparition de nodules cutanés. Jetez vos seringues usagées dans un collecteur rigide sécurisé.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM RETURN BUTTON */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={onBackToHome}
            style={{ 
              background: 'var(--black)', 
              color: '#ffffff', 
              border: 'none', 
              padding: '1rem 2.2rem', 
              borderRadius: '8px', 
              fontWeight: 800, 
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
            }}
          >
            ← RETOUR À L'ACCUEIL
          </button>
        </div>

      </div>
    </div>
  )
}
