import { useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, Heart, Sparkles, Share2, Check,
  Palette, Calendar, MapPin, Music, MessageCircle, ChevronDown,
  Plus, GripVertical,
} from 'lucide-react'
import SEO from '../components/SEO'
import WeddingPreview from '../components/invitaciones/WeddingPreview'
import { SECTION_MAP, DEFAULT_SECTIONS } from '../components/invitaciones/sections'

const STYLE_OPTIONS = [
  { id: 'clasico-eterno', name: 'Clásico', primary: '#7A1A2E', secondary: '#C4956A' },
  { id: 'rustico-encanto', name: 'Rústico', primary: '#5C3D2E', secondary: '#8BA888' },
  { id: 'moderno-minimal', name: 'Moderno', primary: '#1A1A2E', secondary: '#B0B0C0' },
  { id: 'gold-luxury', name: 'Lujo', primary: '#0A0A0A', secondary: '#D4AF37' },
  { id: 'romance-vintage', name: 'Vintage', primary: '#8B4A5E', secondary: '#D4A5B5' },
]

export default function InvitacionesCrear() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialDesign = searchParams.get('design') || 'clasico-eterno'

  const [data, setData] = useState({
    novia: '',
    novio: '',
    fecha: '',
    heroImg: '',
    heroStyle: 'classic',
    fecha_limite: '',
    hora_ceremonia: '',
    lugar_ceremonia: '',
    hora_recepcion: '',
    lugar_recepcion: '',
    historia: '',
    storyStyle: 'classic',
    eventsStyle: 'classic',
    galleryStyle: 'classic',
    scheduleStyle: 'classic',
    rsvpStyle: 'classic',
    dresscodeStyle: 'classic',
    registryStyle: 'classic',
    musicStyle: 'classic',
    locationStyle: 'classic',
    accommodationStyle: 'classic',
    weddingPartyStyle: 'classic',
    guestMessagesStyle: 'classic',
    faqStyle: 'classic',
    thankYouStyle: 'classic',
    dress_code: '',
    registry: '',
    musica: 'Perfect — Ed Sheeran',
    hashtag: '',
    timeline: [{ date: 'Enero 2020', title: 'Primer Encuentro', desc: 'Nos conocimos en casa de amigos.', img: '' }],
    timelineStyle: 'classic',
    schedule: [{ time: '16:00', title: 'Ceremonia', desc: 'Iglesia San Miguel' }],
    hotels: [{ name: 'Hotel Boutique', address: 'Calle Principal 123', discount: '10% descuento' }],
    weddingParty: [{ name: 'María & Juan', role: 'Padrinos de Velación' }],
    faqs: [{ q: '¿Puedo llevar acompañante?', a: 'Sí, indícalo al confirmar.' }],
    galleryUrls: [],
  })
  const [selectedStyle, setSelectedStyle] = useState(initialDesign)
  const [sections, setSections] = useState([...DEFAULT_SECTIONS])
  const [editingSection, setEditingSection] = useState(null)
  const [showCopied, setShowCopied] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const update = (key, value) => setData((prev) => ({ ...prev, [key]: value }))

  const updateArrayItem = (key, index, field, value) => {
    setData((prev) => {
      const arr = [...(prev[key] || [])]
      if (!arr[index]) return prev
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, [key]: arr }
    })
  }

  const addArrayItem = (key, template) => {
    setData((prev) => ({ ...prev, [key]: [...(prev[key] || []), { ...template }] }))
  }

  const removeArrayItem = (key, index) => {
    setData((prev) => {
      const arr = [...(prev[key] || [])]
      arr.splice(index, 1)
      return { ...prev, [key]: arr }
    })
  }

  const toggleSection = (id) => {
    setSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const dragItem = useRef(null)
  const dragOverItem = useRef(null)

  const handleDragStart = (id) => {
    dragItem.current = id
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    dragOverItem.current = id
  }

  const handleDrop = () => {
    const fromId = dragItem.current
    const toId = dragOverItem.current
    if (!fromId || !toId || fromId === toId) return
    setSections((prev) => {
      const next = [...prev]
      const fromIdx = next.indexOf(fromId)
      const toIdx = next.indexOf(toId)
      if (fromIdx === -1 || toIdx === -1) return prev
      const [removed] = next.splice(fromIdx, 1)
      next.splice(toIdx, 0, removed)
      return next
    })
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleShare = async () => {
    const text = `🌟 ${data.novia || 'Ana'} & ${data.novio || 'Carlos'} se casan\n📅 ${data.fecha || '15 Junio 2026'}\n📍 ${data.lugar_ceremonia || 'Por confirmar'}\n✨ Creado con Eterno`
    if (navigator.share) {
      await navigator.share({ title: 'Invitación de Boda', text })
    } else {
      await navigator.clipboard.writeText(text)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2"

  return (
    <>
      <SEO
        title="Creador de Invitaciones de Boda Online | Eterno"
        description="Crea tu invitación de boda online personalizada. Elige diseño, colores, música y compártela al instante. Personalización total en minutos."
        keywords="crear invitacion boda online, creador invitaciones boda, hacer invitacion boda, personalizar invitacion boda, invitacion boda digital"
        url="/invitaciones/crear"
        type="website"
      />
      <div className="min-h-screen bg-[#FBF6F0]">
      <div className="bg-white/80 backdrop-blur border-b border-[#DFC5A8]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/invitaciones')}
                className="w-9 h-9 rounded-full bg-[#7A1A2E]/5 flex items-center justify-center hover:bg-[#7A1A2E]/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#7A1A2E]" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-[#2C1810]">Creador</h1>
                <p className="text-[10px] text-[#8C7C7A]">Invitación web personalizada</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ backgroundColor: '#7A1A2E/5', color: '#7A1A2E' }}
              >
                {showCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {showCopied ? 'Copiado' : 'Compartir'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="space-y-5">

              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/20">
                <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-[#7A1A2E]">
                  <Heart className="w-4 h-4" />
                  Los novios
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Nombre de ella" value={data.novia} onChange={(v) => update('novia', v)} placeholder="Ana" />
                  <Input label="Nombre de él" value={data.novio} onChange={(v) => update('novio', v)} placeholder="Carlos" />
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/20">
                <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-[#7A1A2E]">
                  <Calendar className="w-4 h-4" />
                  Fecha y lugares
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Fecha de la boda" value={data.fecha} onChange={(v) => update('fecha', v)} placeholder="15 de Junio de 2026" />
                  <Input label="Fecha límite confirmación" value={data.fecha_limite} onChange={(v) => update('fecha_limite', v)} placeholder="1 de Junio de 2026" />
                  <Input label="Hora ceremonia" value={data.hora_ceremonia} onChange={(v) => update('hora_ceremonia', v)} placeholder="17:00 h" />
                  <Input label="Lugar ceremonia" value={data.lugar_ceremonia} onChange={(v) => update('lugar_ceremonia', v)} placeholder="Iglesia San Miguel" />
                  <Input label="Hora recepción" value={data.hora_recepcion} onChange={(v) => update('hora_recepcion', v)} placeholder="19:30 h" />
                  <Input label="Lugar recepción" value={data.lugar_recepcion} onChange={(v) => update('lugar_recepcion', v)} placeholder="Hacienda Los Olivos" />
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/20">
                <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-[#7A1A2E]">
                  <MessageCircle className="w-4 h-4" />
                  Historia y detalles
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-[#8C7C7A]">Historia de amor</label>
                    <textarea
                      value={data.historia}
                      onChange={(e) => update('historia', e.target.value)}
                      placeholder="Cuéntanos cómo se conocieron..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                      style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810' }}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Código de vestimenta" value={data.dress_code} onChange={(v) => update('dress_code', v)} placeholder="Formal: traje y corbata" />
                    <Input label="Mesa de regalos" value={data.registry} onChange={(v) => update('registry', v)} placeholder="El Corte Inglés #1234" />
                    <Input label="Hashtag" value={data.hashtag} onChange={(v) => update('hashtag', v)} placeholder="Ana&Carlos2026" />
                    <div>
                      <label className="block text-xs font-medium mb-1.5 text-[#8C7C7A] flex items-center gap-1.5">
                        <Music className="w-3 h-3" />
                        Canción
                      </label>
                      <select
                        value={data.musica}
                        onChange={(e) => update('musica', e.target.value)}
                        className={inputClass}
                        style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810' }}
                      >
                        <option>Perfect — Ed Sheeran</option>
                        <option>A Thousand Years — Christina Perri</option>
                        <option>All of Me — John Legend</option>
                        <option>Canon in D — Pachelbel</option>
                        <option>Marry You — Bruno Mars</option>
                        <option>Thinking Out Loud — Ed Sheeran</option>
                        <option>Here Comes the Sun — Beatles</option>
                        <option>Ninguna</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/20">
                <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-[#7A1A2E]">
                  <Palette className="w-4 h-4" />
                  Estilo visual
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {STYLE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className="p-2 rounded-xl transition-all duration-300 text-center"
                      style={{
                        backgroundColor: selectedStyle === s.id ? s.primary + '15' : 'transparent',
                        border: selectedStyle === s.id ? `2px solid ${s.primary}` : '2px solid transparent',
                      }}
                    >
                      <div
                        className="w-full aspect-[3/4] rounded-lg overflow-hidden flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${s.primary}, ${s.secondary}88)`,
                        }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white/60" />
                      </div>
                      <p className="text-[8px] text-center mt-1.5 font-medium truncate" style={{ color: selectedStyle === s.id ? s.primary : '#8C7C7A' }}>
                        {s.name}
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DFC5A8]/20">
                <h3 className="text-sm font-bold mb-5 flex items-center gap-2 text-[#7A1A2E]">
                  <Plus className="w-4 h-4" />
                  Secciones de la página
                </h3>
                <p className="text-[10px] text-[#8C7C7A] mb-4">Activa, ordena y edita el contenido de cada sección</p>
                <div className="space-y-1">
                  {sections.map((id) => {
                    const sec = SECTION_MAP[id]
                    if (!sec) return null
                    const expanded = editingSection === id
                    const Icon = sec.icon
                    return (
                      <div key={id}>
                        <div
                          draggable
                          onDragStart={() => handleDragStart(id)}
                          onDragOver={(e) => handleDragOver(e, id)}
                          onDrop={handleDrop}
                          onDragEnd={() => { dragItem.current = null; dragOverItem.current = null }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer hover:bg-[#7A1A2E]/5"
                          style={{ backgroundColor: '#7A1A2E08' }}
                          onClick={() => setEditingSection(expanded ? null : id)}
                        >
                          <div
                            className="cursor-grab active:cursor-grabbing opacity-40 hover:opacity-70 transition-opacity"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <GripVertical className="w-3.5 h-3.5 text-[#8C7C7A]" />
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSection(id) }}
                            className="flex items-center gap-2"
                          >
                            <div
                              className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                              style={{ backgroundColor: '#7A1A2E' }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          </button>

                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingSection(expanded ? null : id) }}
                            className="flex items-center gap-2 flex-1 text-left"
                          >
                            <Icon className="w-3.5 h-3.5 text-[#7A1A2E]" />
                            <span className="text-xs font-medium text-[#2C1810]">{sec.name}</span>
                          </button>

                          <span className="text-[9px] text-[#8C7C7A]">#{sections.indexOf(id) + 1}</span>

                          <ChevronDown
                            className="w-3 h-3 text-[#8C7C7A] transition-transform"
                            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </div>

                        {expanded && (
                          <div className="px-3 pb-3 pt-2 space-y-3">
                            <SectionEditFields
                              sectionId={id}
                              data={data}
                              update={update}
                              updateArrayItem={updateArrayItem}
                              addArrayItem={addArrayItem}
                              removeArrayItem={removeArrayItem}
                              inputClass={inputClass}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-[#DFC5A8]/20">
                  <p className="text-[10px] text-[#8C7C7A] mb-2">Secciones desactivadas (arrastra para activar)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(SECTION_MAP).map(([id, sec]) => {
                      if (sections.includes(id)) return null
                      const Icon = sec.icon
                      return (
                        <button
                          key={id}
                          onClick={() => toggleSection(id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all border border-dashed hover:border-[#7A1A2E]/30 hover:bg-[#7A1A2E]/5"
                          style={{ borderColor: '#DFC5A8', color: '#8C7C7A' }}
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <Icon className="w-3 h-3" />
                          {sec.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </section>

              <div className="text-center pt-2 pb-4">
                <a href="/invitaciones/disenos" className="inline-flex items-center gap-1 text-xs font-medium text-[#C4956A] hover:text-[#B8864E] transition-colors">
                  Ver todos los diseños
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="hidden lg:block text-center mb-6">
                <h2 className="text-sm font-bold text-[#2C1810]">Vista previa</h2>
                <p className="text-[10px] text-[#8C7C7A]">Así se verá la invitación web</p>
              </div>

              <button
                className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-[#DFC5A8]/20 shadow-sm mb-4"
                onClick={() => setShowMobilePreview(!showMobilePreview)}
              >
                <span className="text-sm font-medium text-[#2C1810]">
                  {showMobilePreview ? 'Ocultar' : 'Ver'} vista previa
                </span>
                <ChevronDown className={`w-4 h-4 text-[#8C7C7A] transition-transform ${showMobilePreview ? 'rotate-180' : ''}`} />
              </button>

              <div className={`${showMobilePreview ? 'block' : 'hidden'} lg:block`}>
                <WeddingPreview data={data} selectedStyle={selectedStyle} sections={sections} />

                <div className="mt-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C7C7A]">
                    <Sparkles className="w-3 h-3" />
                    Actualización en vivo
                  </div>

                  <button
                    onClick={() => navigate('/invitaciones/publicar')}
                    className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#7A1A2E', color: '#fff' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Subir a web · 10€
                  </button>
                  <p className="text-[9px] text-[#8C7C7A] leading-relaxed px-2">
                    Publica tu invitación con un dominio único. Pago único, sin suscripciones.
                  </p>

                  <div className="pt-2 border-t border-[#DFC5A8]/20">
                    <div className="bg-gradient-to-br from-[#7A1A2E] to-[#5C1020] rounded-2xl p-6 text-center mt-2">
                      <p className="text-lg font-display font-bold text-white mb-2">
                        ¿Quieres algo más personalizado?
                      </p>
                      <p className="text-[11px] text-white/70 mb-4 max-w-xs mx-auto leading-relaxed">
                        Diseño exclusivo, animaciones a medida, dominio personalizado, fotografías reales, video invitación y mucho más.
                      </p>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 hover:shadow-xl hover:-translate-y-0.5"
                        style={{ backgroundColor: '#C4956A', color: '#fff' }}
                      >
                        Solicitar presupuesto
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </a>
                      <p className="text-[8px] text-white/40 mt-3">Respuesta en menos de 24 horas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

function Input({ label, value, onChange, placeholder, isTextarea }) {
  if (isTextarea) {
    return (
      <div>
        <label className="block text-xs font-medium mb-1.5 text-[#8C7C7A]">{label}</label>
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} rows={2}
          className="w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 resize-none"
          style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810' }}
        />
      </div>
    )
  }
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5 text-[#8C7C7A]">{label}</label>
      <input
        type="text" value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2"
        style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810' }}
      />
    </div>
  )
}

function ArrayEditor({ items, keyLabel, keyField, fields, onUpdate, onAdd, onRemove, inputClass }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="p-2 rounded-lg" style={{ backgroundColor: '#F3EDE5' }}>
          <div className="grid grid-cols-1 gap-1.5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-[9px] font-medium mb-0.5 text-[#8C7C7A] uppercase tracking-wider">{f.label}</label>
                {f.isTextarea ? (
                  <textarea
                    value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)}
                    rows={1} placeholder={f.placeholder}
                    className={inputClass} style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810', fontSize: '11px' }}
                  />
                ) : (
                  <input
                    type="text" value={item[f.key] || ''} onChange={(e) => onUpdate(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={inputClass} style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810', fontSize: '11px' }}
                  />
                )}
              </div>
            ))}
          </div>
          {items.length > 1 && (
            <button onClick={() => onRemove(i)} className="mt-1 text-[9px] font-medium text-red-400 hover:text-red-500" children="Eliminar" />
          )}
        </div>
      ))}
      <button
        onClick={() => onAdd(Object.fromEntries(fields.map((f) => [f.key, ''])))} className="text-[10px] font-medium transition-colors"
        style={{ color: '#7A1A2E' }}
      >
        + Agregar {keyLabel}
      </button>
    </div>
  )
}

function SectionEditFields({ sectionId, data, update, updateArrayItem, addArrayItem, removeArrayItem, inputClass }) {

  const StyleSelector = ({ field, options }) => (
    <div>
      <p className="text-[9px] font-medium mb-2 text-[#8C7C7A] uppercase tracking-wider">Diseño</p>
      <div className="grid grid-cols-4 gap-1.5">
        {options.map((opt) => (
          <button key={opt.id} onClick={() => update(field, opt.id)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
            style={{ backgroundColor: (data[field] || 'classic') === opt.id ? '#7A1A2E' : '#F3EDE5', color: (data[field] || 'classic') === opt.id ? '#fff' : '#8C7C7A' }}
          >
            <svg width="16" height="12" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={opt.icon} /></svg>
            <span className="text-[8px] font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  switch (sectionId) {
    case 'hero': return (
      <div className="space-y-3">
        <StyleSelector field="heroStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M3 3h18v18H3z' },
          { id: 'photo', label: 'Foto', icon: 'M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z' },
          { id: 'elegant', label: 'Elegante', icon: 'M4 6h16M4 12h16M4 18h8' },
          { id: 'bold', label: 'Audaz', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
        ]} />
        <Input label="URL de foto de portada (opcional)" value={data.heroImg} onChange={(v) => update('heroImg', v)} placeholder="https://..." />
        <Input label="Mensaje de bienvenida (opcional)" value={''} onChange={() => {}} placeholder="Save the Date" isTextarea />
      </div>
    )

    case 'story': return (
      <div className="space-y-3">
        <StyleSelector field="storyStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
          { id: 'letter', label: 'Carta', icon: 'M4 4h16v16H4z' },
          { id: 'highlight', label: 'Destacado', icon: 'M6 4h12M6 8h12M6 12h8' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h16M4 18h8' },
        ]} />
        <Input label="Historia de amor" value={data.historia} onChange={(v) => update('historia', v)} placeholder="Cuéntanos cómo se conocieron..." isTextarea />
      </div>
    )

    case 'timeline': return (
      <div className="space-y-3">
        <StyleSelector field="timelineStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M4 12h16' },
          { id: 'cards', label: 'Tarjetas', icon: 'M4 4h16v16H4z' },
          { id: 'zigzag', label: 'Zigzag', icon: 'M4 4l16 8-16 8' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h16M4 18h16' },
        ]} />
        <div>
          <p className="text-[9px] font-medium mb-2 text-[#8C7C7A] uppercase tracking-wider">Eventos importantes</p>
          <ArrayEditor items={data.timeline || []} keyLabel="evento" keyField="timeline"
            fields={[
              { key: 'date', label: 'Fecha', placeholder: 'Enero 2020' },
              { key: 'title', label: 'Título', placeholder: 'Primer Encuentro' },
              { key: 'desc', label: 'Descripción', placeholder: '¿Qué pasó?', isTextarea: true },
              { key: 'img', label: 'URL de foto (opcional)', placeholder: 'https://...' },
            ]}
            onUpdate={(i, f, v) => updateArrayItem('timeline', i, f, v)}
            onAdd={() => addArrayItem('timeline', { date: '', title: '', desc: '', img: '' })}
            onRemove={(i) => removeArrayItem('timeline', i)} inputClass={inputClass}
          />
        </div>
      </div>
    )

    case 'events': return (
      <div className="space-y-3">
        <StyleSelector field="eventsStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M4 4h16v16H4z' },
          { id: 'cards', label: 'Tarjetas', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
          { id: 'timeline', label: 'Timeline', icon: 'M12 2v20M4 12h16' },
          { id: 'modern', label: 'Moderno', icon: 'M4 6l16-2v12L4 18V6z' },
        ]} />
        <div className="text-[9px] font-medium text-[#8C7C7A] uppercase tracking-wider">Ceremonia</div>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Hora" value={data.hora_ceremonia} onChange={(v) => update('hora_ceremonia', v)} placeholder="17:00 h" />
          <Input label="Lugar" value={data.lugar_ceremonia} onChange={(v) => update('lugar_ceremonia', v)} placeholder="Iglesia San Miguel" />
        </div>
        <div className="text-[9px] font-medium text-[#8C7C7A] uppercase tracking-wider pt-1">Recepción</div>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Hora" value={data.hora_recepcion} onChange={(v) => update('hora_recepcion', v)} placeholder="19:30 h" />
          <Input label="Lugar" value={data.lugar_recepcion} onChange={(v) => update('lugar_recepcion', v)} placeholder="Hacienda Los Olivos" />
        </div>
      </div>
    )

    case 'gallery': return (
      <div className="space-y-3">
        <StyleSelector field="galleryStyle" options={[
          { id: 'classic', label: 'Cuadrícula', icon: 'M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM15 15h5v5h-5z' },
          { id: 'masonry', label: 'Mosaico', icon: 'M4 4h5v8H4zM15 4h5v12h-5zM4 16h5v4H4zM15 20h5v-8h-5z' },
          { id: 'polaroid', label: 'Polaroid', icon: 'M4 4h16v14H4z' },
          { id: 'strip', label: 'Tira', icon: 'M4 8h16M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8' },
        ]} />
        <Input label="URLs de fotos (separadas por coma)" value={data.galleryUrls?.join(', ')} onChange={(v) => update('galleryUrls', v.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="https://..." isTextarea />
      </div>
    )

    case 'schedule': return (
      <div className="space-y-3">
        <StyleSelector field="scheduleStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M12 2v20M4 12h16' },
          { id: 'cards', label: 'Tarjetas', icon: 'M4 4h16v16H4z' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h16M4 18h8' },
          { id: 'circles', label: 'Círculos', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
        ]} />
        <p className="text-[9px] font-medium mb-2 text-[#8C7C7A] uppercase tracking-wider">Horarios del día</p>
        <ArrayEditor items={data.schedule || []} keyLabel="horario" keyField="schedule"
          fields={[
            { key: 'time', label: 'Hora', placeholder: '16:00' },
            { key: 'title', label: 'Actividad', placeholder: 'Ceremonia' },
            { key: 'desc', label: 'Detalle', placeholder: 'Iglesia San Miguel', isTextarea: true },
          ]}
          onUpdate={(i, f, v) => updateArrayItem('schedule', i, f, v)}
          onAdd={() => addArrayItem('schedule', { time: '', title: '', desc: '' })}
          onRemove={(i) => removeArrayItem('schedule', i)} inputClass={inputClass}
        />
      </div>
    )

    case 'rsvp': return (
      <div className="space-y-3">
        <StyleSelector field="rsvpStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M4 4h16v16H4z' },
          { id: 'card', label: 'Tarjeta', icon: 'M4 6h16v12H4z' },
          { id: 'banner', label: 'Banner', icon: 'M4 8h16M4 12h16M4 16h16' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <Input label="Fecha límite de confirmación" value={data.fecha_limite} onChange={(v) => update('fecha_limite', v)} placeholder="1 de Junio de 2026" />
      </div>
    )

    case 'dresscode': return (
      <div className="space-y-3">
        <StyleSelector field="dresscodeStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M4 4h5v5H4zM15 4h5v5h-5z' },
          { id: 'icons', label: 'Iconos', icon: 'M6 4h12v4H6zM8 12h8v8H8z' },
          { id: 'palette', label: 'Paleta', icon: 'M4 4h16v4H4zM4 12h16v4H4z' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <Input label="Código de vestimenta" value={data.dress_code} onChange={(v) => update('dress_code', v)} placeholder="Formal: traje y corbata" isTextarea />
      </div>
    )

    case 'registry': return (
      <div className="space-y-3">
        <StyleSelector field="registryStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
          { id: 'card', label: 'Tarjeta', icon: 'M4 4h16v16H4z' },
          { id: 'highlight', label: 'Destacado', icon: 'M6 4h12M6 8h12M6 12h8' },
          { id: 'detail', label: 'Detalle', icon: 'M4 6h16M4 10h16M4 14h8' },
        ]} />
        <Input label="Mesa de regalos" value={data.registry} onChange={(v) => update('registry', v)} placeholder="El Corte Inglés #1234" isTextarea />
      </div>
    )

    case 'music': return (
      <div className="space-y-3">
        <StyleSelector field="musicStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M9 18V5l12-2v13' },
          { id: 'vinyl', label: 'Disco', icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
          { id: 'notes', label: 'Notas', icon: 'M9 18V5l12-2v13M9 18a2 2 0 11-4 0 2 2 0 014 0z' },
        ]} />
        <label className="block text-xs font-medium mb-1.5 text-[#8C7C7A] flex items-center gap-1.5">
          <Music className="w-3 h-3" /> Canción
        </label>
        <select value={data.musica} onChange={(e) => update('musica', e.target.value)} className={inputClass} style={{ borderColor: '#DFC5A8', backgroundColor: '#FBF6F0', color: '#2C1810' }}>
          <option>Perfect — Ed Sheeran</option>
          <option>A Thousand Years — Christina Perri</option>
          <option>All of Me — John Legend</option>
          <option>Canon in D — Pachelbel</option>
          <option>Marry You — Bruno Mars</option>
          <option>Thinking Out Loud — Ed Sheeran</option>
          <option>Here Comes the Sun — Beatles</option>
          <option>Ninguna</option>
        </select>
      </div>
    )

    case 'location': return (
      <div className="space-y-3">
        <StyleSelector field="locationStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M12 2a8 8 0 00-8 8c0 6 8 14 8 14s8-8 8-14a8 8 0 00-8-8z' },
          { id: 'cards', label: 'Tarjetas', icon: 'M4 4h7v7H4zM13 4h7v7h-7z' },
          { id: 'map', label: 'Mapa', icon: 'M4 4h16v16H4zM4 12h16M12 4v16' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <Input label="Lugar de ceremonia" value={data.lugar_ceremonia} onChange={(v) => update('lugar_ceremonia', v)} placeholder="Iglesia San Miguel" />
        <Input label="Lugar de recepción" value={data.lugar_recepcion} onChange={(v) => update('lugar_recepcion', v)} placeholder="Hacienda Los Olivos" />
      </div>
    )

    case 'accommodation': return (
      <div className="space-y-3">
        <StyleSelector field="accommodationStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M4 4h16v16H4z' },
          { id: 'list', label: 'Lista', icon: 'M4 6h16M4 12h16M4 18h16' },
          { id: 'featured', label: 'Destacado', icon: 'M4 4h16v10H4zM4 18h16' },
          { id: 'icons', label: 'Íconos', icon: 'M4 6h4v4H4zM10 6h10v4H10zM4 14h4v4H4zM10 14h10v4H10z' },
        ]} />
        <p className="text-[9px] font-medium mb-2 text-[#8C7C7A] uppercase tracking-wider">Hoteles recomendados</p>
        <ArrayEditor items={data.hotels || []} keyLabel="hotel" keyField="hotels"
          fields={[
            { key: 'name', label: 'Nombre', placeholder: 'Hotel Boutique' },
            { key: 'address', label: 'Dirección', placeholder: 'Calle Principal 123' },
            { key: 'discount', label: 'Descuento', placeholder: '10% descuento' },
          ]}
          onUpdate={(i, f, v) => updateArrayItem('hotels', i, f, v)}
          onAdd={() => addArrayItem('hotels', { name: '', address: '', discount: '' })}
          onRemove={(i) => removeArrayItem('hotels', i)} inputClass={inputClass}
        />
      </div>
    )

    case 'weddingParty': return (
      <div className="space-y-3">
        <StyleSelector field="weddingPartyStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M12 2l-2 4h4l-2-4zM12 8v6' },
          { id: 'grid', label: 'Grid', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
          { id: 'circles', label: 'Círculos', icon: 'M12 2a5 5 0 100 10 5 5 0 000-10zM6 22a6 6 0 0112 0' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <p className="text-[9px] font-medium mb-2 text-[#8C7C7A] uppercase tracking-wider">Miembros del cortejo</p>
        <ArrayEditor items={data.weddingParty || []} keyLabel="miembro" keyField="weddingParty"
          fields={[
            { key: 'name', label: 'Nombre(s)', placeholder: 'María & Juan' },
            { key: 'role', label: 'Rol', placeholder: 'Padrinos de Velación' },
          ]}
          onUpdate={(i, f, v) => updateArrayItem('weddingParty', i, f, v)}
          onAdd={() => addArrayItem('weddingParty', { name: '', role: '' })}
          onRemove={(i) => removeArrayItem('weddingParty', i)} inputClass={inputClass}
        />
      </div>
    )

    case 'guestMessages': return (
      <div className="space-y-3">
        <StyleSelector field="guestMessagesStyle" options={[
          { id: 'classic', label: 'Burbujas', icon: 'M4 4h16v12H8l-4 4V4z' },
          { id: 'wall', label: 'Muro', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z' },
          { id: 'highlight', label: 'Destacado', icon: 'M4 4h16v8H4zM4 16h12' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <p className="text-xs text-[#8C7C7A] italic">Los invitados escribirán mensajes directamente en la página.</p>
      </div>
    )

    case 'faq': return (
      <div className="space-y-3">
        <StyleSelector field="faqStyle" options={[
          { id: 'accordion', label: 'Acordeón', icon: 'M4 6h16M4 12h16M4 18h16' },
          { id: 'list', label: 'Lista', icon: 'M4 4h16v4H4zM4 12h16v4H4z' },
          { id: 'grid', label: 'Grid', icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <p className="text-[9px] font-medium mb-2 text-[#8C7C7A] uppercase tracking-wider">Preguntas frecuentes</p>
        <ArrayEditor items={data.faqs || []} keyLabel="pregunta" keyField="faqs"
          fields={[
            { key: 'q', label: 'Pregunta', placeholder: '¿Puedo llevar acompañante?', isTextarea: true },
            { key: 'a', label: 'Respuesta', placeholder: 'Sí, indícalo al confirmar.', isTextarea: true },
          ]}
          onUpdate={(i, f, v) => updateArrayItem('faqs', i, f, v)}
          onAdd={() => addArrayItem('faqs', { q: '', a: '' })}
          onRemove={(i) => removeArrayItem('faqs', i)} inputClass={inputClass}
        />
      </div>
    )

    case 'thankYou': return (
      <div className="space-y-3">
        <StyleSelector field="thankYouStyle" options={[
          { id: 'classic', label: 'Clásico', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
          { id: 'letter', label: 'Carta', icon: 'M4 4h16v16H4z' },
          { id: 'photo', label: 'Foto', icon: 'M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z' },
          { id: 'minimal', label: 'Minimal', icon: 'M4 6h16M4 12h8' },
        ]} />
        <Input label="Hashtag" value={data.hashtag} onChange={(v) => update('hashtag', v)} placeholder="Ana&Carlos2026" />
      </div>
    )

    default: return null
  }
}
