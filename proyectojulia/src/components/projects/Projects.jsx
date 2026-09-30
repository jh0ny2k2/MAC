import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROJECT_ICONS = {
  tools: '🔧',
  settings: '⚙️',
  chart: '📊',
  rocket: '🚀',
  code: '💻',
  design: '🎨',
  camera: '📷',
  mail: '✉️',
}

const PROJECT_COLORS = {
  teal: { bg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', accent: 'from-teal-500 to-teal-600' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', accent: 'from-rose-500 to-rose-600' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', accent: 'from-indigo-500 to-indigo-600' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', accent: 'from-orange-500 to-orange-600' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', accent: 'from-purple-500 to-purple-600' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', accent: 'from-blue-500 to-blue-600' },
}

const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Vivamus placerat',
    team: 'PLATFORM',
    description: 'Lorem sed rhoncus ipsum, placerat a mauris. Nullam auctor ut felis porta adipiscing.',
    progress: 65,
    color: 'teal',
    icon: 'tools',
    status: 'in_progress',
    members: [
      { initials: 'JD', name: 'John Doe' },
      { initials: 'AB', name: 'Alice Brown' },
      { initials: 'CM', name: 'Charlie Moore' },
    ],
  },
  {
    id: 2,
    name: 'Pellentesque',
    team: 'DESIGN',
    description: 'Ut pellentesque dolor sit amet consectetur adipiscing elit. Morbi et laoreet sapien.',
    progress: 45,
    color: 'rose',
    icon: 'design',
    status: 'pending',
    members: [
      { initials: 'EF', name: 'Emma Fox' },
      { initials: 'GH', name: 'George Hill' },
    ],
  },
  {
    id: 3,
    name: 'VestBulum',
    team: 'DEVELOPMENT',
    description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.',
    progress: 80,
    color: 'indigo',
    icon: 'code',
    status: 'in_progress',
    members: [
      { initials: 'IJ', name: 'Iris James' },
      { initials: 'KL', name: 'Kevin Lee' },
      { initials: 'MN', name: 'Maria Nelson' },
    ],
  },
  {
    id: 4,
    name: 'Maecis',
    team: 'ANALYTICS',
    description: 'Aliquam efficitur ac est quis dignissim. Phasellus eu lorem nisl sed consequat velit.',
    progress: 30,
    color: 'orange',
    icon: 'chart',
    status: 'pending',
    members: [
      { initials: 'OP', name: 'Oliver Parker' },
    ],
  },
  {
    id: 5,
    name: 'Aliquam',
    team: 'MARKETING',
    description: 'Pellentesque at sed ultricies est. Nullam sem felis, dapibus sit amet pretium et auctor.',
    progress: 90,
    color: 'purple',
    icon: 'rocket',
    status: 'completed',
    members: [
      { initials: 'QR', name: 'Quincy Roberts' },
      { initials: 'ST', name: 'Sara Thompson' },
      { initials: 'UV', name: 'Uma Valencia' },
    ],
  },
  {
    id: 6,
    name: 'Fiance egat',
    team: 'PRODUCT',
    description: 'Aliquam pharetra sodales urna, et condimentum felis elementum vel. Donec id augue nunc.',
    progress: 55,
    color: 'blue',
    icon: 'camera',
    status: 'in_progress',
    members: [
      { initials: 'WX', name: 'William Xavier' },
      { initials: 'YZ', name: 'Yvonne Zamora' },
    ],
  },
]

export default function Projects() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    if (activeTab === 'pending') return p.status === 'pending'
    if (activeTab === 'completed') return p.status === 'completed'
    return true
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return { label: 'Completado', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300' }
      case 'pending':
        return { label: 'Pendiente', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300' }
      default:
        return { label: 'En progreso', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300' }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Proyectos</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestiona y monitorea todos tus proyectos</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-accent-600 text-white font-semibold py-2.5 px-4 rounded-2xl shadow-lg shadow-brand-600/25 hover:shadow-xl transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo proyecto
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'all', label: 'Todos los proyectos', icon: '📋' },
          { id: 'pending', label: 'Pendientes', icon: '⏳' },
          { id: 'completed', label: 'Completados', icon: '✅' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
        {filteredProjects.map((project) => {
          const colors = PROJECT_COLORS[project.color]
          const badge = getStatusBadge(project.status)

          return (
            <div
              key={project.id}
              className="card group cursor-pointer hover:shadow-premium-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {/* Icon and Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center text-2xl`}>
                  {PROJECT_ICONS[project.icon]}
                </div>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>
              </div>

              {/* Title and Team */}
              <div className="mb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{project.name}</h3>
                <p className={`text-xs font-semibold ${colors.text} uppercase tracking-wider mt-1`}>{project.team}</p>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 h-10">{project.description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Progreso</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors.accent} transition-all duration-500`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Status Badge and Action Button */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </div>
                <button className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${colors.accent} opacity-0 group-hover:opacity-100 transition-opacity hover:shadow-lg`}>
                  Ver detalles
                </button>
              </div>

              {/* Team Members */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors.accent} flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-slate-900 ring-1 ring-slate-200 dark:ring-slate-800`}
                      title={member.name}
                    >
                      {member.initials}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 border-2 border-white dark:border-slate-900">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                  {project.members.length} miembro{project.members.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">No hay proyectos en esta categoría</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Crea uno nuevo para comenzar</p>
        </div>
      )}
    </div>
  )
}
