import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import VialImage from './VialImage'
import { pushCloudState } from '../utils/cloudSync'

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function ProductSelection({ selectedProduct, onSelectProduct, onAddToCart, siteConfig }) {
  const activeTab = selectedProduct || 'RETA'
  const setActiveTab = onSelectProduct || (() => {})

  const [qty, setQty] = useState(1)
  const [includeBacWater, setIncludeBacWater] = useState(true)
  const [bacWaterQty, setBacWaterQty] = useState(1)

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [starRating, setStarRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Reviews pagination & image lightbox state
  const [visibleCount, setVisibleCount] = useState(4)
  const [expandedPhoto, setExpandedPhoto] = useState(null)

  // Dynamic reviews state
  const [allReviews, setAllReviews] = useState([])

  const loadReviews = () => {
    const stored = JSON.parse(localStorage.getItem('kratos_reviews') || '[]')
    setAllReviews(stored)
  }

  useEffect(() => {
    loadReviews()
    window.addEventListener('kratos_reviews_updated', loadReviews)
    return () => window.removeEventListener('kratos_reviews_updated', loadReviews)
  }, [])

  // Reset pagination when active tab changes
  useEffect(() => {
    setVisibleCount(4)
  }, [activeTab])

  // Photo upload handler
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5 Mo.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Lock body scroll when review modal is active so background does not scroll
  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showReviewModal])

  // STRICT PER-PRODUCT APPROVED REVIEWS FILTERING
  const productApprovedReviews = allReviews.filter(r => r.status === 'approved' && r.product === activeTab)
  const approvedCount = productApprovedReviews.length
  const totalStars = productApprovedReviews.reduce((sum, r) => sum + r.stars, 0)
  const averageRating = approvedCount > 0 ? (totalStars / approvedCount).toFixed(1) : '5.0'

  // Dynamic product config from Admin Dashboard
  const productData = siteConfig?.products?.[activeTab] || {
    dosage: activeTab === 'RETA' ? '10MG' : '100MG',
    price: activeTab === 'RETA' ? 60 : 50,
    stock: activeTab === 'RETA' ? 20 : 9,
    description: activeTab === 'RETA'
      ? 'RETA est un peptide de recherche de haute pureté destiné à l\'étude des mécanismes de régulation métabolique et de lipolyse.'
      : 'GHK-Cu est un complexe cuivrique hautement dosé destiné à l\'étude de la régénération cutanée et la synthèse du collagène.'
  }

  const dosage = productData.dosage
  const singleBasePrice = productData.price
  const currentStock = productData.stock ?? (activeTab === 'RETA' ? 20 : 9)
  const isOutOfStock = currentStock <= 0

  const bacWaterUnitPrice = siteConfig?.bacWaterPrice || 3

  // AUTOMATIC 50% DISCOUNT ON EVERY 3RD VIAL & ORIGINAL PRICE STRIKETHROUGH
  const originalUnitPrice = (productData.originalPrice && Number(productData.originalPrice) > singleBasePrice) ? Number(productData.originalPrice) : singleBasePrice
  const numDiscountedVials = Math.floor(qty / 3)
  const numFullPriceVials = qty - numDiscountedVials
  const productTotal = (numFullPriceVials * singleBasePrice) + (numDiscountedVials * singleBasePrice * 0.5)
  const unpromotedProductTotal = qty * originalUnitPrice

  const hasDiscount = numDiscountedVials > 0 || (originalUnitPrice > singleBasePrice)

  const bacWaterCost = includeBacWater ? (bacWaterUnitPrice * bacWaterQty) : 0
  const totalPrice = productTotal + bacWaterCost
  const totalUnpromotedPrice = unpromotedProductTotal + bacWaterCost

  const handleAdd = () => {
    if (isOutOfStock) return
    onAddToCart({
      name: activeTab,
      dosage: dosage,
      qty,
      singleBasePrice,
      pack3Price: siteConfig?.pack3Price || (singleBasePrice * 2.5),
      includeBacWater,
      bacWaterQty: includeBacWater ? bacWaterQty : 0,
      bacWaterUnitPrice: bacWaterUnitPrice
    })
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!authorName.trim() || !reviewComment.trim()) return

    const newReview = {
      id: Date.now(),
      product: activeTab,
      name: authorName.trim(),
      stars: starRating,
      text: reviewComment.trim(),
      photo: photoPreview || null,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'pending' // Requires admin validation before display
    }

    const existingReviews = JSON.parse(localStorage.getItem('kratos_reviews') || '[]')
    const updated = [...existingReviews, newReview]
    pushCloudState({ reviews: updated })

    setShowReviewModal(false)
    setAuthorName('')
    setReviewComment('')
    setStarRating(5)
    setPhotoPreview(null)
    setSubmitSuccess(true)
  }

  return (
    <section id="selection" className="selection-section" style={{ background: '#ffffff', padding: '3.5rem 1.5rem', position: 'relative' }}>
      <div className="selection-inner" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div className="tab-links" style={{ background: '#f1f5f9', padding: '0.35rem', borderRadius: '99px' }}>
            {['RETA','GHK-Cu'].map(t => (
              <button 
                key={t} 
                className={`tab-link${activeTab===t?' active':''}`} 
                onClick={() => setActiveTab(t)}
                style={{ fontSize: '0.78rem', fontWeight: 600, padding: '0.5rem 1.4rem' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="selection-grid" style={{ gap: '3.5rem', alignItems: 'flex-start' }}>
          
          {/* TOP / LEFT: CLEAN CENTERED VIAL PHOTO */}
          <div className="product-image-wrap" style={{ textAlign: 'center' }}>
            <VialImage product={activeTab} />
          </div>

          {/* BOTTOM / RIGHT: PRODUCT DETAILS & OPTIONS */}
          <div className="product-info">
            
            {/* TITLE & DYNAMIC PRICE ROW - STABLE FIXED SIZES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'nowrap', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ 
                fontSize: '1.55rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em', 
                margin: 0, 
                color: 'var(--black)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                paddingTop: '0.2rem'
              }}>
                {activeTab} <span style={{ fontWeight: 800 }}>{dosage}</span>
              </h2>

              {/* RIGHT COLUMN: STRIKETHROUGH PRICE DIRECTLY ABOVE MAIN PRICE */}
              <div style={{ textAlign: 'right', whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {hasDiscount && (
                  <span style={{ 
                    fontSize: '0.9rem', 
                    color: '#64748b', 
                    textDecoration: 'line-through', 
                    fontWeight: 700,
                    lineHeight: 1,
                    marginBottom: '0.15rem'
                  }}>
                    {totalUnpromotedPrice.toFixed(2).replace('.', ',')} €
                  </span>
                )}

                <span style={{ 
                  fontSize: '1.85rem', 
                  fontWeight: 900, 
                  letterSpacing: '-0.03em', 
                  color: 'var(--black)',
                  lineHeight: 1
                }}>
                  {totalPrice.toFixed(2).replace('.', ',')} €
                </span>

                {numDiscountedVials > 0 ? (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    color: '#15803d', 
                    textTransform: 'uppercase', 
                    marginTop: '0.2rem' 
                  }}>
                    -50% SUR CHAQUE 3E FIOLE
                  </span>
                ) : (originalUnitPrice > singleBasePrice) ? (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    color: '#15803d', 
                    textTransform: 'uppercase', 
                    marginTop: '0.2rem' 
                  }}>
                    PRIX EN PROMOTION
                  </span>
                ) : null}
              </div>
            </div>

            {/* DYNAMIC STOCK INDICATOR: DARKER GREEN DOT, TEXT IN NEUTRAL GRAY */}
            <p className="stock-line" style={{ 
              fontSize: '0.74rem', 
              fontWeight: 500, 
              color: 'var(--gray-600)', 
              margin: '0.2rem 0 0.4rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span 
                className="stock-dot" 
                style={{ 
                  background: isOutOfStock ? '#ef4444' : '#15803d',
                  boxShadow: isOutOfStock ? '0 0 8px rgba(239, 68, 68, 0.4)' : '0 0 8px rgba(21, 128, 61, 0.4)'
                }}
              />
              {isOutOfStock ? 'RUPTURE DE STOCK (0 UNITÉ DISPONIBLE)' : `${currentStock} UNITÉS DISPONIBLES EN STOCK`}
            </p>

            {/* STRICT PRODUCT-SPECIFIC RATING DISPLAY */}
            <div className="stars-row" style={{ margin: '0.3rem 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="stars" style={{ color: '#f59e0b', fontSize: '0.9rem' }}>★★★★★</span>
              <span className="stars-text" style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--gray-600)' }}>
                {approvedCount > 0 ? `${averageRating}/5 · ${approvedCount} avis sur ${activeTab}` : `5.0/5 · 0 avis sur ${activeTab}`}
              </span>
              <button 
                type="button" 
                onClick={() => setShowReviewModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--blue-tech)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: '0.4rem'
                }}
              >
                Écrire un avis
              </button>
            </div>

            {/* SHORT DESCRIPTION */}
            <p className="product-text" style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--gray-700)', lineHeight: 1.6, marginBottom: '0.8rem' }}>
              {productData.description}
            </p>

            {/* 3 MINIMAL CHECKMARKS */}
            <div style={{ display: 'flex', gap: '0.8rem 1.2rem', flexWrap: 'wrap', fontSize: '0.72rem', fontWeight: 500, color: 'var(--gray-600)', marginBottom: '1.4rem' }}>
              <span>✓ PURETÉ ≥ 99 % (HPLC)</span>
              <span>✓ LYOPHILISÉ STÉRILE</span>
              <span>✓ LABORATOIRE CERTIFIÉ</span>
            </div>

            {/* DOSAGE & QUANTITÉ ROW */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.4rem' }}>
              <div>
                <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--black)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  DOSAGE 🛈
                </p>
                <button 
                  type="button"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    border: '2px solid var(--black)',
                    borderRadius: '4px',
                    background: 'var(--white)',
                    color: 'var(--black)',
                    cursor: 'default'
                  }}
                >
                  {dosage}
                </button>
              </div>

              <div>
                <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--black)', textTransform: 'uppercase', marginBottom: '0.4rem', textAlign: 'right' }}>
                  QUANTITÉ
                </p>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--gray-300)', borderRadius: '4px', overflow: 'hidden' }}>
                  <button 
                    type="button"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: '38px', height: '36px', border: 'none', background: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    −
                  </button>
                  <span style={{ width: '36px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800 }}>
                    {qty}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setQty(q => q + 1)}
                    style={{ width: '38px', height: '36px', border: 'none', background: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* OPTIONS RAPIDES */}
            <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--black)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              OPTIONS RAPIDES
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.4rem' }}>
              
              {/* PACK 3 FIOLES CARD (CLEAN: PACK 3 FIOLES + PRICE ONLY) */}
              <div 
                onClick={() => setQty(qty === 3 ? 1 : 3)}
                style={{
                  padding: '0.8rem 0.6rem',
                  borderRadius: '8px',
                  border: qty >= 3 ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                  background: qty >= 3 ? '#f8fafc' : 'var(--white)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--black)' }}>
                  PACK 3 FIOLES
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--black)' }}>
                  {(singleBasePrice * 2.5).toFixed(2).replace('.', ',')} €
                </span>
              </div>

              {/* EAU BACTÉRIOSTATIQUE CARD */}
              <div 
                onClick={(e) => {
                  if (e.target.tagName !== 'BUTTON') {
                    setIncludeBacWater(!includeBacWater)
                  }
                }}
                style={{
                  padding: '0.6rem 0.7rem',
                  borderRadius: '8px',
                  border: includeBacWater ? '2px solid var(--black)' : '1px solid var(--gray-300)',
                  background: includeBacWater ? '#f8fafc' : 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <input 
                    type="checkbox" 
                    checked={includeBacWater} 
                    onChange={(e) => setIncludeBacWater(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--black)', cursor: 'pointer' }}
                  />
                  <div>
                    <p style={{ fontSize: '0.62rem', fontWeight: 800, margin: 0, lineHeight: 1.1, textTransform: 'uppercase', color: 'var(--black)' }}>
                      EAU BACTÉRIOSTATIQUE
                    </p>
                    <span style={{ fontSize: '0.62rem', color: 'var(--gray-600)', fontWeight: 700 }}>
                      +{bacWaterUnitPrice} € / fiole
                    </span>
                  </div>
                </div>

                {includeBacWater && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: '1.5px solid var(--gray-300)', 
                    borderRadius: '6px', 
                    overflow: 'hidden', 
                    background: '#ffffff', 
                    marginLeft: '0.2rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                  }}>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setBacWaterQty(q => Math.max(1, q - 1)); }}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: 'none', 
                        background: '#f8fafc', 
                        fontSize: '1.1rem', 
                        fontWeight: 800, 
                        color: 'var(--black)',
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        userSelect: 'none'
                      }}
                    >
                      −
                    </button>
                    <span style={{ 
                      width: '22px', 
                      textAlign: 'center', 
                      fontSize: '0.85rem', 
                      fontWeight: 800,
                      color: 'var(--black)' 
                    }}>
                      {bacWaterQty}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setBacWaterQty(q => q + 1); }}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        border: 'none', 
                        background: '#f8fafc', 
                        fontSize: '1.1rem', 
                        fontWeight: 800, 
                        color: 'var(--black)',
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        userSelect: 'none'
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* BLACK FULL WIDTH CTA BUTTON */}
            <button 
              className="btn-cart" 
              onClick={handleAdd} 
              id="add-to-cart-btn"
              disabled={isOutOfStock}
              style={{
                background: isOutOfStock ? '#cbd5e1' : 'var(--black)',
                color: isOutOfStock ? '#64748b' : 'var(--white)',
                width: '100%',
                padding: '1.1rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                border: 'none',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                boxShadow: isOutOfStock ? 'none' : '0 4px 14px rgba(0,0,0,0.12)'
              }}
            >
              <CartIcon /> {isOutOfStock ? 'RUPTURE DE STOCK — ÉPUISÉ' : 'AJOUTER AU PANIER'}
            </button>
          </div>
        </div>

        {/* NOTIFICATION WHEN A USER SUBMITS A REVIEW FOR VALIDATION */}
        {submitSuccess && (
          <div style={{
            margin: '2rem 0 1rem 0',
            padding: '1rem 1.4rem',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            color: '#15803d',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>✓ Votre avis sur {activeTab} a été transmis avec succès ! Il sera publié après validation dans l'espace Admin.</span>
            <button onClick={() => setSubmitSuccess(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', fontWeight: 800 }}>✕</button>
          </div>
        )}

        {/* DYNAMIC REVIEWS SECTION */}
        <div className="reviews-section" style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div className="reviews-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '.12em', margin: 0 }}>AVIS CLIENTS CERTIFIÉS ({activeTab})</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', margin: '0.2rem 0 0 0' }}>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {averageRating} / 5</span> — {approvedCount} avis publié{approvedCount > 1 ? 's' : ''} sur {activeTab}
              </p>
            </div>
            <button 
              onClick={() => setShowReviewModal(true)} 
              className="btn-primary" 
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.74rem', fontWeight: 800 }}
            >
              ÉCRIRE UN AVIS
            </button>
          </div>

          {productApprovedReviews.length === 0 ? (
            <div style={{ padding: '2.5rem 1.5rem', background: '#f8fafc', borderRadius: '10px', textAlign: 'center', border: '1.5px dashed #cbd5e1' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-700)', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                Aucun avis publié pour le moment sur {activeTab}.
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', margin: '0 0 1.2rem 0' }}>
                Vous avez testé {activeTab} ? Soyez le premier à donner votre avis !
              </p>
              <button 
                onClick={() => setShowReviewModal(true)} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                LAISSER LE PREMIER AVIS SUR {activeTab}
              </button>
            </div>
          ) : (
            <>
              <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem', alignItems: 'start' }}>
                {productApprovedReviews.slice(0, visibleCount).map(r => (
                  <div key={r.id} className="review-card" style={{ padding: '1.1rem', borderRadius: '10px', background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <div className="review-avatar" style={{ fontWeight: 800, width: '34px', height: '34px', borderRadius: '50%', background: 'var(--black)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem' }}>
                          {r.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="review-name" style={{ fontWeight: 700, margin: 0, fontSize: '0.84rem' }}>{r.name}</p>
                          <span style={{ fontSize: '0.64rem', color: 'var(--green)', fontWeight: 600 }}>✓ Achat Vérifié ({r.product})</span>
                        </div>
                      </div>
                      <p className="review-stars" style={{ color: '#f59e0b', margin: 0, fontSize: '0.88rem' }}>{'★'.repeat(r.stars)}</p>
                    </div>
                    
                    <p className="review-text" style={{ fontWeight: 400, margin: 0, fontSize: '0.82rem', lineHeight: 1.45, color: 'var(--gray-800)' }}>
                      « {r.text} »
                    </p>

                    {/* PHOTO ATTACHED BY CUSTOMER (COMPACT THUMBNAIL) */}
                    {r.photo && (
                      <div 
                        onClick={() => setExpandedPhoto(r.photo)}
                        style={{ 
                          marginTop: '0.6rem', 
                          borderRadius: '8px', 
                          overflow: 'hidden', 
                          border: '1px solid #e2e8f0', 
                          position: 'relative', 
                          display: 'inline-block',
                          cursor: 'pointer' 
                        }}
                      >
                        <img 
                          src={r.photo} 
                          alt={`Photo jointe par ${r.name}`} 
                          style={{ height: '80px', width: 'auto', maxWidth: '140px', objectFit: 'cover', display: 'block', borderRadius: '7px' }}
                        />
                        <span style={{ 
                          position: 'absolute', 
                          bottom: '4px', 
                          right: '4px', 
                          background: 'rgba(0,0,0,0.65)', 
                          color: '#fff', 
                          fontSize: '0.55rem', 
                          fontWeight: 700, 
                          padding: '0.1rem 0.35rem', 
                          borderRadius: '4px', 
                          backdropFilter: 'blur(4px)' 
                        }}>
                          🔍 Agrandir
                        </span>
                      </div>
                    )}

                    <p style={{ fontSize: '0.64rem', color: 'var(--gray-400)', marginTop: '0.65rem', marginBottom: 0 }}>
                      Publié le {r.date}
                    </p>
                  </div>
                ))}
              </div>

              {/* PAGINATION / LOAD MORE BUTTON */}
              {productApprovedReviews.length > 4 && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  {visibleCount < productApprovedReviews.length ? (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => prev + 4)}
                      className="btn-secondary"
                      style={{
                        padding: '0.7rem 1.8rem',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        borderRadius: '8px'
                      }}
                    >
                      VOIR PLUS D'AVIS ({productApprovedReviews.length - visibleCount} RESTANTS) 🠗
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(4)}
                      className="btn-secondary"
                      style={{
                        padding: '0.5rem 1.2rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--gray-600)',
                        borderRadius: '6px'
                      }}
                    >
                      VOIR MOINS D'AVIS 🠕
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* MODAL FOR WRITING A REVIEW WITH PHOTO ATTACHMENT */}
      {showReviewModal && createPortal(
        <div 
          onClick={() => setShowReviewModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.2rem',
            boxSizing: 'border-box'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--white)',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              padding: '1.8rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setShowReviewModal(false)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
            >
              <CloseIcon />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              LAISSER UN AVIS SUR {activeTab}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              Votre avis sera soumis à modération avant d'être publié sur la fiche {activeTab}.
            </p>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Votre Nom ou Pseudonyme *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Marc L."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1.5px solid var(--gray-300)', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Note Globale *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: star <= starRating ? '#f59e0b' : '#cbd5e1',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Votre Retour d'Expérience *
                </label>
                <textarea 
                  required
                  rows={3}
                  placeholder={`Partagez votre avis sur le produit ${activeTab}...`}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1.5px solid var(--gray-300)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {/* PHOTO UPLOAD INPUT */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Ajouter une Photo du Produit (Optionnel) 📷
                </label>

                {photoPreview ? (
                  <div style={{ position: 'relative', display: 'inline-block', marginTop: '0.2rem' }}>
                    <img src={photoPreview} alt="Aperçu photo" style={{ height: '90px', borderRadius: '8px', border: '1.5px solid #cbd5e1', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => setPhotoPreview(null)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '22px',
                        height: '22px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={{ border: '2px dashed #cbd5e1', borderRadius: '8px', padding: '0.8rem', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                      id="review-photo-input"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="review-photo-input" style={{ cursor: 'pointer', display: 'block' }}>
                      <span style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.2rem' }}>📷</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--black)' }}>Cliquez pour joindre une photo</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--gray-500)', display: 'block', marginTop: '0.1rem' }}>Formats d'image acceptés (max 5 Mo)</span>
                    </label>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '0.9rem', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}
              >
                SOUMETTRE MON AVIS (POUR VALIDATION)
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* LIGHTBOX FOR EXPANDED PHOTO VIEW */}
      {expandedPhoto && createPortal(
        <div 
          onClick={() => setExpandedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '650px', width: '100%', textAlign: 'center' }}
          >
            <img 
              src={expandedPhoto} 
              alt="Photo client agrandie" 
              style={{ maxWidth: '100%', maxHeight: '82vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} 
            />
            <button 
              onClick={() => setExpandedPhoto(null)}
              style={{
                position: 'absolute',
                top: '-1rem',
                right: '-1rem',
                background: '#ffffff',
                color: 'var(--black)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              ✕
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
