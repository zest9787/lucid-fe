import type { ColDef } from 'ag-grid-community'
import { AgGridReact, type AgGridReactProps } from 'ag-grid-react'
import { Empty } from 'antd'
import { useMemo, type Ref } from 'react'
// 공통 그리드를 사용하는 화면에서 모듈 등록과 기본 테마 CSS를 반복하지 않도록
// 이 컴포넌트를 불러올 때 함께 적용한다.
import '../../lib/ag-grid/registerCommunityModules'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

/**
 * AG Grid의 기본 속성에 프로젝트 공통 속성을 더한다.
 * TData는 행 데이터 타입이며 columnDefs, 이벤트의 data, ref의 API 타입에 연결된다.
 * 따라서 사용 화면에서도 <CommonGrid<Employee>>처럼 행 타입을 지정할 수 있다.
 */
export type CommonGridProps<TData = unknown> = AgGridReactProps<TData> & {
  /**
   * 데이터가 없을 때의 표시 방식. 기본값은 'message'.
   * - message: 공통 빈 데이터 안내 또는 사용자가 지정한 오버레이를 표시한다.
   * - blank: 빈 데이터 안내를 숨기고 헤더 아래 영역을 비워둔다.
   * 실제 행 데이터는 숨기지 않으므로 초기 빈 화면에는 rowData={[]}를 함께 사용한다.
   */
  emptyState?: 'message' | 'blank'
  /** 공통 빈 데이터 안내 문구. 기본값은 '데이터가 없습니다.'. */
  emptyMessage?: string
  /**
   * 내부 AgGridReact 인스턴스를 그대로 전달한다. React 19의 ref prop을 사용한다.
   * onGridReady 이후 ref.current?.api로 선택 행 조회 등의 API를 호출할 수 있다.
   */
  ref?: Ref<AgGridReact<TData>>
}

// 모든 열에 적용할 최소 공통 설정. 화면별 defaultColDef로 각각 재정의할 수 있다.
const defaultColumnOptions = { resizable: true, sortable: true }
// 렌더링마다 새 빈 배열을 만들지 않아 불필요한 행 데이터 갱신을 줄인다.
// never[]는 어떤 TData의 빈 배열로도 사용할 수 있다.
const emptyRows: never[] = []

// AG Grid가 데이터 영역에 배치하는 기본 빈 데이터 오버레이.
// 별도 absolute 요소를 겹치지 않으므로 헤더 높이와 위치를 직접 계산할 필요가 없다.
function NoRowsOverlay({ message }: { message: string }) {
  return (
    <div role="status">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={message} />
    </div>
  )
}

/**
 * 프로젝트 공통 설정을 적용한 AgGridReact 래퍼.
 *
 * 공통으로 처리하는 속성은 일반적으로 직접 전달한 prop → gridOptions → 공통 기본값
 * 순서로 선택한다. defaultColDef는 같은 순서로 우선권을 주되 객체를 얕게 병합한다.
 * 그 외 AG Grid 속성 및 이벤트는 props와 gridOptions를 통해 내부 그리드에 전달한다.
 *
 * 높이는 부모를 100% 채우므로 부모에 높이를 지정하거나
 * containerStyle={{ height: 360 }}처럼 그리드 자체의 높이를 지정해야 한다.
 */
export function CommonGrid<TData = unknown>({
  emptyState = 'message',
  emptyMessage = '데이터가 없습니다.',
  ref,
  gridOptions,
  className,
  containerStyle,
  ...props
}: CommonGridProps<TData>) {
  // 공통 설정을 바탕으로 gridOptions, 직접 전달한 열 설정을 차례대로 덮어쓴다.
  // 예: defaultColDef={{ sortable: false }}여도 공통 resizable: true는 유지된다.
  // 원본 객체를 수정하지 않고, 입력 객체가 같으면 병합 결과의 참조도 유지한다.
  const defaultColDef = useMemo<ColDef<TData>>(
    () => ({
      ...defaultColumnOptions,
      ...gridOptions?.defaultColDef,
      ...props.defaultColDef,
    }),
    [gridOptions?.defaultColDef, props.defaultColDef],
  )
  // 공통 안내 문구를 기본 파라미터로 제공한다.
  // 사용자 파라미터는 직접 prop과 gridOptions 중 하나를 선택해 덧붙인다.
  // 사용자 파라미터에 message가 있으면 emptyMessage보다 우선한다.
  const overlayParams = useMemo(
    () => ({
      message: emptyMessage,
      ...(props.noRowsOverlayComponentParams ??
        gridOptions?.noRowsOverlayComponentParams),
    }),
    [
      emptyMessage,
      props.noRowsOverlayComponentParams,
      gridOptions?.noRowsOverlayComponentParams,
    ],
  )
  // 사용 화면에서 이미 숨기도록 설정한 오버레이 목록도 보존한다.
  const nativeSuppressOverlays = props.suppressOverlays ?? gridOptions?.suppressOverlays
  // blank 상태에서는 noRows만 추가로 숨긴다. 로딩 표시는 이 설정으로 숨기지 않는다.
  // Set으로 중복을 제거하며, message로 전환하면 사용자가 지정한 목록으로 돌아간다.
  const suppressOverlays = useMemo(
    () =>
      emptyState === 'blank'
        ? [...new Set([...(nativeSuppressOverlays ?? []), 'noRows' as const])]
        : nativeSuppressOverlays,
    [emptyState, nativeSuppressOverlays],
  )
  // 기존 프로젝트의 Quartz CSS 테마를 기본으로 사용한다.
  // AG Grid의 테마 객체를 전달하면 아래에서 legacy CSS 클래스는 추가하지 않는다.
  const theme = props.theme ?? gridOptions?.theme ?? 'legacy'
  const rowModelType = props.rowModelType ?? gridOptions?.rowModelType ?? 'clientSide'
  const overlayNoRowsTemplate =
    props.overlayNoRowsTemplate ?? gridOptions?.overlayNoRowsTemplate
  // 사용자 컴포넌트 → 사용자 HTML 템플릿 → 공통 컴포넌트 순서로 선택한다.
  // HTML 템플릿이 있으면 공통 컴포넌트를 지정하지 않아 AG Grid가 템플릿을 사용하게 한다.
  // 컴포넌트 비교에는 !== undefined를 사용해 명시적으로 전달한 null도 보존한다.
  const noRowsOverlayComponent =
    props.noRowsOverlayComponent !== undefined
      ? props.noRowsOverlayComponent
      : gridOptions?.noRowsOverlayComponent !== undefined
        ? gridOptions.noRowsOverlayComponent
        : overlayNoRowsTemplate !== undefined
          ? undefined
          : NoRowsOverlay

  // props를 먼저 전달한 뒤 공통 처리가 필요한 속성을 계산한 값으로 지정한다.
  // JSX 안의 속성 설명:
  // - ref/gridOptions: 호출 화면이 사용하는 AG Grid 인스턴스와 옵션 객체를 전달한다.
  // - className/containerStyle: 테마 클래스와 기본 크기에 화면별 클래스·스타일을 더한다.
  // - rowHeight: 직접 지정하지 않으면 프로젝트 기본 행 높이인 42px를 사용한다.
  // - loading: 기본 false로 자동 초기 로딩을 방지한다. 조회 중에는 true를 전달한다.
  // - rowData: 직접 전달한 null도 유지한다. 데이터 미지정 시 clientSide만 []로 채워
  //   초기 빈 상태를 표시하고, 다른 행 모델은 자체 데이터 공급 방식을 사용하게 한다.
  // - 오버레이 속성: 위에서 선택한 빈 상태 표시 방식과 사용자 설정을 적용한다.
  return (
    <AgGridReact<TData>
      {...props}
      ref={ref}
      gridOptions={gridOptions}
      className={[theme === 'legacy' && 'ag-theme-quartz', className]
        .filter(Boolean)
        .join(' ')}
      containerStyle={{ width: '100%', height: '100%', ...containerStyle }}
      theme={theme}
      defaultColDef={defaultColDef}
      rowHeight={props.rowHeight ?? gridOptions?.rowHeight ?? 42}
      loading={props.loading ?? gridOptions?.loading ?? false}
      rowData={
        props.rowData !== undefined
          ? props.rowData
          : (gridOptions?.rowData ??
            (rowModelType === 'clientSide' ? emptyRows : undefined))
      }
      noRowsOverlayComponent={noRowsOverlayComponent}
      noRowsOverlayComponentParams={overlayParams}
      suppressOverlays={suppressOverlays}
    />
  )
}
