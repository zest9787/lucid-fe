import styled from 'styled-components'

export const EmployeeOptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 48px;

  .employee-option__avatar {
    display: grid;
    place-items: center;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    color: var(--employee-option-primary);
    background: var(--employee-option-active-bg);
    font-size: 16px;
  }

  .employee-option__body {
    flex: 1;
    min-width: 0;
  }

  .employee-option__heading {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 10px;
    line-height: 22px;
  }

  .employee-option__name {
    color: var(--employee-option-text);
    font-size: 14px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .employee-option__number {
    color: var(--employee-option-secondary);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .employee-option__description {
    display: block;
    overflow: hidden;
    color: var(--employee-option-secondary);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const EmployeeOptionPopup = styled.div<{
  $primary: string
  $activeBackground: string
  $hoverBackground: string
  $text: string
  $secondaryText: string
}>`
  --employee-option-primary: ${({ $primary }) => $primary};
  --employee-option-active-bg: ${({ $activeBackground }) => $activeBackground};
  --employee-option-text: ${({ $text }) => $text};
  --employee-option-secondary: ${({ $secondaryText }) => $secondaryText};

  .ant-select-item-option {
    min-height: 64px;
    padding: 8px 10px;
    border-radius: 6px;
    transition: background-color 120ms ease;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background-color: ${({ $hoverBackground }) => $hoverBackground};
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background-color: ${({ $activeBackground }) => $activeBackground};
  }
`
