export type HashCustomColor = readonly [name: string, colorHex: string]

export type HashThemeState = {
  seedHex: string
  customColors: HashCustomColor[]
}

const VERSION = 1

const normalizeHex6 = (input: string): string | null => {
  const raw = input.trim().toLowerCase().replace(/^#/, '')
  if (!/^[0-9a-f]{6}$/.test(raw)) return null
  return `#${raw}`
}

const normalizeName = (input: string): string | null => {
  const name = input.trim().toLowerCase()
  if (!/^[a-z0-9]+$/.test(name)) return null
  return name
}

export const readThemeStateFromHash = (
  hash: string,
): Partial<HashThemeState> | null => {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw) return null

  if (!raw.includes('=')) {
    const seedHex = normalizeHex6(raw)
    return seedHex ? { seedHex, customColors: [] } : null
  }

  const params = new URLSearchParams(raw)
  const v = params.get('v')
  if (v && v !== String(VERSION)) return null

  const seedHex = (() => {
    const seedParam = params.get('seed') ?? params.get('s')
    return seedParam ? normalizeHex6(seedParam) : null
  })()

  const customColors: HashCustomColor[] = []
  const customParam = params.get('custom') ?? params.get('c')
  if (customParam) {
    for (const entry of customParam.split(';')) {
      if (!entry) continue
      const [nameRaw, hexRaw] = entry.split(':')
      if (!nameRaw || !hexRaw) continue
      const name = normalizeName(nameRaw)
      const colorHex = normalizeHex6(hexRaw)
      if (!name || !colorHex) continue
      customColors.push([name, colorHex])
    }
  }

  if (!seedHex && customColors.length === 0) return null
  return {
    ...(seedHex ? { seedHex } : {}),
    customColors,
  }
}

export const writeThemeStateToHash = (state: HashThemeState): string => {
  const seedHex = normalizeHex6(state.seedHex) ?? '#ff0000'
  const customColors = state.customColors
    .map(([nameRaw, hexRaw]) => {
      const name = normalizeName(nameRaw)
      const colorHex = normalizeHex6(hexRaw)
      if (!name || !colorHex) return null
      return `${name}:${colorHex.slice(1)}`
    })
    .filter((v): v is string => Boolean(v))

  const params = new URLSearchParams()
  params.set('v', String(VERSION))
  params.set('seed', seedHex.slice(1))
  if (customColors.length) params.set('c', customColors.join(';'))

  return `#${params.toString()}`
}
