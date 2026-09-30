import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true
  return false
}

const STAGES = [
  { threshold: 0, title: 'Tu visión', subtitle: 'Cada proyecto comienza con una idea única. Nosotros la hacemos realidad.', tag: '01 — Descubrimiento' },
  { threshold: 0.25, title: 'Nuestra experiencia', subtitle: 'Años de desarrollo web al servicio de tu marca y tus objetivos.', tag: '02 — Creación' },
  { threshold: 0.50, title: 'Tecnología de punta', subtitle: 'Construido con el stack más moderno del mercado para resultados óptimos.', tag: '03 — Desarrollo' },
  { threshold: 0.75, title: 'Resultados reales', subtitle: 'Tu negocio merece una presencia digital extraordinaria y única.', tag: '04 — Lanzamiento' },
]

export default function ScrollScene3D() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const pctRef = useRef(null)
  const [stageIdx, setStageIdx] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const canvasEl = canvasRef.current
    if (!container || !canvasEl) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (isLowEndDevice()) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.03)

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    canvasEl.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0x222222, 0.6)
    scene.add(ambient)

    const key = new THREE.DirectionalLight('#f5b342', 2.5)
    key.position.set(3, 5, 4)
    scene.add(key)

    const fill = new THREE.DirectionalLight('#f5b342', 0.8)
    fill.position.set(-3, 1, -4)
    scene.add(fill)

    const rim = new THREE.DirectionalLight('#ffffff', 0.4)
    rim.position.set(0, -3, 5)
    scene.add(rim)

    const backSpot = new THREE.SpotLight('#f5b342', 0.8)
    backSpot.position.set(0, 0, -5)
    scene.add(backSpot)

    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 160, 20)
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: '#f5b342',
      emissive: '#f5b342',
      emissiveIntensity: 0.08,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0,
    })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    scene.add(knot)

    const wireMat = new THREE.MeshBasicMaterial({
      color: '#f7c65a',
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    })
    const wire = new THREE.Mesh(knotGeo.clone(), wireMat)
    wire.scale.set(1.025, 1.025, 1.025)
    scene.add(wire)

    const knot2Geo = new THREE.TorusKnotGeometry(0.4, 0.12, 64, 8)
    const knot2Mat = new THREE.MeshPhysicalMaterial({
      color: '#f0ede8',
      emissive: '#f0ede8',
      emissiveIntensity: 0.05,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.25,
    })
    const knot2 = new THREE.Mesh(knot2Geo, knot2Mat)
    knot2.position.set(1.8, 1.2, 0)
    scene.add(knot2)

    const knot3Mat = knot2Mat.clone()
    knot3Mat.color.setHex(0xf5b342)
    knot3Mat.emissive.setHex(0xf5b342)
    knot3Mat.opacity = 0.2
    const knot3 = new THREE.Mesh(knot2Geo.clone(), knot3Mat)
    knot3.position.set(-1.6, -1.0, 0.5)
    knot3.scale.setScalar(0.7)
    scene.add(knot3)

    const ringMat = new THREE.MeshBasicMaterial({
      color: '#f5b342',
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
    })

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.02, 48, 80), ringMat)
    outerRing.rotation.x = Math.PI / 3
    scene.add(outerRing)

    const midRing = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.015, 32, 64), ringMat.clone())
    midRing.material.opacity = 0.04
    midRing.rotation.x = -Math.PI / 4 + 0.3
    scene.add(midRing)

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.025, 24, 48), ringMat.clone())
    innerRing.material.opacity = 0.08
    innerRing.rotation.z = Math.PI / 3
    scene.add(innerRing)

    const verticalRing = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.012, 32, 64), ringMat.clone())
    verticalRing.material.opacity = 0.03
    verticalRing.rotation.y = Math.PI / 2
    verticalRing.rotation.x = 0.2
    scene.add(verticalRing)

    const icoCount = 6
    const icos = []
    for (let i = 0; i < icoCount; i++) {
      const size = 0.06 + Math.random() * 0.08
      const icoMat = new THREE.MeshPhysicalMaterial({
        color: i % 2 === 0 ? '#f5b342' : '#f0ede8',
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.12 + Math.random() * 0.18,
        emissive: i % 2 === 0 ? '#f5b342' : '#f0ede8',
        emissiveIntensity: 0.02,
      })
      const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(size, 0), icoMat)
      ico.userData = {
        orbitRadius: 1.3 + Math.random() * 1.2,
        orbitSpeed: 0.3 + Math.random() * 0.5,
        orbitOffset: Math.random() * Math.PI * 2,
        heightOffset: (Math.random() - 0.5) * 1.8,
        rotSpeed: 0.5 + Math.random() * 1.5,
      }
      scene.add(ico)
      icos.push(ico)
    }

    const pCount = 1000
    const pGeo = new THREE.BufferGeometry()
    const pPos = new Float32Array(pCount * 3)
    const pSizes = new Float32Array(pCount)

    for (let i = 0; i < pCount; i++) {
      const radius = 1 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5
      pPos[i * 3 + 2] = radius * Math.cos(phi)
      pSizes[i] = 0.005 + Math.random() * 0.03
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))

    const pMat = new THREE.PointsMaterial({
      color: '#f5b342',
      size: 0.02,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    const pPosAttr = pGeo.attributes.position
    const origPositions = new Float32Array(pPosAttr.array)

    const gridHelper = new THREE.GridHelper(14, 28, 0xf5b342, 0xf5b342)
    gridHelper.position.y = -2.5
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0.03
    scene.add(gridHelper)

    let targetProgress = 0
    let smoothProgress = 0
    let prevStage = -1
    let scrollVelocity = 0

    const handleScroll = () => {
      const rect = container.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const scrolled = -rect.top
      const newTarget = Math.max(0, Math.min(1, scrolled / scrollable))
      scrollVelocity = newTarget - targetProgress
      targetProgress = newTarget
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05)
      smoothProgress += (targetProgress - smoothProgress) * Math.min(1, delta * 5)
      const p = Math.min(1, smoothProgress)

      let newStage = 0
      for (let i = STAGES.length - 1; i >= 0; i--) {
        if (p >= STAGES[i].threshold) { newStage = i; break }
      }
      if (newStage !== prevStage) {
        prevStage = newStage
        setStageIdx(newStage)
      }

      if (pctRef.current) {
        pctRef.current.textContent = `${Math.round(p * 100)}%`
      }

      scrollVelocity *= 0.95
      const speedFactor = Math.abs(scrollVelocity) > 0.01 ? 1 : 0.3

      knot.rotation.x = p * Math.PI * 4
      knot.rotation.y = p * Math.PI * 5
      knot.rotation.z = p * Math.PI * 0.5

      const knotScale = 0.8 + p * 0.3
      knot.scale.setScalar(knotScale)
      wire.rotation.copy(knot.rotation)
      wire.scale.setScalar(knotScale * 1.025)

      knot2.rotation.x = p * Math.PI * 6
      knot2.rotation.y = p * Math.PI * 4
      knot2.position.x = 1.8 + Math.sin(p * Math.PI * 2) * 0.5
      knot2.position.y = 1.2 + Math.sin(p * Math.PI * 3) * 0.3

      knot3.rotation.x = -p * Math.PI * 5
      knot3.rotation.y = p * Math.PI * 3
      knot3.position.x = -1.6 + Math.sin(p * Math.PI * 2 + 1) * 0.4
      knot3.position.y = -1.0 + Math.sin(p * Math.PI * 3 + 2) * 0.3
      const scale3 = 0.5 + p * 0.5
      knot3.scale.setScalar(scale3)

      outerRing.rotation.z = p * Math.PI * 2
      outerRing.rotation.y = p * Math.PI * 1.5
      outerRing.scale.setScalar(1 + Math.sin(p * Math.PI * 3) * 0.2)

      midRing.rotation.z = -p * Math.PI * 3
      midRing.rotation.x = -Math.PI / 4 + 0.3 + Math.sin(p * Math.PI * 2.5) * 0.2
      midRing.scale.setScalar(1 + Math.sin(p * Math.PI * 4 + 1) * 0.15)

      innerRing.rotation.x = p * Math.PI * 4
      innerRing.rotation.z = p * Math.PI * 3
      innerRing.scale.setScalar(1 + Math.sin(p * Math.PI * 5) * 0.2)

      verticalRing.rotation.y = Math.PI / 2 + p * Math.PI * 1.5
      verticalRing.rotation.x = 0.2 + Math.sin(p * Math.PI * 3) * 0.3
      verticalRing.scale.setScalar(1 + Math.sin(p * Math.PI * 3.5) * 0.1)

      outerRing.material.opacity = 0.03 + Math.sin(p * Math.PI * 2) * 0.04 + 0.03
      innerRing.material.opacity = 0.05 + Math.sin(p * Math.PI * 3) * 0.05 + 0.03

      const icoTime = p * Math.PI * 2
      icos.forEach((ico) => {
        const u = ico.userData
        const angle = icoTime * u.orbitSpeed + u.orbitOffset
        ico.position.set(
          Math.cos(angle) * u.orbitRadius,
          u.heightOffset + Math.sin(icoTime * 0.5 + u.orbitOffset) * 0.3,
          Math.sin(angle) * u.orbitRadius * 0.6,
        )
        ico.rotation.x += delta * u.rotSpeed * speedFactor
        ico.rotation.y += delta * u.rotSpeed * 0.7 * speedFactor
        ico.scale.setScalar(0.3 + p * 0.9)
      })

      gridHelper.position.z = -2 + p * 2.5
      gridHelper.material.opacity = 0.01 + p * 0.04

      const camAngle = p * Math.PI * 0.8
      const camRadius = 8 - p * 1
      camera.position.x = Math.sin(camAngle) * 2.5
      camera.position.y = 0.5 + Math.sin(p * Math.PI * 1.5) * 1.2
      camera.position.z = camRadius - Math.sin(camAngle) * 2
      camera.lookAt(0, 0, 0)

      particles.rotation.y = p * Math.PI * 4
      particles.rotation.x = p * Math.PI * 0.3
      pMat.opacity = 0.08 + Math.sin(p * Math.PI * 2) * 0.1 + 0.08

      const spread = 0.3 + p * 3.5
      for (let i = 0; i < pCount; i++) {
        const i3 = i * 3
        pPosAttr.array[i3] = origPositions[i3] * spread
        pPosAttr.array[i3 + 1] = origPositions[i3 + 1] * spread
        pPosAttr.array[i3 + 2] = origPositions[i3 + 2] * spread
      }
      pPosAttr.needsUpdate = true

      knotMat.emissiveIntensity = 0.04 + Math.sin(p * Math.PI * 4) * 0.1 + 0.06
      knotMat.roughness = 0.2 - p * 0.1
      knotMat.metalness = 0.8 + p * 0.1

      scene.fog.density = 0.02 + p * 0.025
      backSpot.intensity = 0.3 + p * 0.8

      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      knotGeo.dispose()
      knotMat.dispose()
      knot2Geo.dispose()
      knot2Mat.dispose()
      knot3Mat.dispose()
      wireMat.dispose()
      ringMat.dispose()
      icos.forEach((ico) => {
        ico.geometry.dispose()
        ico.material.dispose()
      })
      pGeo.dispose()
      pMat.dispose()
      renderer.dispose()
      if (canvasEl.contains(renderer.domElement)) {
        canvasEl.removeChild(renderer.domElement)
      }
    }
  }, [])

  const current = STAGES[stageIdx]

  return (
    <section ref={containerRef} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a]">
        <div ref={canvasRef} className="absolute inset-0" />

        <div
          className="absolute inset-0 z-[5] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, #0a0a0a 100%)',
          }}
        />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center max-w-4xl px-6">
            <span
              key={`tag-${stageIdx}`}
              className="inline-block text-xs tracking-[0.2em] uppercase text-[#f5b342]/60 mb-6 animate-fade-down"
            >
              {current.tag}
            </span>
            <h2
              key={`title-${stageIdx}`}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 animate-fade-up"
            >
              <span className="text-gradient">{current.title}</span>
            </h2>
            <p
              key={`sub-${stageIdx}`}
              className="text-lg sm:text-xl md:text-2xl text-[#5a5652] max-w-3xl mx-auto animate-fade-up animate-delay-200"
            >
              {current.subtitle}
            </p>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span
              ref={pctRef}
              className="text-xs tabular-nums tracking-[0.15em] text-[#f5b342]/40"
            >
              0%
            </span>
            <div className="flex items-center gap-2">
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-700"
                  style={{
                    height: '2px',
                    width: i === stageIdx ? '32px' : '10px',
                    background: i <= stageIdx ? '#f5b342' : '#2a2a2a',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '3s' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#f5b342]/30">
              <path d="M8 3v10M8 13l4-4M8 13l-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
