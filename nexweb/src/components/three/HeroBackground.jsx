import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true
  return false
}

export default function HeroBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isLowEnd = isLowEndDevice()
    const pixelRatio = Math.min(window.devicePixelRatio, isLowEnd ? 1 : 1.25)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(pixelRatio)
    container.appendChild(renderer.domElement)

    const segs = isLowEnd ? 48 : 96
    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.4, segs, 12)
    const knotMat = new THREE.MeshStandardMaterial({
      color: '#f5b342',
      emissive: '#f5b342',
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.3,
    })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    knot.position.x = 0.8
    scene.add(knot)

    let wire, ring, particles
    if (!isLowEnd) {
      const wMat = new THREE.MeshBasicMaterial({
        color: '#f7c65a', wireframe: true, transparent: true, opacity: 0.12,
      })
      wire = new THREE.Mesh(knotGeo.clone(), wMat)
      wire.scale.set(1.015, 1.015, 1.015)
      wire.position.x = 0.8
      scene.add(wire)

      const rMat = new THREE.MeshBasicMaterial({
        color: '#f5b342', transparent: true, opacity: 0.08, side: THREE.DoubleSide,
      })
      ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.02, 24, 48), rMat)
      ring.position.x = 0.8
      ring.rotation.x = Math.PI / 2
      scene.add(ring)

      const pCount = 80
      const pGeo = new THREE.BufferGeometry()
      const pos = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 10
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const pMat = new THREE.PointsMaterial({
        color: '#f5b342', size: 0.02, transparent: true, opacity: 0.2,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      particles = new THREE.Points(pGeo, pMat)
      scene.add(particles)
    }

    let mouseX = 0, mouseY = 0
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    if (!isLowEnd) window.addEventListener('mousemove', onMouseMove, { passive: true })

    let animationId
    const clock = new THREE.Clock()
    let rotX = 0, rotY = 0

    const animate = () => {
      const t = clock.getElapsedTime()
      if (!isLowEnd) {
        rotX += (mouseY * 0.3 - rotX) * 0.04
        rotY += (mouseX * 0.5 - rotY) * 0.04
        knot.rotation.x += (rotX - knot.rotation.x) * 0.06
        knot.rotation.y += (rotY - knot.rotation.y) * 0.06
        if (wire) wire.rotation.copy(knot.rotation)
        if (ring) ring.rotation.z = t * 0.2
        if (particles) particles.rotation.y = t * 0.03
      }
      knot.rotation.z = t * 0.1
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      knotGeo.dispose()
      knotMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: 'none' }}
    />
  )
}
