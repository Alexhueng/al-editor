import type { DropdownOption } from 'naive-ui'

declare global {
  type OptionItem = { click?: (key: string, option: DropdownOption) => void } & DropdownOption
}
