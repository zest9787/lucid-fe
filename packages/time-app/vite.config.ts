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

const mockDataPath = fileURLToPath(
  new URL('./mock-data/condition-grid.json', import.meta.url),
)

const readMockData = () =>
  JSON.parse(readFileSync(mockDataPath, 'utf8')) as ConditionGridMockData

const mileageYears = [2024, 2025, 2026] as const

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
      const companyCode = url.searchParams.get('companyCode') ?? ''
      let body: unknown

      const detailMatch = url.pathname.match(/^\/api\/employees\/([^/]+)$/)

      if (detailMatch) {
        const employeeId = decodeURIComponent(detailMatch[1])
        const employee = data.employees.find((item) => item.id === employeeId)

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
        case '/api/employees': {
          const position = url.searchParams.get('position') ?? ''
          const jobTitle = url.searchParams.get('jobTitle') ?? ''
          const role = url.searchParams.get('role') ?? ''
          const type = url.searchParams.get('type') ?? 'S'
          const page = Math.max(Number(url.searchParams.get('page')) || 1, 1)
          const pageSize = Math.max(Number(url.searchParams.get('pageSize')) || 5, 1)
          const filteredEmployees = data.employees.filter(
            (employee) =>
              employee.companyCode === companyCode &&
              (!position || employee.position === position) &&
              (!jobTitle || employee.jobTitle === jobTitle) &&
              (!role || employee.role === role),
          )
          const start = (page - 1) * pageSize
          if (type === 'D') {
            const employees = [...filteredEmployees].sort(
              (employeeA, employeeB) =>
                employeeA.department.localeCompare(employeeB.department) ||
                employeeA.team.localeCompare(employeeB.team) ||
                employeeA.name.localeCompare(employeeB.name),
            )
            const pageEmployees = employees.slice(start, start + pageSize)

            body = {
              items: pageEmployees.flatMap((employee) =>
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
            items: rows.slice(start, start + pageSize),
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
