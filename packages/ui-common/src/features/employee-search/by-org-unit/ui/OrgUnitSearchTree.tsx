import { SearchOutlined } from '@ant-design/icons'
import { Empty, Input, Spin, Tree } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { DataNode } from 'antd/es/tree'
import type { OrgUnit } from '@entities/org-unit'
import './OrgUnitSearchTree.scss'

type OrgUnitSearchTreeProps = {
  loading?: boolean
  orgUnits: OrgUnit[]
  selectedOrgUnitId?: string
  onSelectOrgUnit: (orgUnitId: string) => void
}

const searchDelay = 300
function canSearchKeyword(keyword: string): boolean {
  if (/^[0-9]+$/.test(keyword)) {
    return keyword.length >= 4
  }

  if (/[\uAC00-\uD7A3]/.test(keyword)) {
    return keyword.length >= 2
  }

  return keyword.length >= 3
}

function highlightKeyword(text: string, keyword: string): ReactNode {
  if (!keyword) {
    return text
  }

  const normalizedText = text.toLowerCase()
  const parts: ReactNode[] = []
  let start = 0
  let matchIndex = normalizedText.indexOf(keyword)

  while (matchIndex !== -1) {
    parts.push(text.slice(start, matchIndex))
    parts.push(
      <mark className="org-unit-search-tree__match" key={matchIndex}>
        {text.slice(matchIndex, matchIndex + keyword.length)}
      </mark>,
    )
    start = matchIndex + keyword.length
    matchIndex = normalizedText.indexOf(keyword, start)
  }

  parts.push(text.slice(start))
  return parts
}

function toTreeData(orgUnits: OrgUnit[], keyword: string): DataNode[] {
  // Antd Tree owns the display shape; the entity keeps the API shape.
  return orgUnits.flatMap((orgUnit) => {
    const matches =
      orgUnit.orgUnitName.toLowerCase().includes(keyword) ||
      orgUnit.orgUnitId.toLowerCase().includes(keyword)
    const children = orgUnit.children
      ? toTreeData(orgUnit.children, matches ? '' : keyword)
      : undefined

    if (!matches && !children?.length) {
      return []
    }

    return [
      {
        key: orgUnit.orgUnitId,
        title: orgUnit.orgUnitName,
        children,
      },
    ]
  })
}

export function OrgUnitSearchTree({
  loading = false,
  orgUnits,
  selectedOrgUnitId,
  onSelectOrgUnit,
}: OrgUnitSearchTreeProps) {
  const [keyword, setKeyword] = useState('')
  const [normalizedKeyword, setNormalizedKeyword] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const searchKeyword = keyword.trim().toLowerCase()
      setNormalizedKeyword(
        canSearchKeyword(searchKeyword) ? searchKeyword : '',
      )
    }, searchDelay)

    return () => window.clearTimeout(timer)
  }, [keyword])
  const treeData = useMemo(
    () => toTreeData(orgUnits, normalizedKeyword),
    [orgUnits, normalizedKeyword],
  )

  return (
    <div className="org-unit-search-tree">
      <Input
        allowClear
        aria-label="Search departments"
        placeholder="Search departments"
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
      <div className="org-unit-search-tree__content">
        {loading ? (
          <div className="org-unit-search-tree__empty">
            <Spin />
          </div>
        ) : treeData.length === 0 ? (
          <div className="org-unit-search-tree__empty">
            <Empty
              description={normalizedKeyword ? 'No matching departments' : undefined}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <Tree
            key={normalizedKeyword}
            blockNode
            defaultExpandAll
            selectedKeys={selectedOrgUnitId ? [selectedOrgUnitId] : []}
            treeData={treeData}
            titleRender={(node) =>
              highlightKeyword(String(node.title ?? ''), normalizedKeyword)
            }
            onSelect={(_, event) => {
              const orgUnitId = String(event.node.key)

              onSelectOrgUnit(orgUnitId)
            }}
          />
        )}
      </div>
    </div>
  )
}
