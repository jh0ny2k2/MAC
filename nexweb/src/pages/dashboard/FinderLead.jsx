import { useState } from 'react'
import {
  Search, MapPin, Tag, Globe, Phone, Star, Download,
  Plus, Save, Check, ExternalLink, Edit2, Trash2, Loader,
  Building2, Store, ArrowUpDown, Key, Eye, EyeOff, X, Mail,
} from 'lucide-react'
import ScrollReveal from '../../components/common/ScrollReveal'
import { useDashboard } from '../../context/DashboardContext'

const statusColors = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700' },
  contacted: { bg: 'bg-amber-100', text: 'text-amber-700' },
  qualified: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  converted: { bg: 'bg-violet-100', text: 'text-violet-700' },
  lost: { bg: 'bg-gray-100', text: 'text-gray-500' },
}

async function searchGooglePlaces(query, apiKey, pageToken) {
  const body = { textQuery: query, languageCode: 'es', pageSize: 20 }
  if (pageToken) body.pageToken = pageToken
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.websiteUri,places.types,places.rating,places.userRatingCount,nextPageToken',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Error HTTP ${res.status}`)
  }
  const data = await res.json()
  const mapped = (data.places || []).map(p => ({
    business_name: p.displayName?.text || '',
    address: p.formattedAddress || '',
    phone: p.internationalPhoneNumber || '',
    website: p.websiteUri || '',
    category: (p.types || [])
      .filter(t => !['establishment', 'point_of_interest', 'political', 'food', 'store', 'place_of_worship', 'premise', 'locality', 'neighborhood', 'administrative_area_level_3', 'administrative_area_level_2', 'administrative_area_level_1'].includes(t))
      .map(t => t.replace(/_/g, ' '))
      .map(t => t.charAt(0).toUpperCase() + t.slice(1))[0] || 'Negocio',
    rating: p.rating || 0,
    reviews_count: p.userRatingCount || 0,
    place_id: p.id || '',
  }))
  return { places: mapped, nextPageToken: data.nextPageToken || null }
}

export default function FinderLead() {
  const { data, addLead, updateLead, deleteLead } = useDashboard()
  const [tab, setTab] = useState('search')
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [results, setResults] = useState(null)
  const [nextPageToken, setNextPageToken] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [filterNoWebsite, setFilterNoWebsite] = useState(false)
  const [selectedResults, setSelectedResults] = useState(new Set())
  const [detailItem, setDetailItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [leadForm, setLeadForm] = useState({ business_name: '', phone: '', email: '', website: '', address: '', category: '', rating: 0, reviews_count: 0, notes: '', status: 'new' })
  const [leadSearch, setLeadSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [expandedLead, setExpandedLead] = useState(null)
  const envKey = import.meta.env.VITE_GOOGLE_API_KEY || ''
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('google_places_api_key') || envKey)
  const [showApiKey, setShowApiKey] = useState(false)
  const [savingKey, setSavingKey] = useState(false)

  const leads = data.leads || []
  const filteredLeads = leads.filter(l => {
    const matchSearch = !leadSearch || l.business_name?.toLowerCase().includes(leadSearch.toLowerCase()) || l.email?.toLowerCase().includes(leadSearch.toLowerCase()) || l.phone?.includes(leadSearch)
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  }).sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortField === 'rating') return (a.rating || 0) > (b.rating || 0) ? dir : -dir
    if (sortField === 'business_name') return a.business_name?.localeCompare(b.business_name) * dir
    return new Date(a.created_at) > new Date(b.created_at) ? dir : -dir
  })

  const displayedResults = results
    ? filterNoWebsite ? results.filter(r => !r.website) : results
    : null

  function saveApiKey() {
    localStorage.setItem('google_places_api_key', apiKey)
    setSavingKey(true)
    setTimeout(() => setSavingKey(false), 1500)
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!location.trim()) return
    if (!apiKey.trim()) return
    setSearching(true)
    setSearchError(null)
    setResults(null)
    setNextPageToken(null)
    setSelectedResults(new Set())
    try {
      const query = keyword.trim()
        ? `${keyword} en ${location}`
        : `negocios en ${location}`
      const { places, nextPageToken: token } = await searchGooglePlaces(query, apiKey.trim())
      setResults(places)
      setNextPageToken(token)
    } catch (err) {
      setSearchError(err.message)
    }
    setSearching(false)
  }

  async function loadMore() {
    if (!nextPageToken || loadingMore) return
    setLoadingMore(true)
    try {
      const query = keyword.trim()
        ? `${keyword} en ${location}`
        : `negocios en ${location}`
      const { places, nextPageToken: token } = await searchGooglePlaces(query, apiKey.trim(), nextPageToken)
      setResults(prev => [...(prev || []), ...places])
      setNextPageToken(token)
    } catch (err) {
      setSearchError(err.message)
    }
    setLoadingMore(false)
  }

  function toggleResult(item) {
    const key = item.place_id || item.business_name + item.address
    setSelectedResults(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function saveSelected() {
    if (selectedResults.size === 0) return
    setSaving(true)
    for (const item of results) {
      const key = item.place_id || item.business_name + item.address
      if (selectedResults.has(key)) {
        const exists = leads.some(l => l.business_name === item.business_name && l.address === item.address)
        if (!exists) {
          await addLead({
            business_name: item.business_name,
            phone: item.phone,
            email: '',
            website: item.website,
            address: item.address,
            category: item.category,
            rating: item.rating,
            reviews_count: item.reviews_count,
            source: 'scraping',
            keyword: keyword.trim(),
            location: location.trim(),
            notes: '',
            status: 'new',
          })
        }
      }
    }
    setSaving(false)
    setSelectedResults(new Set())
    setTab('leads')
  }

  function openCreateLead() {
    setEditingLead(null)
    setLeadForm({ business_name: '', phone: '', email: '', website: '', address: '', category: '', rating: 0, reviews_count: 0, notes: '', status: 'new' })
    setShowLeadModal(true)
  }

  function openEditLead(lead) {
    setEditingLead(lead)
    setLeadForm({ business_name: lead.business_name, phone: lead.phone, email: lead.email, website: lead.website, address: lead.address, category: lead.category, rating: lead.rating, reviews_count: lead.reviews_count, notes: lead.notes, status: lead.status })
    setShowLeadModal(true)
  }

  function handleSubmitLead(e) {
    e.preventDefault()
    if (editingLead) {
      updateLead(editingLead.id, leadForm)
    } else {
      addLead({ ...leadForm, source: 'manual' })
    }
    setShowLeadModal(false)
  }

  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.status === 'new').length
  const contactedLeads = leads.filter(l => l.status === 'contacted').length
  const convertedLeads = leads.filter(l => l.status === 'converted').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FinderLead</h1>
          <p className="text-gray-500 text-sm mt-1">Prospección comercial con Google Maps</p>
        </div>
        {tab === 'leads' && (
          <button onClick={openCreateLead} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> Nuevo lead
          </button>
        )}
      </div>

      {tab === 'leads' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
            <p className="text-xs text-gray-500">Total leads</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">{newLeads}</p>
            <p className="text-xs text-gray-500">Nuevos</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-amber-600">{contactedLeads}</p>
            <p className="text-xs text-gray-500">Contactados</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-violet-600">{convertedLeads}</p>
            <p className="text-xs text-gray-500">Convertidos</p>
          </div>
        </div>
      )}

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab('search')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'search' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Search className="w-4 h-4 inline mr-1.5" />Prospección
        </button>
        <button
          onClick={() => setTab('leads')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'leads' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Store className="w-4 h-4 inline mr-1.5" />Mis Leads ({totalLeads})
        </button>
      </div>

      {tab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Tu API Key de Google Places"
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                />
                <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={saveApiKey}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {savingKey ? '✓ Guardada' : 'Guardar'}
                </button>
              </div>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline shrink-0"
              >
                Obtener key
              </a>
              <a
                href="https://console.cloud.google.com/apis/library/places.googleapis.com"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:underline shrink-0"
              >
                + Activar Places API
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="¿Qué buscas? (opcional — ej: restaurante, clínica...)"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="¿Dónde? (ej: Madrid, Granada...)"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={searching || !location.trim() || !apiKey.trim()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center gap-2"
              >
                {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </form>
          </div>

          {searching && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Loader className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Consultando Google Places...</p>
            </div>
          )}

          {searchError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              <p className="font-medium">Error en la búsqueda</p>
              <p className="text-red-500 text-xs mt-1">{searchError}</p>
            </div>
          )}

          {results && !searching && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-500">
                    {displayedResults.length} resultados{filterNoWebsite ? ' sin web' : ''}
                    {selectedResults.size > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">({selectedResults.size} seleccionados)</span>
                    )}
                  </p>
                  <button
                    onClick={() => { setFilterNoWebsite(!filterNoWebsite); setSelectedResults(new Set()) }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filterNoWebsite
                        ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                        : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Globe className={`w-3.5 h-3.5 ${filterNoWebsite ? 'line-through' : ''}`} />
                    Solo sin web
                    {!filterNoWebsite && results.filter(r => !r.website).length > 0 && (
                      <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{results.filter(r => !r.website).length}</span>
                    )}
                  </button>
                </div>
                {selectedResults.size > 0 && (
                  <button
                    onClick={saveSelected}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Guardando...' : `Guardar ${selectedResults.size} leads`}
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedResults.map((item, i) => {
                  const key = item.place_id || item.business_name + item.address
                  const isSelected = selectedResults.has(key)
                  const exists = leads.some(l => l.business_name === item.business_name && l.address === item.address)
                  return (
                    <ScrollReveal key={key} delay={i * 0.03}>
                      <div
                        className={`bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer p-4 ${
                          isSelected ? 'border-blue-500' : exists ? 'border-emerald-200' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              onClick={() => toggleResult(item)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-pointer ${
                                isSelected ? 'bg-blue-500 text-white' : exists ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {isSelected ? <Check className="w-4 h-4" /> : exists ? <Check className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0 flex-1" onClick={() => setDetailItem(item)}>
                              <p className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">{item.business_name}</p>
                              <span className="text-xs text-gray-400">{item.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!item.website && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-semibold">Sin web</span>
                            )}
                            {item.rating > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-medium text-gray-700">{item.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1.5 mt-2" onClick={() => setDetailItem(item)}>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.address}</span>
                          </div>
                          {item.phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.phone}</span>
                            </div>
                          )}
                          {item.website ? (
                            <div className="flex items-center gap-2 text-xs text-blue-500">
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              <a href={item.website} target="_blank" rel="noreferrer" onClick={e => { e.stopPropagation(); }} className="truncate hover:underline">{item.website}</a>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-amber-600 font-medium">
                              <Globe className="w-3.5 h-3.5 shrink-0" />
                              <span>No tiene sitio web — oportunidad de venta</span>
                            </div>
                          )}
                        </div>
                        {exists && (
                          <div className="mt-2 pt-2 border-t border-emerald-100">
                            <span className="text-xs text-emerald-600 font-medium">✓ Ya guardado</span>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                {nextPageToken && (
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {loadingMore ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {loadingMore ? 'Cargando...' : `Cargar más resultados (${results.length} actuales)`}
                  </button>
                )}
                {selectedResults.size > 0 && (
                  <button
                    onClick={saveSelected}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors text-sm font-medium"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Guardando...' : `Guardar ${selectedResults.size} leads`}
                  </button>
                )}
              </div>
            </>
          )}

          {results !== null && !searching && displayedResults.length === 0 && !searchError && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Search className="w-12 h-12 text-gray-200" />
              <p className="text-sm">No se encontraron resultados en "{location}"{keyword ? ` para "${keyword}"` : ''}</p>
              <p className="text-xs text-gray-300">Prueba con otra ubicación o palabra clave</p>
            </div>
          )}

          {results === null && !searching && !searchError && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Search className="w-12 h-12 text-gray-200" />
              <p className="text-sm">Introduce una ubicación para empezar a prospectar</p>
            </div>
          )}
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Buscar leads..." value={leadSearch} onChange={e => setLeadSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {s === 'all' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (leads.length === 0) return
                const headers = 'Nombre,Teléfono,Email,Web,Dirección,Categoría,Valoración,Estado,Notas'
                const rows = filteredLeads.map(l =>
                  `"${l.business_name}","${l.phone}","${l.email}","${l.website}","${l.address}","${l.category}","${l.rating}","${l.status}","${l.notes}"`
                ).join('\n')
                const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = 'leads.csv'; a.click()
                URL.revokeObjectURL(url)
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50">
                    <th className="p-4 font-medium cursor-pointer hover:text-gray-700" onClick={() => { setSortField('business_name'); setSortDir(d => d === 'asc' ? 'desc' : 'asc') }}>
                      <div className="flex items-center gap-1">Nombre <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="p-4 font-medium">Contacto</th>
                    <th className="p-4 font-medium">Categoría</th>
                    <th className="p-4 font-medium cursor-pointer hover:text-gray-700" onClick={() => { setSortField('rating'); setSortDir(d => d === 'asc' ? 'desc' : 'asc') }}>
                      <div className="flex items-center gap-1">Valoración <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="p-4 font-medium">Estado</th>
                    <th className="p-4 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={6} className="p-12 text-center text-sm text-gray-400">
                      {leads.length === 0 ? 'No hay leads todavía. Usa la pestaña "Prospección" para encontrar nuevos leads.' : 'No se encontraron leads con esos filtros'}
                    </td></tr>
                  ) : filteredLeads.map((l) => {
                    const sc = statusColors[l.status] || statusColors.new
                    const isExpanded = expandedLead === l.id
                    return (
                      <tr key={l.id} className="group">
                        <td className="p-4" colSpan={6}>
                          <div>
                            <div
                              className="flex items-center justify-between cursor-pointer py-1"
                              onClick={() => setExpandedLead(isExpanded ? null : l.id)}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {l.business_name?.[0]}
                                </div>
                                <div className="min-w-0 flex-1 grid grid-cols-5 gap-4 items-center">
                                  <div className="col-span-1">
                                    <p className="font-medium text-gray-900 truncate">{l.business_name}</p>
                                  </div>
                                  <div className="col-span-1">
                                    <div className="space-y-0.5">
                                      {l.phone && <p className="text-gray-600 text-xs">{l.phone}</p>}
                                      {l.email && <p className="text-gray-400 text-xs truncate">{l.email}</p>}
                                    </div>
                                  </div>
                                  <div className="col-span-1">
                                    <span className="text-xs text-gray-500">{l.category || '-'}</span>
                                  </div>
                                  <div className="col-span-1">
                                    {l.rating > 0 ? (
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-medium text-gray-700">{l.rating}</span>
                                      </div>
                                    ) : <span className="text-xs text-gray-400">-</span>}
                                  </div>
                                  <div className="col-span-1 flex items-center justify-between">
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${sc.bg} ${sc.text}`}>{l.status}</span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                      {l.website && (
                                        <a href={l.website} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      <button onClick={() => openEditLead(l)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button onClick={() => { if (confirm('¿Eliminar este lead?')) deleteLead(l.id, l.business_name) }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {isExpanded && (
                              <div className="mt-3 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-4 px-4 pb-2">
                                <div className="grid sm:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Información</h4>
                                    <div className="space-y-1.5">
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Teléfono:</span> {l.phone || '-'}</p>
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Email:</span> {l.email || '-'}</p>
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Web:</span> {l.website || '-'}</p>
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Dirección:</span> {l.address || '-'}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prospección</h4>
                                    <div className="space-y-1.5">
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Categoría:</span> {l.category || '-'}</p>
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Valoración:</span> {l.rating > 0 ? `${l.rating} ⭐ (${l.reviews_count} reseñas)` : '-'}</p>
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Fuente:</span> {l.source === 'scraping' ? 'Scraping Google' : l.source === 'manual' ? 'Manual' : l.source}</p>
                                      <p className="text-sm text-gray-700"><span className="text-gray-400">Búsqueda:</span> {l.keyword ? `${l.keyword} en ${l.location}` : '-'}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {['new', 'contacted', 'qualified', 'converted', 'lost'].map(s => {
                                        const c = statusColors[s]
                                        return (
                                          <button
                                            key={s}
                                            onClick={() => updateLead(l.id, { status: s })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                              l.status === s ? `${c.bg} ${c.text} ring-2 ring-offset-1` : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                                            }`}
                                          >
                                            {s}
                                          </button>
                                        )
                                      })}
                                    </div>
                                    <div className="mt-3">
                                      <label className="block text-xs text-gray-400 mb-1">Notas</label>
                                      <textarea
                                        value={l.notes || ''}
                                        onChange={e => updateLead(l.id, { notes: e.target.value })}
                                        placeholder="Añadir notas..."
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setDetailItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold shrink-0">
                  {detailItem.business_name?.[0]}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{detailItem.business_name}</h2>
                  <p className="text-sm text-gray-500">{detailItem.category}</p>
                </div>
              </div>
              <button onClick={() => setDetailItem(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">Dirección</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{detailItem.address || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-xs">Teléfono</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{detailItem.phone || '-'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-xs">Email</span>
                  </div>
                  {detailItem.email ? (
                    <p className="text-sm font-medium text-gray-900 truncate">{detailItem.email}</p>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-gray-400">No disponible</span>
                      <button
                        onClick={() => {
                          const email = prompt('Introduce el email del negocio:')
                          if (email) {
                            setDetailItem({ ...detailItem, email })
                          }
                        }}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Añadir
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-xs">Valoración</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {detailItem.rating > 0 ? `${detailItem.rating} ⭐ (${detailItem.reviews_count} reseñas)` : '-'}
                  </p>
                </div>
              </div>

              {detailItem.website && (
                <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                  <a href={detailItem.website} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline truncate">{detailItem.website}</a>
                </div>
              )}
              {!detailItem.website && (
                <div className="p-3 bg-amber-50 rounded-xl flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-sm text-amber-700 font-medium">No tiene sitio web — oportunidad de venta</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    const exists = leads.some(l => l.business_name === detailItem.business_name && l.address === detailItem.address)
                    if (!exists) {
                      addLead({
                        business_name: detailItem.business_name,
                        phone: detailItem.phone,
                        email: detailItem.email || '',
                        website: detailItem.website,
                        address: detailItem.address,
                        category: detailItem.category,
                        rating: detailItem.rating,
                        reviews_count: detailItem.reviews_count,
                        source: 'scraping',
                        keyword: keyword.trim(),
                        location: location.trim(),
                        notes: '',
                        status: 'new',
                      })
                    }
                    setDetailItem(null)
                    setTab('leads')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                  {leads.some(l => l.business_name === detailItem.business_name && l.address === detailItem.address) ? (
                    <>✓ Ya guardado</>
                  ) : (
                    <><Save className="w-4 h-4" /> Guardar como lead</>
                  )}
                </button>
                <button onClick={() => setDetailItem(null)} className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowLeadModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editingLead ? 'Editar lead' : 'Nuevo lead'}</h2>
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
                <input required value={leadForm.business_name} onChange={e => setLeadForm({ ...leadForm, business_name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
                <input value={leadForm.website} onChange={e => setLeadForm({ ...leadForm, website: e.target.value })} placeholder="https://" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input value={leadForm.address} onChange={e => setLeadForm({ ...leadForm, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <input value={leadForm.category} onChange={e => setLeadForm({ ...leadForm, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select value={leadForm.status} onChange={e => setLeadForm({ ...leadForm, status: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="new">Nuevo</option>
                    <option value="contacted">Contactado</option>
                    <option value="qualified">Calificado</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea value={leadForm.notes} onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" rows={2} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowLeadModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">{editingLead ? 'Guardar cambios' : 'Crear lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
