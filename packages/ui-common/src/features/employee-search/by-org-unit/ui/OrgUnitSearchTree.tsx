import { Empty, Spin, Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import type { OrgUnit } from '@entities/org-unit'
import './OrgUnitSearchTree.scss'

type OrgUnitSearchTreeProps = {
  loading?: boolean
  orgUnits: OrgUnit[]
  selectedOrgUnitId?: string
  onSelectOrgUnit: (orgUnitId: string) => void
}

function toTreeData(orgUnits: OrgUnit[]): DataNode[] {
  // Antd Tree owns the display shape; the entity keeps the API shape.
  return orgUnits.map((orgUnit) => ({
    key: orgUnit.orgUnitId,
    title: orgUnit.orgUnitName,
    children: orgUnit.children ? toTreeData(orgUnit.children) : undefined,
  }))
}

export function OrgUnitSearchTree({
  loading = false,
  orgUnits,
  selectedOrgUnitId,
  onSelectOrgUnit,
}: OrgUnitSearchTreeProps) {
  if (loading) {
    return (
      <div className="org-unit-search-tree org-unit-search-tree--centered">
        <Spin />
      </div>
    )
  }

  if (orgUnits.length === 0) {
    return (
      <div className="org-unit-search-tree org-unit-search-tree--centered">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }

  return (
    <div className="org-unit-search-tree">
      <Tree
        blockNode
        defaultExpandAll
        selectedKeys={selectedOrgUnitId ? [selectedOrgUnitId] : []}
        treeData={toTreeData(orgUnits)}
        onSelect={(_, event) => {
          const orgUnitId = String(event.node.key)

          onSelectOrgUnit(orgUnitId)
        }}
      />
    </div>
  )
}
