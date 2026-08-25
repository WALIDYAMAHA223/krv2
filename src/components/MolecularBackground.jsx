import { useEffect, useRef } from 'react'

export default function MolecularBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const isMobile = width < 768
    const particleCount = isMobile ? 12 : Math.min(Math.floor(width / 35), 45)
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        alpha: Math.random() * 0.4 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2
      })
    }

    // Floating background circles (ambient bioluminescent blobs)
    const blobs = isMobile ? [] : [
      { x: width * 0.15, y: height * 0.2, r: 250, vx: 0.15, vy: 0.1, color: 'rgba(74, 144, 217, 0.035)' },
      { x: width * 0.85, y: height * 0.6, r: 300, vx: -0.1, vy: 0.12, color: 'rgba(34, 197, 94, 0.025)' },
      { x: width * 0.5, y: height * 0.85, r: 220, vx: 0.1, vy: -0.15, color: 'rgba(74, 144, 217, 0.03)' }
    ]

    let mouseX = width / 2
    let mouseY = height / 2

    const handleMouseMove = (e) => {
      if (isMobile) return
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw subtle ambient background blobs
      blobs.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -100 || b.x > width + 100) b.vx *= -1
        if (b.y < -100 || b.y > height + 100) b.vy *= -1

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw nodes & connecting peptide bonds
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // Bounce at screen edge
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        p.pulsePhase += p.pulseSpeed
        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.15

        // Node circle
        ctx.fillStyle = `rgba(74, 144, 217, ${Math.max(0.1, currentAlpha)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Connect nearby nodes with molecular bond lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.15
            ctx.strokeStyle = `rgba(74, 144, 217, ${lineAlpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }

        // Slight interaction with mouse cursor
        const mdx = mouseX - p.x
        const mdy = mouseY - p.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 160) {
          const mAlpha = (1 - mdist / 160) * 0.25
          ctx.strokeStyle = `rgba(10, 10, 10, ${mAlpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
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
        opacity: 0.85
      }} 
    />
  )
}
