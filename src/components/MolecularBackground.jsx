import { useEffect, useRef } from 'react'

export default function MolecularBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const isMobile = width < 768
    const particleCount = isMobile ? 22 : Math.min(Math.floor(width / 30), 55)
    const particles = []

    // Distinct biotech palettes: cyan, royal biotech blue, and bio-emerald
    const colors = [
      { r: 59, g: 130, b: 246 },   // #3b82f6 Blue Tech
      { r: 14, g: 165, b: 233 },   // #0ea5e9 Cyan Lab
      { r: 16, g: 185, b: 129 },   // #10b981 Bio-Emerald
      { r: 99, g: 102, b: 241 }    // #6366f1 Violet Peptide
    ]

    for (let i = 0; i < particleCount; i++) {
      const color = colors[i % colors.length]
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.45),
        vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.45),
        radius: Math.random() * (isMobile ? 1.6 : 2.2) + 1.2,
        baseAlpha: Math.random() * 0.35 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        color
      })
    }

    // Floating ambient bioluminescent glows (both desktop and mobile)
    const blobs = isMobile
      ? [
          { x: width * 0.2, y: height * 0.25, r: 180, vx: 0.08, vy: 0.06, color: 'rgba(59, 130, 246, 0.045)' },
          { x: width * 0.8, y: height * 0.75, r: 210, vx: -0.07, vy: -0.06, color: 'rgba(16, 185, 129, 0.035)' }
        ]
      : [
          { x: width * 0.15, y: height * 0.2, r: 320, vx: 0.12, vy: 0.08, color: 'rgba(59, 130, 246, 0.05)' },
          { x: width * 0.85, y: height * 0.55, r: 360, vx: -0.1, vy: 0.1, color: 'rgba(16, 185, 129, 0.038)' },
          { x: width * 0.5, y: height * 0.88, r: 280, vx: 0.09, vy: -0.12, color: 'rgba(14, 165, 233, 0.045)' }
        ]

    let pointerX = width / 2
    let pointerY = height / 2
    let pointerActive = false

    const handleMouseMove = (e) => {
      pointerX = e.clientX
      pointerY = e.clientY
      pointerActive = true
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        pointerX = e.touches[0].clientX
        pointerY = e.touches[0].clientY
        pointerActive = true
      }
    }

    const handlePointerLeave = () => {
      pointerActive = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove, { passive: true })
    window.addEventListener('mouseleave', handlePointerLeave)

    const maxDist = isMobile ? 95 : 135
    const interactionDist = isMobile ? 120 : 170

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw diffused bioluminescent ambient light orbs
      for (let b of blobs) {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -80 || b.x > width + 80) b.vx *= -1
        if (b.y < -80 || b.y > height + 80) b.vy *= -1

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Update and draw molecular nodes & peptide bonds
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Bounce at canvas borders
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        p.pulsePhase += p.pulseSpeed
        const currentAlpha = Math.min(0.85, Math.max(0.18, p.baseAlpha + Math.sin(p.pulsePhase) * 0.18))

        // Particle circle
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Connecting peptide bonds
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.16
            ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${lineAlpha})`
            ctx.lineWidth = 0.75
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }

        // Pointer (mouse / touch) interaction
        if (pointerActive) {
          const mdx = pointerX - p.x
          const mdy = pointerY - p.y
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
          if (mdist < interactionDist) {
            const mAlpha = (1 - mdist / interactionDist) * 0.22
            ctx.strokeStyle = `rgba(15, 23, 42, ${mAlpha})`
            ctx.lineWidth = 0.65
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(pointerX, pointerY)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove)
      window.removeEventListener('mouseleave', handlePointerLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.95
      }} 
    />
  )
}
