import React, { useState } from 'react'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
)

// Helper to sanitize dosage string (e.g. "10MG (x2)" -> "10MG")
export const formatCleanDosage = (dosageStr) => {
  if (!dosageStr) return '10MG'
  return dosageStr.replace(/\s*\([^)]*\)/gi, '').trim()
}

// Helper to sanitize product name string
export const formatCleanName = (nameStr) => {
  if (!nameStr) return 'RETA'
  return nameStr.replace(/\s*\([^)]*\)/gi, '').trim()
}

// Helper function to calculate accurate pricing for an item
export const calculateItemPricing = (item, siteConfig) => {
  const cleanName = formatCleanName(item.name)
  const isGHK = cleanName.includes('GHK')
  const prodConfig = isGHK ? siteConfig?.products?.['GHK-Cu'] : siteConfig?.products?.['RETA']
  const basePrice = item.singleBasePrice || (prodConfig?.price || (isGHK ? 50 : 60))
  const originalUnitPrice = (prodConfig?.originalPrice && Number(prodConfig.originalPrice) > basePrice) 
    ? Number(prodConfig.originalPrice) 
    : basePrice
  
  const qty = item.qty || 1
  const packs = Math.floor(qty / 3)
  const remainder = qty % 3
  
  // Pack 3 pricing: 50% discount on every 3rd vial (or siteConfig.pack3Price for 60€ products)
  const pack3PriceConfig = (basePrice === 60 && siteConfig?.pack3Price) 
    ? siteConfig.pack3Price 
    : (basePrice * 2.5)
  
  // Peptide cost (3rd vial is discounted by 50%)
  const peptideCost = (packs * pack3PriceConfig) + (remainder * basePrice)
  const unpromotedPeptideCost = qty * originalUnitPrice
  const hasPackPromo = packs > 0
  const hasPricePromo = originalUnitPrice > basePrice
  const hasPromo = hasPackPromo || hasPricePromo

  // Bacteriostatic Water cost (explicit per bottle cost)
  const unitBacPrice = item.bacWaterUnitPrice || siteConfig?.bacWaterPrice || 3
  const bacQty = item.includeBacWater !== false 
    ? (item.bacWaterQty !== undefined ? item.bacWaterQty : qty) 
    : 0
  const bacCost = bacQty * unitBacPrice

  const totalCost = peptideCost + bacCost

  return {
    cleanName,
    basePrice,
    originalUnitPrice,
    qty,
    packs,
    hasPromo,
    hasPackPromo,
    hasPricePromo,
    peptideCost,
    unpromotedPeptideCost,
    unitBacPrice,
    bacQty,
    bacCost,
    totalCost
  }
}

export default function OrderModal({ 
  open, 
  onClose, 
  cartItems = [], 
  siteConfig,
  onUpdateQty,
  onUpdateBacQty,
  onRemoveItem,
  onClearCart
}) {
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoStatus, setPromoStatus] = useState({ msg: '', isError: false })

  if (!open) return null

  const availablePromos = siteConfig?.promoCodes || []

  // Calculate cart totals dynamically
  const computedItems = cartItems.map(item => calculateItemPricing(item, siteConfig))
  const subtotal = computedItems.reduce((sum, ci) => sum + ci.totalCost, 0)
  const totalVials = cartItems.reduce((sum, item) => sum + item.qty, 0)

  let promoDiscount = 0
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      promoDiscount = (subtotal * appliedPromo.value) / 100
    } else if (appliedPromo.type === 'fixed') {
      promoDiscount = Math.min(subtotal, appliedPromo.value)
    }
  }

  const grandTotal = Math.max(0, subtotal - promoDiscount)

  const handleApplyPromo = () => {
    const clean = promoInput.trim().toUpperCase()
    if (!clean) return

    const match = availablePromos.find(p => p.code.toUpperCase() === clean && p.active !== false)
    if (match) {
      setAppliedPromo({
        code: match.code,
        type: match.discountType,
        value: Number(match.discountValue)
      })
      setPromoStatus({ msg: `✓ Code "${match.code}" appliqué avec succès !`, isError: false })
    } else {
      setPromoStatus({ msg: `❌ Code promo "${clean}" invalide ou expiré.`, isError: true })
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoStatus({ msg: '', isError: false })
  }

  const rawNum = siteConfig?.whatsappNumber || '32465983104'
  const cleanNum = rawNum.replace(/[^0-9]/g, '')

  // Professional & Detailed WhatsApp Order Summary Message
  const whatsappLines = cartItems.map((item, idx) => {
    const ci = computedItems[idx]
    const cleanDsg = formatCleanDosage(item.dosage)
    const promoStr = ci.hasPackPromo 
      ? ' (Pack 3 Fioles -50% appliqué)' 
      : (ci.hasPricePromo ? ` (Prix Promo: ~${ci.unpromotedPeptideCost.toFixed(2)}€~ ${ci.peptideCost.toFixed(2)}€)` : '')
    let line = `• *${ci.cleanName} ${cleanDsg}* (x${ci.qty} fiole${ci.qty > 1 ? 's' : ''}) — ${ci.peptideCost.toFixed(2)}€${promoStr}`
    if (ci.bacQty > 0) {
      line += `\n  └ Option Eau Bactériostatique 3ml (x${ci.bacQty}) : +${ci.bacCost.toFixed(2)}€ (${ci.unitBacPrice.toFixed(2)}€/u)`
    } else {
      line += `\n  └ Sans Eau Bactériostatique`
    }
    return line
  })

  let whatsappMsgText = 
    `🔬 *COMMANDE KRATOSBIO*\n\n` +
    `Bonjour, je souhaite valider la commande suivante :\n\n` +
    whatsappLines.join('\n\n')

  if (appliedPromo) {
    whatsappMsgText += `\n\n🏷️ *CODE PROMO APPLIQUÉ : ${appliedPromo.code}* (-${promoDiscount.toFixed(2)}€)`
  }

  whatsappMsgText += 
    `\n\n💳 *TOTAL COMMANDE : ${grandTotal.toFixed(2)}€*\n\n` +
    `Merci de me confirmer la disponibilité ainsi que les modalités de règlement et d'expédition.`

  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(whatsappMsgText)}`

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '540px',
          borderRadius: '20px',
          padding: '2rem 1.8rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          border: '1px solid #e2e8f0'
        }}
      >
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--black)',
            transition: 'background 0.2s ease'
          }}
          aria-label="Fermer"
        >
          <CloseIcon />
        </button>

        {/* MODAL HEADER */}
        <div style={{ marginBottom: '1.5rem', paddingRight: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ 
              display: 'inline-block', 
              background: '#f1f5f9', 
              padding: '0.3rem 0.7rem', 
              borderRadius: '6px', 
              fontSize: '0.68rem', 
              fontWeight: 800, 
              letterSpacing: '0.12em',
              color: 'var(--gray-600)',
              marginBottom: '0.4rem'
            }}>
              🛒 VOTRE PANIER
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 0.3rem 0', color: 'var(--black)' }}>
              RÉCAPITULATIF DE COMMANDE
            </h2>
            <p style={{ fontSize: '0.76rem', color: 'var(--gray-500)', margin: 0 }}>
              Détail des fioles & de l'eau bactériostatique • Validation directe WhatsApp
            </p>
          </div>

          {cartItems.length > 0 && onClearCart && (
            <button 
              onClick={onClearCart}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.4rem 0',
                textDecoration: 'underline',
                flexShrink: 0
              }}
            >
              Vider le panier
            </button>
          )}
        </div>

        {/* CART ITEMS LIST */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.2rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-600)', margin: '0 0 0.4rem 0' }}>
                Votre panier est vide 🛒
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: 0 }}>
                Sélectionnez des articles pour débuter votre commande.
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => {
              const ci = computedItems[idx]
              const cleanDsg = formatCleanDosage(item.dosage)
              return (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    background: '#f8fafc',
                    border: ci.hasPromo ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1rem'
                  }}
                >
                  {/* PROMO BADGE */}
                  {ci.hasPromo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                      <span>
                        {ci.hasPackPromo 
                          ? 'PROMO APPLIQUÉE : Pack 3 Fioles (-50% sur la 3ème fiole)' 
                          : `PROMO APPLIQUÉE : Offre Spéciale (-${(ci.unpromotedPeptideCost - ci.peptideCost).toFixed(2).replace('.', ',')} €)`
                        }
                      </span>
                    </div>
                  )}

                  {/* PEPTIDE ROW */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '8px', 
                        background: '#ffffff', 
                        border: '1px solid #cbd5e1', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0 
                      }}>
                        <img 
                          src={ci.cleanName.includes('GHK') ? '/images/ghkcu.png' : '/images/reta.png'} 
                          alt={ci.cleanName} 
                          style={{ height: '36px', objectFit: 'contain' }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--black)', wordBreak: 'break-word' }}>
                            {ci.cleanName}
                          </span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'var(--black)', color: '#ffffff', padding: '0.15rem 0.4rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                            {cleanDsg}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)', margin: '0.2rem 0 0 0' }}>
                          Quantité : <strong>{ci.qty} fiole{ci.qty > 1 ? 's' : ''}</strong>
                        </p>
                      </div>
                    </div>

                    {/* PEPTIDE PRICE */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {ci.hasPromo && (
                        <span style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'line-through', display: 'block', fontWeight: 700 }}>
                          {ci.unpromotedPeptideCost.toFixed(2).replace('.', ',')} €
                        </span>
                      )}
                      <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--black)' }}>
                        {ci.peptideCost.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </div>

                  {/* EAU BACTERIOSTATIQUE DETAILED ROW */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--black)', display: 'block' }}>
                        Eau Bactériostatique 3ml
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                        +{ci.unitBacPrice} € par fiole ({ci.bacQty} fiole{ci.bacQty > 1 ? 's' : ''})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {/* BAC QTY CONTROLLER */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', background: '#f8fafc' }}>
                        <button 
                          onClick={() => onUpdateBacQty && onUpdateBacQty(idx, -1)}
                          style={{ border: 'none', background: 'none', width: '24px', height: '24px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Diminuer l'eau BAC"
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '0 0.4rem', minWidth: '18px', textAlign: 'center' }}>
                          {ci.bacQty}
                        </span>
                        <button 
                          onClick={() => onUpdateBacQty && onUpdateBacQty(idx, 1)}
                          style={{ border: 'none', background: 'none', width: '24px', height: '24px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Augmenter l'eau BAC"
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--black)', minWidth: '45px', textAlign: 'right' }}>
                        +{ci.bacCost.toFixed(2).replace('.', ',')} €
                      </span>
                    </div>
                  </div>

                  {/* ITEM BOTTOM CONTROLS (PEPTIDE QTY & REMOVE) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', marginTop: '0.1rem' }}>
                    
                    {/* FIOLES QUANTITY CONTROLLER (- 1 +) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-500)' }}>Fioles :</span>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => onUpdateQty && onUpdateQty(idx, -1)}
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            width: '28px',
                            height: '28px',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--black)'
                          }}
                          title="Diminuer les fioles"
                        >
                          -
                        </button>
                        <span style={{ padding: '0 0.8rem', fontSize: '0.82rem', fontWeight: 800, color: 'var(--black)' }}>
                          {ci.qty}
                        </span>
                        <button 
                          onClick={() => onUpdateQty && onUpdateQty(idx, 1)}
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            width: '28px',
                            height: '28px',
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--black)'
                          }}
                          title="Augmenter les fioles"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* DELETE ITEM BUTTON */}
                    <button 
                      onClick={() => onRemoveItem && onRemoveItem(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      title="Retirer l'article"
                    >
                      <TrashIcon />
                      <span>Retirer</span>
                    </button>
                  </div>

                </div>
              )
            })
          )}
        </div>

        {/* PROMO CODE BOX */}
        {cartItems.length > 0 && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.9rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gray-700)', margin: '0 0 0.5rem 0', letterSpacing: '0.04em' }}>
              🏷️ CODE PROMO
            </p>
            {appliedPromo ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '0.5rem 0.8rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#15803d' }}>
                  ✓ Code {appliedPromo.code} ({appliedPromo.type === 'percent' ? `-${appliedPromo.value}%` : `-${appliedPromo.value}€`})
                </span>
                <button 
                  type="button"
                  onClick={handleRemovePromo}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Retirer
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value); setPromoStatus({ msg: '', isError: false }); }}
                  placeholder="Entrez votre code promo"
                  style={{ flex: 1, padding: '0.45rem 0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  style={{ background: 'var(--black)', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.45rem 1rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  APPLIQUER
                </button>
              </div>
            )}
            {promoStatus.msg && !appliedPromo && (
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: promoStatus.isError ? '#ef4444' : '#15803d', marginTop: '0.4rem', marginBottom: 0 }}>
                {promoStatus.msg}
              </p>
            )}
          </div>
        )}

        {/* TOTAL SUMMARY CARD */}
        {cartItems.length > 0 && (
          <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gray-600)', fontWeight: 700, marginBottom: '0.3rem' }}>
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2).replace('.', ',')} €</span>
              </div>
            )}
            {appliedPromo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#15803d', fontWeight: 800, marginBottom: '0.5rem' }}>
                <span>Remise Code Promo ({appliedPromo.code})</span>
                <span>-{promoDiscount.toFixed(2).replace('.', ',')} €</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderTop: appliedPromo ? '1px solid #cbd5e1' : 'none', paddingTop: appliedPromo ? '0.4rem' : '0' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gray-600)', letterSpacing: '0.06em' }}>
                TOTAL COMMANDE ({totalVials} fiole{totalVials > 1 ? 's' : ''})
              </span>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--black)', letterSpacing: '-0.02em' }}>
                {grandTotal.toFixed(2).replace('.', ',')} €
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--gray-500)', margin: 0 }}>
              ✓ Expédition rapide & emballage isotherme sécurisé
            </p>
          </div>
        )}

        {/* SINGLE PRIMARY WHATSAPP CTA BUTTON */}
        <a 
          href={cartItems.length > 0 ? whatsappUrl : '#'}
          target={cartItems.length > 0 ? "_blank" : "_self"}
          rel="noopener noreferrer"
          onClick={(e) => {
            if (cartItems.length === 0) {
              e.preventDefault()
              return
            }
            // Record order in localStorage for Admin Dashboard analytics
            try {
              const existingSales = JSON.parse(localStorage.getItem('kratos_sales_history') || '[]')
              const newOrder = {
                id: 'KB-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toISOString(),
                formattedDate: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
                items: computedItems.map((ci, idx) => ({
                  name: ci.cleanName,
                  dosage: formatCleanDosage(cartItems[idx]?.dosage || '10MG'),
                  qty: ci.qty,
                  peptideCost: ci.peptideCost,
                  bacQty: ci.bacQty,
                  bacCost: ci.bacCost,
                  totalCost: ci.totalCost
                })),
                totalVials: totalVials,
                grandTotal: grandTotal,
                status: 'Confirmé (WhatsApp)'
              }
              localStorage.setItem('kratos_sales_history', JSON.stringify([newOrder, ...existingSales]))
              window.dispatchEvent(new Event('kratos_sales_updated'))
            } catch (err) {
              console.error('Error saving order:', err)
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.7rem',
            background: cartItems.length > 0 ? '#16a34a' : '#cbd5e1',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            letterSpacing: '0.04em',
            padding: '1.1rem 1.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            boxShadow: cartItems.length > 0 ? '0 8px 25px rgba(22, 163, 74, 0.3)' : 'none',
            cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <WhatsAppIcon />
          <span>FINALISER ET COMMANDER SUR WHATSAPP ➔</span>
        </a>

      </div>
    </div>
  )
}
