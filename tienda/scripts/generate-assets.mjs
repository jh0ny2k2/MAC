import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public', 'images')
const dataDir = path.join(root, 'src', 'data')

const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8'))
const teams = JSON.parse(fs.readFileSync(path.join(dataDir, 'teams.json'), 'utf-8'))
const drivers = JSON.parse(fs.readFileSync(path.join(dataDir, 'drivers.json'), 'utf-8'))

const teamColors = {}
for (const t of teams) {
  teamColors[t.name] = { primary: t.color, secondary: t.color2, code: t.code }
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function svgWrap(content, w = 800, h = 600) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${content}
</svg>`
}

const CAR_BODY = `
  <!-- front wing endplate -->
  <rect x="120" y="336" width="12" height="44" rx="3" fill="#ddd"/>
  <rect x="132" y="370" width="100" height="10" rx="4" fill="#ccc"/>
  <rect x="132" y="376" width="110" height="5" rx="2.5" fill="#bbb"/>
  <!-- floor -->
  <rect x="145" y="378" width="330" height="6" rx="1.5" fill="#1a1a1a"/>
  <!-- nose to cockpit -->
  <path d="M 232 370 C 248 348 262 330 295 320 L 435 312 C 452 310 465 318 470 338 L 474 366 L 149 366 L 144 358 Z"
        fill="url(#carGrad)" stroke="#555" stroke-width="1"/>
  <!-- sidepod -->
  <path d="M 330 316 C 350 312 410 310 450 314 L 456 340 C 420 338 355 336 330 334 Z"
        fill="var(--team-color, #e10600)" opacity="0.85"/>
  <!-- halo -->
  <path d="M 310 318 C 328 298 370 292 400 296 C 424 300 440 310 440 312"
        fill="none" stroke="#555" stroke-width="4" stroke-linecap="round"/>
  <!-- cockpit opening -->
  <ellipse cx="355" cy="309" rx="32" ry="9" fill="#0a0a0a"/>
  <ellipse cx="355" cy="309" rx="12" ry="4" fill="#1a1a2a"/>
  <!-- rear wing -->
  <rect x="470" y="282" width="60" height="8" rx="2" fill="#ddd"/>
  <rect x="468" y="276" width="64" height="6" rx="2" fill="var(--team-color, #e10600)"/>
  <rect x="468" y="368" width="64" height="7" rx="2" fill="#bbb"/>
  <rect x="530" y="272" width="10" height="110" rx="2" fill="#bbb"/>
  <!-- diffuser -->
  <path d="M 472 378 L 540 382 L 540 386 L 468 390 Z" fill="#1a1a1a"/>
  <!-- front wheel -->
  <circle cx="268" cy="392" r="40" fill="#0a0a0a" stroke="#222" stroke-width="2"/>
  <circle cx="268" cy="392" r="34" fill="#0d0d0d"/>
  <circle cx="268" cy="392" r="8" fill="#222"/>
  <g transform="translate(268,392)">
    <line x1="0" y1="-32" x2="0" y2="-10" stroke="#222" stroke-width="1.5"/>
    <line x1="22" y1="-22" x2="7" y2="-7" stroke="#222" stroke-width="1.5"/>
    <line x1="32" y1="0" x2="10" y2="0" stroke="#222" stroke-width="1.5"/>
    <line x1="22" y1="22" x2="7" y2="7" stroke="#222" stroke-width="1.5"/>
    <line x1="0" y1="32" x2="0" y2="10" stroke="#222" stroke-width="1.5"/>
    <line x1="-22" y1="22" x2="-7" y2="7" stroke="#222" stroke-width="1.5"/>
    <line x1="-32" y1="0" x2="-10" y2="0" stroke="#222" stroke-width="1.5"/>
    <line x1="-22" y1="-22" x2="-7" y2="-7" stroke="#222" stroke-width="1.5"/>
  </g>
  <!-- rear wheel -->
  <circle cx="432" cy="392" r="44" fill="#0a0a0a" stroke="#222" stroke-width="2"/>
  <circle cx="432" cy="392" r="38" fill="#0d0d0d"/>
  <circle cx="432" cy="392" r="9" fill="#222"/>
  <g transform="translate(432,392)">
    <line x1="0" y1="-36" x2="0" y2="-12" stroke="#222" stroke-width="1.5"/>
    <line x1="25" y1="-25" x2="8" y2="-8" stroke="#222" stroke-width="1.5"/>
    <line x1="36" y1="0" x2="12" y2="0" stroke="#222" stroke-width="1.5"/>
    <line x1="25" y1="25" x2="8" y2="8" stroke="#222" stroke-width="1.5"/>
    <line x1="0" y1="36" x2="0" y2="12" stroke="#222" stroke-width="1.5"/>
    <line x1="-25" y1="25" x2="-8" y2="8" stroke="#222" stroke-width="1.5"/>
    <line x1="-36" y1="0" x2="-12" y2="0" stroke="#222" stroke-width="1.5"/>
    <line x1="-25" y1="-25" x2="-8" y2="-8" stroke="#222" stroke-width="1.5"/>
  </g>
  <!-- mirror -->
  <rect x="310" y="322" width="12" height="8" rx="2" fill="var(--team-color, #e10600)"/>
  <rect x="306" y="324" width="6" height="4" rx="1" fill="#ccc"/>
`

function generateProductSVG(product, variation) {
  const tc = teamColors[product.team] || { primary: '#e10600', secondary: '#ff3b30', code: 'F1' }
  const bgColor1 = variation === 1 ? '#0f0f13' : '#0d1117'
  const linesRotation = variation === 1 ? '-22' : '-18'
  const linesX = variation === 1 ? '-120' : '-60'

  const content = `
  <defs>
    <linearGradient id="bgGrad" gradientTransform="rotate(20)" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgColor1}"/>
      <stop offset="100%" stop-color="#050507"/>
    </linearGradient>
    <linearGradient id="carGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f0f5"/>
      <stop offset="60%" stop-color="#c8c8d0"/>
      <stop offset="100%" stop-color="#a0a0a8"/>
    </linearGradient>
    <clipPath id="rectClip"><rect width="800" height="600" rx="12"/></clipPath>
  </defs>
  <g clip-path="url(#rectClip)">
    <rect width="800" height="600" fill="url(#bgGrad)"/>
    <g opacity="0.25" transform="translate(${linesX},0) rotate(${linesRotation},400,300)">
      ${Array.from({length:22}, (_,i) => `<line x1="${i*65}" y1="-100" x2="${i*65}" y2="800" stroke="rgba(255,255,255,0.07)" stroke-width="2"/>`).join('')}
    </g>
    <rect x="0" y="556" width="800" height="44" fill="${tc.primary}" opacity="0.18"/>
    <rect x="0" y="580" width="800" height="20" fill="${tc.primary}" opacity="0.06"/>
    <g style="--team-color:${tc.primary};transform:translateY(40px) scale(1.05);">
      ${CAR_BODY}
    </g>
    <text x="60" y="82" font-family="Oswald, sans-serif" font-size="44" font-weight="600" fill="white" opacity="0.85">${tc.code}</text>
    <text x="60" y="116" font-family="Inter, sans-serif" font-size="15" fill="rgba(255,255,255,0.45)">${product.season} Season</text>
    <text x="740" y="520" font-family="Oswald, sans-serif" font-size="68" font-weight="700" fill="rgba(255,255,255,0.06)">${product.scale}</text>
    <rect x="60" y="520" width="100" height="24" rx="4" fill="${tc.primary}" opacity="0.75"/>
    <text x="110" y="537" font-family="Inter, sans-serif" font-size="11" fill="white" text-anchor="middle" font-weight="600">${product.scale}</text>
    <rect x="60" y="494" width="80" height="20" rx="3" fill="rgba(255,255,255,0.08)"/>
    <text x="100" y="508" font-family="Inter, sans-serif" font-size="10" fill="rgba(255,255,255,0.6)" text-anchor="middle">${product.manufacturer}</text>
    <text x="740" y="82" font-family="Oswald, sans-serif" font-size="28" font-weight="400" fill="white" text-anchor="end" opacity="0.3">APEX</text>
  </g>`

  return svgWrap(content, 800, 600)
}

function generateTeamLogo(team) {
  const content = `
  <defs>
    <linearGradient id="tlg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a22"/>
      <stop offset="100%" stop-color="#0a0a10"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="24" fill="url(#tlg)"/>
  <rect x="0" y="360" width="400" height="40" rx="0 0 24 24" fill="${team.color}" opacity="0.3"/>
  <rect x="0" y="375" width="400" height="25" fill="${team.color}" opacity="0.12"/>
  <text x="200" y="185" font-family="Oswald, sans-serif" font-size="88" font-weight="700" fill="white" text-anchor="middle">${team.code}</text>
  <text x="200" y="225" font-family="Oswald, sans-serif" font-size="18" font-weight="400" fill="rgba(255,255,255,0.45)" text-anchor="middle" letter-spacing="4">FORMULA 1</text>
  <circle cx="200" cy="280" r="4" fill="${team.color}"/>
  <text x="200" y="325" font-family="Inter, sans-serif" font-size="13" fill="rgba(255,255,255,0.55)" text-anchor="middle">${team.country} · ${team.titles} titles</text>
  `
  return svgWrap(content, 400, 400)
}

function generateDriverImage(driver) {
  const tc = teamColors[driver.team] || { primary: '#e10600' }
  const initials = driver.name.split(' ').map(w => w[0]).join('')

  const content = `
  <defs>
    <linearGradient id="dg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#12121a"/>
      <stop offset="100%" stop-color="#08080c"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${tc.primary}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${tc.primary}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" rx="20" fill="url(#dg)"/>
  <rect width="600" height="600" rx="20" fill="url(#glow)"/>
  <rect x="0" y="560" width="600" height="40" rx="0 0 20 20" fill="${tc.primary}" opacity="0.15"/>
  <text x="520" y="140" font-family="Oswald, sans-serif" font-size="140" font-weight="700" fill="rgba(255,255,255,0.07)">${driver.number}</text>
  <circle cx="300" cy="240" r="68" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="3"/>
  <text x="300" y="258" font-family="Oswald, sans-serif" font-size="48" font-weight="600" fill="white" text-anchor="middle">${initials}</text>
  <text x="300" y="350" font-family="Oswald, sans-serif" font-size="26" font-weight="600" fill="white" text-anchor="middle">${driver.name.split(' ')[0]}</text>
  <text x="300" y="382" font-family="Oswald, sans-serif" font-size="20" font-weight="300" fill="white" text-anchor="middle">${driver.name.split(' ').slice(1).join(' ')}</text>
  <text x="300" y="440" font-family="Inter, sans-serif" font-size="13" fill="rgba(255,255,255,0.5)" text-anchor="middle">${driver.nationality}</text>
  <rect x="230" y="468" width="140" height="22" rx="4" fill="${tc.primary}" opacity="0.65"/>
  <text x="300" y="484" font-family="Inter, sans-serif" font-size="11" fill="white" text-anchor="middle" font-weight="600">${driver.team}</text>
  `
  return svgWrap(content, 600, 600)
}

function generateHero() {
  const content = `
  <defs>
    <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a10"/>
      <stop offset="50%" stop-color="#060609"/>
      <stop offset="100%" stop-color="#050507"/>
    </linearGradient>
    <linearGradient id="hcg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0f0f5"/>
      <stop offset="60%" stop-color="#c8c8d0"/>
    </linearGradient>
    <linearGradient id="redAccent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e10600"/>
      <stop offset="100%" stop-color="#ff2d2d"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#hg)"/>
  <g opacity="0.12">
    ${Array.from({length:35}, (_,i) => `<line x1="${i*60-120}" y1="-100" x2="${i*60-120}" y2="1100" stroke="white" stroke-width="2"/>`).join('')}
  </g>
  <rect x="0" y="840" width="1600" height="60" fill="#e10600" opacity="0.08"/>
  <rect x="0" y="870" width="1600" height="30" fill="#e10600" opacity="0.04"/>
  <g style="--team-color:#e10600; transform:translate(580px,180px) scale(1.8);">
    ${CAR_BODY}
  </g>
  <rect x="120" y="800" width="180" height="6" rx="3" fill="url(#redAccent)"/>
  <text x="120" y="760" font-family="Oswald, sans-serif" font-size="52" font-weight="700" fill="white">APEX COLLECTION</text>
  <text x="120" y="860" font-family="Oswald, sans-serif" font-size="140" font-weight="700" fill="rgba(255,255,255,0.05)">F1</text>
  `
  return svgWrap(content, 1600, 900)
}

ensureDir(path.join(publicDir, 'products'))
ensureDir(path.join(publicDir, 'teams'))
ensureDir(path.join(publicDir, 'drivers'))

console.log(`Generating ${products.length * 2} product images...`)
for (const product of products) {
  for (let i = 0; i < product.images.length; i++) {
    const filePath = path.join(root, 'public', product.images[i])
    fs.writeFileSync(filePath, generateProductSVG(product, i + 1))
  }
}
console.log(`Generating ${teams.length} team logos...`)
for (const team of teams) {
  fs.writeFileSync(path.join(root, 'public', team.logo), generateTeamLogo(team))
}
console.log(`Generating ${drivers.length} driver images...`)
for (const driver of drivers) {
  fs.writeFileSync(path.join(root, 'public', driver.image), generateDriverImage(driver))
}

console.log('Generating hero image...')
ensureDir(path.join(publicDir, 'hero'))
fs.writeFileSync(path.join(publicDir, 'hero', 'hero-f1.svg'), generateHero())

ensureDir(path.join(publicDir, 'products'))
fs.writeFileSync(path.join(publicDir, 'products', 'placeholder.svg'), svgWrap(`
  <defs>
    <linearGradient id="bgp" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14141a"/>
      <stop offset="100%" stop-color="#1d1d26"/>
    </linearGradient>
    <linearGradient id="grac" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#888"/>
      <stop offset="100%" stop-color="#bbb"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgp)"/>
  <g style="--team-color:#555; transform:translate(120px,120px) scale(1.05);">
    ${CAR_BODY}
  </g>
  <text x="400" y="470" font-family="Oswald, sans-serif" font-size="34" font-weight="700" fill="#666"
        text-anchor="middle">NUEVO PRODUCTO</text>
  <rect x="380" y="500" width="40" height="4" rx="2" fill="#e10600"/>
`))

console.log('All assets generated successfully!')