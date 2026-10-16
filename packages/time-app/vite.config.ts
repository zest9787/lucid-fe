import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

type MockOption = {
  [key: string]: string
}

type MockEmployee = {
  id: string
  companyCode: string
  position: string
  jobTitle: string
  role: string
  employeeNo: string
  name: string
  email: string
  department: string
  team: string
  phone: string
  hireDate: string
}

type ConditionGridMockData = {
  companies: MockOption[]
  positions: Record<string, MockOption[]>
  roles: Record<string, MockOption[]>
  employees: MockEmployee[]
}

type MockMileageRecord = {
  id: string
  companyCode: string
  employeeNo: string
  name: string
  department: string
  team: string
  year: number
  mileage: number
  status: 'Pending' | 'Approved' | 'Rejected'
  effectiveDate: string
}

const mockDataPath = fileURLToPath(
  new URL('./mock-data/condition-grid.json', import.meta.url),
)

const readMockData = () =>
  JSON.parse(readFileSync(mockDataPath, 'utf8')) as ConditionGridMockData

const mileageYears = [2024, 2025, 2026] as const
const detailEmployeeCountPerCompany = 1000
let savedMileageRecords: MockMileageRecord[] | null = null

const createDetailEmployees = (employees: MockEmployee[]) => {
  const employeesByCompany = employees.reduce<Record<string, MockEmployee[]>>(
    (groups, employee) => {
      groups[employee.companyCode] = [...(groups[employee.companyCode] ?? []), employee]
      return groups
    },
    {},
  )

  return Object.values(employeesByCompany).flatMap((companyEmployees) =>
    Array.from({ length: detailEmployeeCountPerCompany }, (_, index) => {
      const employee = companyEmployees[index % companyEmployees.length]
      const sequence = String(index + 1).padStart(4, '0')

      return {
        ...employee,
        id: `${employee.id}-${sequence}`,
        employeeNo: String(2024000 + index + 1),
        name: `${employee.name} ${sequence}`,
        email: `${employee.email.split('@')[0]}.${sequence}@example.com`,
      }
    }),
  )
}

const createMileageRecords = (employees: MockEmployee[]): MockMileageRecord[] =>
  employees.flatMap((employee) =>
    mileageYears.map((year, yearIndex) => ({
      id: `${employee.id}-${year}`,
      companyCode: employee.companyCode,
      department: employee.department,
      effectiveDate: `${year}-01-01`,
      employeeNo: employee.employeeNo,
      mileage: 1000 + Number(employee.employeeNo.slice(-2)) * 125 + yearIndex * 200,
      name: employee.name,
      status: year === 2026 ? 'Pending' : 'Approved',
      team: employee.team,
      year,
    })),
  )

const conditionGridMockApi = (): Plugin => ({
  name: 'condition-grid-mock-api',
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const url = new URL(request.url ?? '/', 'http://localhost')

      if (!url.pathname.startsWith('/api/')) {
        next()
        return
      }

      const data = readMockData()
      const detailEmployees = createDetailEmployees(data.employees)
      savedMileageRecords ??= createMileageRecords(detailEmployees)
      const companyCode = url.searchParams.get('companyCode') ?? ''
      let body: unknown

      if (url.pathname === '/api/mileage-records/batch' && request.method === 'POST') {
        let requestBody = ''

        request.on('data', (chunk) => {
          requestBody += String(chunk)
        })
        request.on('end', () => {
          const payload = JSON.parse(requestBody) as {
            deletedIds: string[]
            rows: MockMileageRecord[]
          }
          const deletedIdSet = new Set(payload.deletedIds)
          const recordMap = new Map(
            (savedMileageRecords ?? [])
              .filter((record) => !deletedIdSet.has(record.id))
              .map((record) => [record.id, record]),
          )

          payload.rows.forEach((record) => recordMap.set(record.id, record))
          savedMileageRecords = [...recordMap.values()]
          response.statusCode = 200
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.end(
            JSON.stringify({
              savedCount: payload.rows.length + payload.deletedIds.length,
            }),
          )
        })
        return
      }

      const detailMatch = url.pathname.match(/^\/api\/employees\/([^/]+)$/)

      if (detailMatch) {
        const employeeId = decodeURIComponent(detailMatch[1])
        const employee = [...data.employees, ...detailEmployees].find(
          (item) => item.id === employeeId,
        )

        response.statusCode = employee ? 200 : 404
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(
          JSON.stringify(employee ?? { message: 'Employee detail not found.' }),
        )
        return
      }

      switch (url.pathname) {
        case '/api/companies':
          body = { companies: data.companies }
          break
        case '/api/positions':
          body = data.positions[companyCode] ?? []
          break
        case '/api/roles':
          body = data.roles[companyCode] ?? []
          break
        case '/api/mileage-records': {
          const employeeNo = url.searchParams.get('employeeNo') ?? ''
          const items = (savedMileageRecords ?? []).filter(
            (record) =>
              (!companyCode || record.companyCode === companyCode) &&
              (!employeeNo || record.employeeNo.includes(employeeNo)),
          )

          body = { items }
          break
        }
        case '/api/employees': {
          const position = url.searchParams.get('position') ?? ''
          const employeeNo = url.searchParams.get('employeeNo') ?? ''
          const jobTitle = url.searchParams.get('jobTitle') ?? ''
          const role = url.searchParams.get('role') ?? ''
          const type = url.searchParams.get('type') ?? 'S'
          const sourceEmployees = type === 'D' ? detailEmployees : data.employees
          const filteredEmployees = sourceEmployees.filter(
            (employee) =>
              employee.companyCode === companyCode &&
              (!employeeNo || employee.employeeNo.includes(employeeNo)) &&
              (!position || employee.position === position) &&
              (!jobTitle || employee.jobTitle === jobTitle) &&
              (!role || employee.role === role),
          )
          if (type === 'D') {
            const employees = [...filteredEmployees].sort(
              (employeeA, employeeB) =>
                employeeA.department.localeCompare(employeeB.department) ||
                employeeA.team.localeCompare(employeeB.team) ||
                employeeA.name.localeCompare(employeeB.name),
            )
            body = {
              items: employees.flatMap((employee) =>
                mileageYears.map((year, yearIndex) => ({
                  ...employee,
                  id: `${employee.id}-${year}`,
                  employeeId: employee.id,
                  user: employee.name,
                  year,
                  mileage:
                    1000 + Number(employee.employeeNo.slice(-2)) * 125 + yearIndex * 200,
                })),
              ),
              total: filteredEmployees.length,
            }
            break
          }

          const rows = filteredEmployees.map(
            ({ id, companyCode, position, jobTitle, role }) => ({
              id,
              companyCode,
              position,
              jobTitle,
              role,
            }),
          )

          body = {
            items: rows,
            total: filteredEmployees.length,
          }
          break
        }
        default:
          next()
          return
      }

      response.statusCode = 200
      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.end(JSON.stringify(body))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [conditionGridMockApi(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'ui-common/employee-picker': fileURLToPath(
        new URL('../ui-common/src/employee-picker.ts', import.meta.url),
      ),
      'ui-common/user-search-modal': fileURLToPath(
        new URL('../ui-common/src/user-search-modal.ts', import.meta.url),
      ),
      'ui-common/config': fileURLToPath(
        new URL('../ui-common/src/config.ts', import.meta.url),
      ),
      'ui-common': fileURLToPath(new URL('../ui-common/src/index.ts', import.meta.url)),
      '@entities': fileURLToPath(new URL('../ui-common/src/entities', import.meta.url)),
      '@features': fileURLToPath(new URL('../ui-common/src/features', import.meta.url)),
      '@shared': fileURLToPath(new URL('../ui-common/src/shared', import.meta.url)),
      '@widgets': fileURLToPath(new URL('../ui-common/src/widgets', import.meta.url)),
    },
  },
})
