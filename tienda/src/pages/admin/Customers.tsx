import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import SearchInput from '../../components/common/SearchInput'
import FilterDropdown from '../../components/common/FilterDropdown'
import DataTable, { type Column } from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import { customerService } from '../../services/customerService'
import type { Customer } from '../../types/admin'

const PAGE_SIZE = 10

export default function Customers() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    const list = await customerService.getAll()
    setCustomers(list)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return customers.filter((c) => {
      if (status !== 'all' && c.status !== status) return false
      if (term) {
        const haystack = `${c.name} ${c.email} ${c.phone ?? ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })
  }, [customers, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Cliente',
      render: (row) => (
        <div>
          <p className="font-medium text-carbon-100">{row.name}</p>
          <p className="text-xs text-carbon-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'id',
      header: 'ID',
      render: (row) => <span className="text-carbon-400">#{row.id}</span>,
    },
    {
      key: 'registered',
      header: 'Registro',
      render: (row) => (
        <span className="text-carbon-300">
          {new Date(row.registeredAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: () => (
        <span
          className="inline-flex size-8 items-center justify-center rounded-lg border border-carbon-700 text-carbon-400 transition-colors hover:border-f1-500 hover:text-f1-400"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowRight size={14} />
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Clientes"
        subtitle={`${customers.length} clientes registrados`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[220px] flex-1">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            placeholder="Buscar por nombre, email o teléfono..."
          />
        </div>
        <FilterDropdown
          label="Estado"
          value={status}
          onChange={(v) => {
            setStatus(v)
            setPage(1)
          }}
          options={[
            { value: 'activo', label: 'Activo' },
            { value: 'inactivo', label: 'Inactivo' },
          ]}
          allLabel="Todos los estados"
        />
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(c) => c.id}
        loading={loading}
        onRowClick={(customer) => navigate(`/admin/clientes/${customer.id}`)}
      />

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
      />
    </div>
  )
}