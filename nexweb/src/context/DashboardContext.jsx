import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DashboardContext = createContext(null)

export function DashboardProvider({ children }) {
  const [clients, setClients] = useState([])
  const [websites, setWebsites] = useState([])
  const [projects, setProjects] = useState([])
  const [requests, setRequests] = useState([])
  const [templates, setTemplates] = useState([])
  const [invoices, setInvoices] = useState([])
  const [conversations, setConversations] = useState([])
  const [settings, setSettings] = useState(null)
  const [projectLogs, setProjectLogs] = useState([])
  const [leads, setLeads] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [campaignLeads, setCampaignLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [activityLog, setActivityLog] = useState([])

  const addLog = useCallback((action, entity, label) => {
    const entry = { id: Date.now() + Math.random(), action, entity, label, timestamp: Date.now() }
    setActivityLog(prev => [entry, ...prev].slice(0, 100))
  }, [])

  async function loadAll() {
    setLoading(true)
    const queries = [
      { key: 'clients', action: supabase.from('clients').select('*').order('created_at', { ascending: false }) },
      { key: 'websites', action: supabase.from('websites').select('*').order('created_at', { ascending: false }) },
      { key: 'projects', action: supabase.from('projects').select('*').order('created_at', { ascending: false }) },
      { key: 'requests', action: supabase.from('requests').select('*').order('created_at', { ascending: false }) },
      { key: 'templates', action: supabase.from('templates').select('*').order('created_at', { ascending: false }) },
      { key: 'invoices', action: supabase.from('invoices').select('*').order('created_at', { ascending: false }) },
      { key: 'conversations', action: supabase.from('conversations').select('*').order('created_at', { ascending: true }) },
      { key: 'settings', action: supabase.from('settings').select('*').limit(1).maybeSingle() },
      { key: 'projectLogs', action: supabase.from('project_logs').select('*').order('created_at', { ascending: false }) },
      { key: 'leads', action: supabase.from('leads').select('*').order('created_at', { ascending: false }) },
      { key: 'campaigns', action: supabase.from('campaigns').select('*').order('created_at', { ascending: false }) },
      { key: 'campaignLeads', action: supabase.from('campaign_leads').select('*').order('created_at', { ascending: false }) },
    ]
    const setters = { clients: setClients, websites: setWebsites, projects: setProjects, requests: setRequests, templates: setTemplates, invoices: setInvoices, conversations: setConversations, settings: setSettings, projectLogs: setProjectLogs, leads: setLeads, campaigns: setCampaigns, campaignLeads: setCampaignLeads }

    for (const q of queries) {
      const { data, error } = await q.action
      if (error) console.error(`Error loading ${q.key}:`, error.message)
      if (q.key === 'settings') {
        setters[q.key](data)
      } else {
        setters[q.key](data || [])
      }
    }
    setLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  const stats = {
    totalWebs: websites.length,
    activeWebs: websites.filter(w => w.status === 'published').length,
    pendingProjects: projects.filter(p => p.status !== 'published').length,
    newRequests: requests.filter(r => r.status === 'new').length,
    revenue: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount || 0), 0),
    registeredClients: clients.length,
  }

  const addClient = useCallback(async (client) => {
    const { data, error } = await supabase.from('clients').insert(client).select().single()
    if (!error && data) { setClients(prev => [data, ...prev]); addLog('create', 'cliente', `Cliente "${data.name}" creado`) }
    return { data, error }
  }, [addLog])

  const updateClient = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('clients').update(updates).eq('id', id).select().single()
    if (!error && data) { setClients(prev => prev.map(c => c.id === id ? data : c)); addLog('update', 'cliente', `Cliente "${data.name}" actualizado`) }
    return { data, error }
  }, [addLog])

  const deleteClient = useCallback(async (id, name) => {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (!error) { setClients(prev => prev.filter(c => c.id !== id)); addLog('delete', 'cliente', `Cliente "${name || id}" eliminado`) }
    return { error }
  }, [addLog])

  const addWebsite = useCallback(async (website) => {
    const { data, error } = await supabase.from('websites').insert(website).select().single()
    if (!error && data) { setWebsites(prev => [data, ...prev]); addLog('create', 'web', `Web "${data.project}" creada`) }
    return { data, error }
  }, [addLog])

  const updateWebsite = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('websites').update(updates).eq('id', id).select().single()
    if (!error && data) { setWebsites(prev => prev.map(w => w.id === id ? data : w)); addLog('update', 'web', `Web "${data.project}" actualizada`) }
    return { data, error }
  }, [addLog])

  const deleteWebsite = useCallback(async (id, name) => {
    const { error } = await supabase.from('websites').delete().eq('id', id)
    if (!error) { setWebsites(prev => prev.filter(w => w.id !== id)); addLog('delete', 'web', `Web "${name || id}" eliminada`) }
    return { error }
  }, [addLog])

  const updateRequestStatus = useCallback(async (id, status) => {
    const { data, error } = await supabase.from('requests').update({ status }).eq('id', id).select().single()
    if (!error && data) { setRequests(prev => prev.map(r => r.id === id ? data : r)); addLog('update', 'solicitud', `Solicitud "${data.name}" → ${status}`) }
    return { data, error }
  }, [addLog])

  const addReply = useCallback(async (requestId, message, clientEmail, clientName) => {
    console.log('[DashboardContext] addReply llamado:', { requestId, message, clientEmail, clientName })
    const { data, error } = await supabase.rpc('add_admin_reply', {
      p_request_id: requestId,
      p_message: message,
      p_client_email: clientEmail,
      p_client_name: clientName,
    })
    if (error) {
      console.error('[DashboardContext] addReply error:', { message: error.message, details: error.details, hint: error.hint, code: error.code })
    } else {
      console.log('[DashboardContext] addReply éxito:', data)
      setConversations(prev => [...prev, data])
      addLog('reply', 'solicitud', `Respuesta enviada a "${clientName}"`)
    }
    return { data, error }
  }, [addLog])

  const updateSettings = useCallback(async (newSettings) => {
    const firstId = settings?.id
    if (!firstId) return
    const { data, error } = await supabase.from('settings').update(newSettings).eq('id', firstId).select().single()
    if (!error && data) { setSettings(data); addLog('update', 'configuración', 'Configuración actualizada') }
    return { data, error }
  }, [settings, addLog])

  const updateProject = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single()
    if (!error && data) { setProjects(prev => prev.map(p => p.id === id ? data : p)); addLog('update', 'proyecto', `Proyecto "${data.name}" actualizado`) }
    return { data, error }
  }, [addLog])

  const deleteProject = useCallback(async (id, name) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) { setProjects(prev => prev.filter(p => p.id !== id)); addLog('delete', 'proyecto', `Proyecto "${name || id}" eliminado`) }
    return { error }
  }, [addLog])

  const addProjectLog = useCallback(async (projectId, message) => {
    const { data, error } = await supabase.from('project_logs').insert({ project_id: projectId, message }).select().single()
    if (!error && data) { setProjectLogs(prev => [data, ...prev]); addLog('create', 'log', `Nota añadida al proyecto`) }
    return { data, error }
  }, [addLog])

  const deleteProjectLog = useCallback(async (id) => {
    const { error } = await supabase.from('project_logs').delete().eq('id', id)
    if (!error) setProjectLogs(prev => prev.filter(l => l.id !== id))
    return { error }
  }, [])

  const addLead = useCallback(async (lead) => {
    const { data, error } = await supabase.from('leads').insert(lead).select().single()
    if (!error && data) { setLeads(prev => [data, ...prev]); addLog('create', 'lead', `Lead "${data.business_name}" añadido`) }
    return { data, error }
  }, [addLog])

  const updateLead = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single()
    if (!error && data) { setLeads(prev => prev.map(l => l.id === id ? data : l)); addLog('update', 'lead', `Lead "${data.business_name}" actualizado`) }
    return { data, error }
  }, [addLog])

  const deleteLead = useCallback(async (id, name) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (!error) { setLeads(prev => prev.filter(l => l.id !== id)); addLog('delete', 'lead', `Lead "${name || id}" eliminado`) }
    return { error }
  }, [addLog])

  const addCampaign = useCallback(async (campaign) => {
    const { data, error } = await supabase.from('campaigns').insert(campaign).select().single()
    if (!error && data) { setCampaigns(prev => [data, ...prev]); addLog('create', 'campaña', `Campaña "${data.name}" creada`) }
    return { data, error }
  }, [addLog])

  const updateCampaign = useCallback(async (id, updates) => {
    const { data, error } = await supabase.from('campaigns').update(updates).eq('id', id).select().single()
    if (!error && data) { setCampaigns(prev => prev.map(c => c.id === id ? data : c)); addLog('update', 'campaña', `Campaña "${data.name}" actualizada`) }
    return { data, error }
  }, [addLog])

  const deleteCampaign = useCallback(async (id, name) => {
    const { error } = await supabase.from('campaigns').delete().eq('id', id)
    if (!error) { setCampaigns(prev => prev.filter(c => c.id !== id)); addLog('delete', 'campaña', `Campaña "${name || id}" eliminada`) }
    return { error }
  }, [addLog])

  const addLeadsToCampaign = useCallback(async (campaignId, leadIds) => {
    const inserts = leadIds.map(leadId => ({ campaign_id: campaignId, lead_id: leadId }))
    const { data, error } = await supabase.from('campaign_leads').insert(inserts).select()
    if (!error && data) { setCampaignLeads(prev => [...prev, ...data]); addLog('update', 'campaña', `${leadIds.length} leads añadidos a campaña`) }
    return { data, error }
  }, [addLog])

  const markCampaignSent = useCallback(async (campaignId, leadIds) => {
    const { data, error } = await supabase
      .from('campaign_leads')
      .update({ sent: true, sent_at: new Date().toISOString() })
      .in('lead_id', leadIds)
      .eq('campaign_id', campaignId)
      .select()
    if (!error && data) {
      setCampaignLeads(prev => prev.map(cl => data.find(d => d.id === cl.id) || cl))
      setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, sent_count: (c.sent_count || 0) + leadIds.length } : c))
    }
    return { data, error }
  }, [])

  return (
    <DashboardContext.Provider value={{
      data: { clients, websites, projects, requests, templates, invoices, conversations, settings, projectLogs, leads, campaigns, campaignLeads, stats },
      loading, activityLog, addLog,
      addClient, updateClient, deleteClient,
      addWebsite, updateWebsite, deleteWebsite,
      updateRequestStatus, addReply,
      updateSettings,
      updateProject, deleteProject, addProjectLog, deleteProjectLog,
      addLead, updateLead, deleteLead,
      addCampaign, updateCampaign, deleteCampaign,
      addLeadsToCampaign, markCampaignSent,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
