import { useState } from 'react'

const SyringeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 0-1.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 1 1"/>
  </svg>
)

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

export default function DosageCalculator() {
  const [product, setProduct] = useState('RETA') // RETA or GHK-Cu
  const [retaVialMg, setRetaVialMg] = useState(10) // 10 or 20
  const [bacWater, setBacWater] = useState(3) // 3 ml default
  const [targetDose, setTargetDose] = useState(2.5) // Target mg
  const [syringeCapacity, setSyringeCapacity] = useState(100) // 30U, 50U, 100U

  // Vial total mg
  const vialMg = product === 'RETA' ? retaVialMg : 100

  // Presets based on product
  const RETA_DOSES = [1, 2, 2.5, 4, 5]
  const GHKCU_DOSES = [2.5, 5, 10, 15, 20]

  const currentPresets = product === 'RETA' ? RETA_DOSES : GHKCU_DOSES

  // Calculate volume in ml and IU (U-100 syringe standard: 1ml = 100 units)
  const concentration = vialMg / bacWater // mg per ml
  const volumeMl = targetDose / concentration // ml needed
  const syringeUnits = Math.round(volumeMl * 100) // Exact Units needed

  // Fill percentage relative to selected syringe capacity
  const fillPercentage = Math.min(100, Math.max(0, (syringeUnits / syringeCapacity) * 100))
  const isOverflow = syringeUnits > syringeCapacity

  // Marks for syringe scale
  const getSyringeMarks = () => {
    if (syringeCapacity === 30) return [0, 5, 10, 15, 20, 25, 30]
    if (syringeCapacity === 50) return [0, 10, 20, 30, 40, 50]
    return [0, 20, 40, 60, 80, 100]
  }

  const syringeMarks = getSyringeMarks()

  // Handle product toggle
  const handleProductChange = (prod) => {
    setProduct(prod)
    if (prod === 'RETA') {
      setTargetDose(2.5)
    } else {
      setTargetDose(5)
    }
  }

  return (
    <section id="calculateur" className="calculator-section" style={{
      padding: '5rem 1.5rem',
      background: 'rgba(248, 250, 252, 0.7)',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="section-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <SyringeIcon /> CALCULATEUR DE RECONSTITUTION DE LABORATOIRE
          </p>
          <h2 className="section-title" style={{ fontSize: '2rem', marginTop: '0.4rem' }}>
            CALCULATEUR DE DOSAGE PRÉCIS
          </h2>
          <p className="section-desc" style={{ maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
            Calculez instantanément le volume exact à prélever selon votre modèle de seringue (30U, 50U ou 100U) et la quantité d'Eau Bactériostatique ajoutée.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* LEFT: CONTROLS */}
          <div style={{
            background: 'var(--white)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
          }}>
            {/* STEP 1: CHOICE OF PRODUCT */}
            <div style={{ marginBottom: '1.6rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--black)', display: 'block', marginBottom: '0.8rem' }}>
                1. SÉLECTIONNEZ VOTRE FLACON
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setProduct('RETA')
                    setRetaVialMg(10)
                    setTargetDose(2.5)
                  }}
                  style={{
                    padding: '0.75rem 0.4rem',
                    borderRadius: '8px',
                    border: (product === 'RETA' && retaVialMg === 10) ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                    background: (product === 'RETA' && retaVialMg === 10) ? 'var(--black)' : 'var(--white)',
                    color: (product === 'RETA' && retaVialMg === 10) ? 'var(--white)' : 'var(--black)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                >
                  RETA (10mg)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProduct('RETA')
                    setRetaVialMg(20)
                    setTargetDose(2.5)
                  }}
                  style={{
                    padding: '0.75rem 0.4rem',
                    borderRadius: '8px',
                    border: (product === 'RETA' && retaVialMg === 20) ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                    background: (product === 'RETA' && retaVialMg === 20) ? 'var(--black)' : 'var(--white)',
                    color: (product === 'RETA' && retaVialMg === 20) ? 'var(--white)' : 'var(--black)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                >
                  RETA (20mg)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProduct('GHK-Cu')
                    setTargetDose(5)
                  }}
                  style={{
                    padding: '0.75rem 0.4rem',
                    borderRadius: '8px',
                    border: product === 'GHK-Cu' ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                    background: product === 'GHK-Cu' ? 'var(--black)' : 'var(--white)',
                    color: product === 'GHK-Cu' ? 'var(--white)' : 'var(--black)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center'
                  }}
                >
                  GHK-Cu (100mg)
                </button>
              </div>
            </div>

            {/* STEP 2: BAC WATER VOLUME */}
            <div style={{ marginBottom: '1.6rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--black)', display: 'block', marginBottom: '0.8rem' }}>
                2. VOLUME D'EAU BACTÉRIOSTATIQUE AJOUTÉ
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {[1, 2, 3].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setBacWater(v)}
                    style={{
                      padding: '0.7rem',
                      borderRadius: '8px',
                      border: bacWater === v ? '2px solid var(--blue-tech)' : '1px solid var(--gray-300)',
                      background: bacWater === v ? 'rgba(59, 130, 246, 0.08)' : 'var(--white)',
                      color: bacWater === v ? 'var(--blue-tech)' : 'var(--black)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {v} ml {v === 3 ? '(Fourni)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 3: SYRINGE CAPACITY (30U, 50U, 100U) */}
            <div style={{ marginBottom: '1.6rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--black)', display: 'block', marginBottom: '0.8rem' }}>
                3. CAPACITÉ DE VOTRE SERINGUE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {[
                  { u: 30, ml: '0.3ml' },
                  { u: 50, ml: '0.5ml' },
                  { u: 100, ml: '1.0ml' }
                ].map(item => (
                  <button
                    key={item.u}
                    type="button"
                    onClick={() => setSyringeCapacity(item.u)}
                    style={{
                      padding: '0.7rem 0.4rem',
                      borderRadius: '8px',
                      border: syringeCapacity === item.u ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                      background: syringeCapacity === item.u ? 'var(--black)' : 'var(--white)',
                      color: syringeCapacity === item.u ? 'var(--white)' : 'var(--black)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    {item.u}U <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({item.ml})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4: DESIRED TARGET DOSE */}
            <div style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--black)' }}>
                  4. DOSE VOULUE PAR INJECTION
                </label>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--blue-tech)' }}>
                  {targetDose} mg
                </span>
              </div>

              {/* Quick Presets */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {currentPresets.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setTargetDose(d)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '99px',
                      border: targetDose === d ? '1px solid var(--black)' : '1px solid var(--gray-300)',
                      background: targetDose === d ? 'var(--black)' : 'var(--white)',
                      color: targetDose === d ? 'var(--white)' : 'var(--gray-700)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {d} mg
                  </button>
                ))}
              </div>

              {/* Slider */}
              <input
                type="range"
                min={product === 'RETA' ? 0.5 : 1}
                max={product === 'RETA' ? 10 : 30}
                step={product === 'RETA' ? 0.5 : 1}
                value={targetDose}
                onChange={e => setTargetDose(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--black)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ padding: '0.8rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <InfoIcon />
              <p style={{ fontSize: '0.7rem', color: 'var(--gray-700)', margin: 0 }}>
                Concentration de la solution : <strong>{(vialMg / bacWater).toFixed(2)} mg/ml</strong> ({vialMg}mg dans {bacWater}ml).
              </p>
            </div>
          </div>

          {/* RIGHT: VISUAL SYRINGE & RESULT */}
          <div style={{
            background: 'var(--white)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--gray-500)', textTransform: 'uppercase', margin: 0 }}>
                  RÉSULTAT DE DOSAGE SÉLECTIONNÉ
                </p>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#f1f5f9', color: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  SERINGUE {syringeCapacity}U ({syringeCapacity / 100}ml)
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '0.6rem 0 1.2rem 0' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: isOverflow ? '#dc2626' : 'var(--black)', letterSpacing: '-0.02em' }}>
                  {syringeUnits}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: isOverflow ? '#dc2626' : 'var(--blue-tech)' }}>
                  UNITÉS SUR VOTRE SERINGUE
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                  ({volumeMl.toFixed(2)} ml)
                </span>
              </div>

              {/* OVERFLOW WARNING BADGE IF DOSE EXCEEDS SYRINGE CAPACITY */}
              {isOverflow && (
                <div style={{ padding: '0.8rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <AlertIcon />
                  <span>
                    La dose ({syringeUnits}U) dépasse la capacité de votre seringue de {syringeCapacity}U ! Utilisez une seringue de {syringeUnits > 50 ? '100U (1ml)' : '50U (0.5ml)'} ou augmentez le volume d'eau.
                  </span>
                </div>
              )}

              {/* VISUAL SYRINGE COMPONENT */}
              <div style={{ margin: '1.2rem 0', padding: '1.5rem 1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: '1.2rem', textAlign: 'center', letterSpacing: '0.08em' }}>
                  GRADUATION SERINGUE {syringeCapacity} UNÍTÉS ({syringeCapacity / 100}ml)
                </p>

                {/* HORIZONTAL SYRINGE VISUAL */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '380px', margin: '0 auto' }}>
                  
                  {/* NEEDLE AT LEFT */}
                  <div style={{
                    position: 'absolute',
                    left: '-24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ width: '16px', height: '2px', background: '#94a3b8' }}/>
                    <div style={{ width: '8px', height: '12px', background: '#38bdf8', borderRadius: '2px 0 0 2px' }}/>
                  </div>

                  {/* BARREL CONTAINER */}
                  <div style={{
                    position: 'relative',
                    height: '42px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #64748b',
                    borderRadius: '4px 10px 10px 4px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    {/* FLUID FILLING */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${fillPercentage}%`,
                      background: isOverflow 
                        ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.75), rgba(220, 38, 38, 0.9))' 
                        : 'linear-gradient(90deg, rgba(59, 130, 246, 0.75), rgba(37, 99, 235, 0.9))',
                      transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '6px'
                    }}>
                      {/* LIQUID BUBBLES ACCENT */}
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', marginRight: '4px' }}/>
                    </div>

                    {/* PLUNGER STOPPER LINE */}
                    <div style={{
                      position: 'absolute',
                      left: `${fillPercentage}%`,
                      top: 0,
                      bottom: 0,
                      width: '8px',
                      background: '#0f172a',
                      transform: 'translateX(-50%)',
                      zIndex: 3,
                      transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}/>

                    {/* SYRINGE GRADUATION MARKS */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 4px',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}>
                      {syringeMarks.map((mark, index) => (
                        <div key={mark} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                          <div style={{
                            width: '1px',
                            height: index % 2 === 0 ? '12px' : '6px',
                            background: '#475569'
                          }}/>
                          {index % 2 === 0 && (
                            <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#334155', marginTop: '2px' }}>
                              {mark}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PLUNGER ROD AT RIGHT */}
                  <div style={{
                    position: 'absolute',
                    left: `calc(${fillPercentage}% + 4px)`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '10px',
                    right: '-30px',
                    background: '#cbd5e1',
                    border: '1px solid #94a3b8',
                    transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    {/* PLUNGER HANDLE */}
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '24px',
                      background: '#475569',
                      borderRadius: '2px'
                    }}/>
                  </div>
                </div>

                {/* TARGET INDICATOR BADGE */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    background: isOverflow ? '#dc2626' : 'var(--black)',
                    color: 'var(--white)',
                    borderRadius: '99px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em'
                  }}>
                    {isOverflow 
                      ? `⚠️ DÉPASSEMENT : ${syringeUnits}U NÉCESSAIRES SUR SERINGUE DE ${syringeCapacity}U`
                      : `📍 PRÉLEVER JUSQU'À LA GRADUATION ${syringeUnits} (${syringeCapacity}U)`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* SUMMARY PROTOCOL RECAP */}
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--black)', marginBottom: '0.3rem' }}>
                RÉCAPITULATIF DU DOSAGE ({syringeCapacity}U) :
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--gray-700)', margin: 0, lineHeight: 1.5 }}>
                Pour une dose de <strong>{targetDose} mg</strong> de {product} ({vialMg}mg / {bacWater}ml d'Eau Bac), vous devez remplir votre seringue de <strong>{syringeCapacity}U</strong> jusqu'à la graduation <strong>{syringeUnits} unités</strong> ({volumeMl.toFixed(2)} ml).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
