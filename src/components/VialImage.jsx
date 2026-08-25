export default function VialImage({ product }) {
  const imgSrc = product === 'GHK-Cu' ? '/images/ghkcu.png' : '/images/reta.png'
  const altText = product === 'GHK-Cu' ? 'KRATOSBIO GHK-CU' : 'KRATOSBIO RETATRUTIDE'

  return (
    <div className="product-vial-img" style={{
      background: 'transparent',
      borderRadius: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      position: 'relative',
      overflow: 'hidden',
      padding: '0.5rem 0'
    }}>
      <img 
        src={imgSrc} 
        alt={altText} 
        style={{
          maxHeight: '260px',
          maxWidth: '100%',
          height: 'auto',
          width: 'auto',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  )
}
