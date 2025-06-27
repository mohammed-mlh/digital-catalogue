export interface Option {
  id: string
  name: string
  values: string[]
}

export type OptionInput = Omit<Option, 'id'>