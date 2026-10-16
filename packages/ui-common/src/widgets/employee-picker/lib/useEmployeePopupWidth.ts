import type { Space } from 'antd'
import { useEffect, useRef, useState, type ComponentRef } from 'react'

/** 자동완성 팝업이 사번·사원명 필드를 합친 너비를 따르도록 관찰한다. */
export function useEmployeePopupWidth() {
  const compactRef = useRef<ComponentRef<typeof Space.Compact>>(null)
  const [popupWidth, setPopupWidth] = useState<number>()

  useEffect(() => {
    const compact = compactRef.current?.nativeElement
    const employeeNo = compact?.querySelector<HTMLElement>(
      '.employee-search-form-item__number',
    )
    const employeeName = compact?.querySelector<HTMLElement>(
      '.employee-search-form-item__name',
    )
    if (!employeeNo || !employeeName) return

    const updateWidth = () => {
      const width =
        employeeNo.getBoundingClientRect().width +
        employeeName.getBoundingClientRect().width
      // 숨겨진 상태에서 측정된 0으로 기존 너비를 덮어쓰지 않는다.
      if (width > 0) setPopupWidth(width)
    }
    const observer = new ResizeObserver(updateWidth)
    observer.observe(employeeNo)
    observer.observe(employeeName)
    updateWidth()

    return () => observer.disconnect()
  }, [])

  return { compactRef, popupWidth }
}
