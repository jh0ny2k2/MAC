import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function isLowEnd() {
  return typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
}

export default function InvitationScene3D() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (isLowEnd()) return

    const W = el.clientWidth || 320
    const H = el.clientHeight || 400
    if (W < 10 || H < 10) return

    const s = new THREE.Scene()
    const c = new THREE.PerspectiveCamera(28, W / H, 0.1, 50)
    c.position.set(0, 0.5, 5.5)

    const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    r.setSize(W, H)
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    r.toneMapping = THREE.ACESFilmicToneMapping
    r.toneMappingExposure = 1.5
    el.appendChild(r.domElement)

    const al = new THREE.AmbientLight(0xffffff, 0.3)
    s.add(al)
    const k = new THREE.DirectionalLight('#FFF8E7', 3.5)
    k.position.set(4, 6, 5)
    s.add(k)
    const f = new THREE.DirectionalLight('#C9A96E', 0.5)
    f.position.set(-3, 1, -4)
    s.add(f)
    const rim = new THREE.DirectionalLight('#ffffff', 0.4)
    rim.position.set(-2, -3, 4)
    s.add(rim)
    const sp = new THREE.DirectionalLight('#FFFFFF', 0.8)
    sp.position.set(3, 4, -5)
    s.add(sp)

    const group = new THREE.Group()

    const ringMat = new THREE.MeshPhysicalMaterial({
      color: '#C9A96E',
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      emissive: '#C9A96E',
      emissiveIntensity: 0.08,
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.08, 48, 80), ringMat)
    ring.position.y = 0
    group.add(ring)

    const gemMat = new THREE.MeshPhysicalMaterial({
      color: '#F0F8FF',
      metalness: 0.0,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.92,
      emissive: '#B8D4F0',
      emissiveIntensity: 0.25,
      envMapIntensity: 2.5,
    })
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), gemMat)
    gem.position.set(0, 0.85, 0)
    group.add(gem)

    group.rotation.x = Math.PI / 3.5
    s.add(group)

    const pc = 50
    const pg = new THREE.BufferGeometry()
    const pp = new Float32Array(pc * 3)
    const pd = []
    for (let i = 0; i < pc; i++) {
      const a = Math.random() * Math.PI * 2
      const rad = 1.4 + Math.random() * 1.6
      pp[i * 3] = Math.cos(a) * rad
      pp[i * 3 + 1] = (Math.random() - 0.5) * 2.5
      pp[i * 3 + 2] = (Math.random() - 0.5) * 1.2
      pd.push({ vy: 0.002 + Math.random() * 0.005, resetY: -1.5 + Math.random() * -0.3, maxY: 1.5 + Math.random() * 0.5 })
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    const pm = new THREE.PointsMaterial({
      color: '#C9A96E', size: 0.015, transparent: true, opacity: 0.25,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })
    const parts = new THREE.Points(pg, pm)
    s.add(parts)
    const pa = pg.attributes.position

    let id
    const clock = new THREE.Clock()

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.05)
      const t = clock.getElapsedTime()

      group.rotation.y += delta * 0.35
      gemMat.emissiveIntensity = 0.2 + Math.sin(t * 1.2) * 0.15

      for (let i = 0; i < pc; i++) {
        const i3 = i * 3
        pa.array[i3 + 1] += pd[i].vy * delta * 30
        if (pa.array[i3 + 1] > pd[i].maxY) {
          pa.array[i3] = (Math.random() - 0.5) * 3.2
          pa.array[i3 + 1] = pd[i].resetY
          pa.array[i3 + 2] = (Math.random() - 0.5) * 1.0
        }
      }
      pa.needsUpdate = true

      r.render(s, c)
      id = requestAnimationFrame(animate)
    }
    animate()

    function resize() {
      const nw = el.clientWidth
      const nh = el.clientHeight
      if (nw < 10 || nh < 10) return
      c.aspect = nw / nh
      c.updateProjectionMatrix()
      r.setSize(nw, nh)
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
      ringMat.dispose(); gemMat.dispose()
      ring.geometry.dispose(); gem.geometry.dispose()
      pg.dispose(); pm.dispose(); r.dispose()
      if (el.contains(r.domElement)) el.removeChild(r.domElement)
    }
  }, [])

  return <div ref={ref} className="w-full h-full" />
}
