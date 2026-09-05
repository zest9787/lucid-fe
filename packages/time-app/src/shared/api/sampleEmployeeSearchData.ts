import type { CompanyListResponse, EmployeeSearchItem, OrgUnit } from 'ui-common'

export const sampleCompanyList: CompanyListResponse = {
  companyCode: 'COM-001',
  searchMode: 'S',
  companies: [
    { companyCode: 'COM-001', companyText: 'Lucid Korea' },
    { companyCode: 'COM-002', companyText: 'Lucid Global' },
  ],
}

export const sampleOrgUnitsByCompany: Record<string, OrgUnit[]> = {
  'COM-001': [
    {
      orgUnitId: 'ORG-100',
      orgUnitName: 'Product Division',
      children: [
        { orgUnitId: 'ORG-110', orgUnitName: 'Product Team' },
        { orgUnitId: 'ORG-120', orgUnitName: 'Design Team' },
      ],
    },
    {
      orgUnitId: 'ORG-200',
      orgUnitName: 'Engineering Division',
      children: [
        { orgUnitId: 'ORG-210', orgUnitName: 'Frontend Team' },
        { orgUnitId: 'ORG-220', orgUnitName: 'Platform Team' },
      ],
    },
  ],
  'COM-002': [
    {
      orgUnitId: 'ORG-300',
      orgUnitName: 'Global Business',
      children: [
        { orgUnitId: 'ORG-310', orgUnitName: 'Sales Team' },
        { orgUnitId: 'ORG-320', orgUnitName: 'Customer Success Team' },
      ],
    },
    {
      orgUnitId: 'ORG-400',
      orgUnitName: 'Global Engineering',
      children: [
        { orgUnitId: 'ORG-410', orgUnitName: 'Platform Team' },
        { orgUnitId: 'ORG-420', orgUnitName: 'Data Team' },
      ],
    },
  ],
}

export const sampleEmployees: EmployeeSearchItem[] = [
  {
    id: 'EMP-001',
    employeeNo: '2024001',
    name: 'Kim Minjun',
    email: 'minjun.kim@example.com',
    companyCode: 'COM-001',
    orgUnitId: 'ORG-210',
    orgUnitName: 'Frontend Team',
    position: 'Frontend Engineer',
  },
  {
    id: 'EMP-002',
    employeeNo: '2024002',
    name: 'Lee Seoyeon',
    email: 'seoyeon.lee@example.com',
    companyCode: 'COM-001',
    orgUnitId: 'ORG-120',
    orgUnitName: 'Design Team',
    position: 'Product Designer',
  },
  {
    id: 'EMP-003',
    employeeNo: '2024003',
    name: 'Park Jiho',
    email: 'jiho.park@example.com',
    companyCode: 'COM-001',
    orgUnitId: 'ORG-110',
    orgUnitName: 'Product Team',
    position: 'Product Owner',
  },
  {
    id: 'EMP-004',
    employeeNo: '2024004',
    name: 'Choi Yuna',
    email: 'yuna.choi@example.com',
    companyCode: 'COM-002',
    orgUnitId: 'ORG-310',
    orgUnitName: 'Sales Team',
    position: 'Account Executive',
  },
  {
    id: 'EMP-005',
    employeeNo: '2024005',
    name: 'Jung Haneul',
    email: 'haneul.jung@example.com',
    companyCode: 'COM-002',
    orgUnitId: 'ORG-410',
    orgUnitName: 'Platform Team',
    position: 'Backend Engineer',
  },
]
