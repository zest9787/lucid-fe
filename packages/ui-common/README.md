# ui-common

Shared UI module for applications in this workspace.

## Public API

```ts
import {
  EmployeeSearchFormItem,
  UserSearchModal,
  type UserSearchItem,
} from 'ui-common/employee-picker'
import { EmployeeAutoComplete } from 'ui-common'
```

직원 검색 관련 코드는 다음 기준으로 배치합니다.

- `features/employee-search`: 자동완성, 조건 검색, 조직 검색 등 직원 검색 기능.
- `widgets/employee-picker`: 직원 선택 필드와 검색 모달을 조합하는 UI.
- 앱의 `pages/*/ui`: 직원 선택 위젯과 마일리지 검색 기능을 조합하는 검색 폼.

Widgets는 Features를 참조하고, Pages는 Widgets와 Features를 조합합니다.
Features에서 직원 선택 위젯을 참조하지 않도록 검색 폼은 Pages에 둡니다.
두 편집 페이지가 사용하는 `MileageEditorSearchForm`은 같은 `pages/mileage-editor`
슬라이스 안에서 공유합니다. 레이어 간에는 각 슬라이스의 `index.ts`를 사용합니다.

기존 `ui-common/user-search-modal` 경로도 호환성을 위해 유지합니다.
새 코드는 직원 선택 UI에 `ui-common/employee-picker`를 사용하고,
독립적인 자동완성은 `ui-common`에서 가져오세요. 배포본 사용 시 스타일은
`ui-common/style.css`를 앱에서 불러옵니다.

### Employee picker 내부 구조

공개 컴포넌트인 `UserSearchModal`, `MultiUserSearchModal`, `EmployeeSearchFormItem`은
기존 props를 유지하며, 내부 역할을 다음과 같이 나눕니다.

- `model/employeePickerReducer.ts`: 검색 조건 변경, 결과 선택, 직원 추가 및 초기화 규칙.
- `model/useEmployeePicker.ts`: 공통 회사·조직·직원 조회와 reducer 연결.
- `model/useEmployeeSearchFormItem.ts`: 부모 Form에 선택 결과 반영 및 모달 열기/닫기.
- `model/types.ts`: 위젯 컴포넌트의 props와 Form 값 타입.
- `ui/EmployeePickerModal.tsx`: 공통 검색 폼·조직 트리·모달 레이아웃.
- `ui/UserSearchModal.tsx`, `ui/MultiUserSearchModal.tsx`: 선택 방식별 결과 UI와 확정 처리.
- `lib/useEmployeePopupWidth.ts`: 필드 크기 관찰과 팝업 너비 계산.

검색 결과에서 선택한 `activeEmployees`와 추가 버튼으로 확정한 `selectedEmployees`는
별도 관리합니다. 회사 변경·재검색·검색 초기화는 결과 선택을 해제하되 추가 목록은
유지하고, 모달을 닫으면 모두 초기화합니다. 추가 목록의 중복 판단 기준은 직원 `id`입니다.

선택 및 초기화 규칙은 다음 명령으로 검사합니다(Node.js 24 기준, 별도 테스트 의존성 없음).

```bash
pnpm --filter ui-common test:employee-picker
```

## CommonGrid

`AgGridReactProps<TData>`를 그대로 받으며, `ref`로 AG Grid API에 접근할 수 있습니다.
Community 모듈 등록, Quartz legacy 테마, 행 높이 42px, 열 정렬 및 크기 조절을
공통으로 적용합니다. `defaultColDef`는 공통 설정에 병합하며, 개별 속성으로
기본값을 재정의할 수 있습니다. `gridOptions`도 지원하고 직접 전달한 속성이
우선합니다. 패키지 배포본 사용 시 `ui-common/style.css`를 앱에서 불러오세요.

```tsx
import { useRef } from 'react'
import type { ColDef } from 'ag-grid-community'
import type { AgGridReact } from 'ag-grid-react'
import { CommonGrid } from 'ui-common'
import 'ui-common/style.css'

type Row = { id: string; name: string }
const columns: ColDef<Row>[] = [{ field: 'name', headerName: '이름' }]

function EmployeeGrid({
  rows,
  hasSearched,
  loading,
}: {
  rows: Row[]
  hasSearched: boolean
  loading: boolean
}) {
  const gridRef = useRef<AgGridReact<Row>>(null)

  return (
    <CommonGrid<Row>
      ref={gridRef}
      containerStyle={{ height: 360 }}
      columnDefs={columns}
      rowData={rows}
      loading={loading}
      emptyState={hasSearched ? 'message' : 'blank'}
      emptyMessage="조회 결과가 없습니다."
      defaultColDef={{ filter: true }}
      getRowId={({ data }) => data.id}
    />
  )
}
```

- `emptyState="message"` (기본값): 빈 데이터에 “데이터가 없습니다.” 안내를 표시합니다.
- `emptyState="blank"`: 빈 데이터일 때 안내 없이 헤더와 데이터 영역을 유지합니다.
  데이터가 있으면 정상 표시하므로 초기 빈 화면은 `rowData={[]}`와 함께 사용합니다.
- `loading` 기본값은 `false`입니다. 조회 중에는 `loading={true}`를 전달하면
  로딩 표시가 우선합니다. 데이터·컬럼을 아직 전달하지 않아도 자동 로딩하지 않습니다.
- 그리드 높이는 기본적으로 부모 높이를 따릅니다. 부모에 높이를 지정하거나
  `containerStyle`로 높이를 지정하세요.
- AG Grid의 `noRowsOverlayComponent`, `overlayNoRowsTemplate`, `suppressOverlays`
  등도 사용할 수 있습니다. 커스텀 컴포넌트나 HTML 템플릿을 전달하면 공통 빈 데이터
  안내 대신 전달한 내용을 표시합니다.

## Build

```bash
pnpm --filter ui-common build
```

## Exports

Edit `package.exports.json` first, then run:

```bash
pnpm --filter ui-common sync:exports
```
