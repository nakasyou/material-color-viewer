import { hexFromArgb, type Scheme } from '@material/material-color-utilities'

export type ColorLabels = keyof ReturnType<Scheme['toJSON']>
export const getMaterialColors = (source: Scheme) => {
  const colors: Record<string, string> = {}
  for (const [key, value] of Object.entries(source.toJSON())) {
    colors[key] = hexFromArgb(value)
  }
  return colors as MaterialColors
}
export type MaterialColors = Record<ColorLabels, string>
