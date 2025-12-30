import {
  type ColorGroup,
  hexFromArgb,
  type Scheme,
} from '@material/material-color-utilities'
import { ref, watch } from 'vue'
import { firstUpper, splitWithCamelCase } from '../utils/cases'
import { copyToClipboard } from '../utils/clipboard'
import { cn } from '../utils/cn'
import { defineVaporComponent } from '../utils/define-vapor-component'
import type { ColorLabels, MaterialColors } from '../utils/get-material-colors'

const COLOR_MAP: Record<
  ColorLabels,
  {
    on: ColorLabels | [light: ColorLabels, dark: ColorLabels]
  }
> = {
  primary: { on: 'onPrimary' },
  onPrimary: { on: 'primary' },
  primaryContainer: { on: 'onPrimaryContainer' },
  onPrimaryContainer: { on: 'primaryContainer' },

  secondary: { on: 'onSecondary' },
  onSecondary: { on: 'secondary' },
  secondaryContainer: { on: 'onSecondaryContainer' },
  onSecondaryContainer: { on: 'secondaryContainer' },

  tertiary: { on: 'onTertiary' },
  onTertiary: { on: 'tertiary' },
  tertiaryContainer: { on: 'onTertiaryContainer' },
  onTertiaryContainer: { on: 'tertiaryContainer' },

  error: { on: 'onError' },
  onError: { on: 'error' },
  errorContainer: { on: 'onErrorContainer' },
  onErrorContainer: { on: 'errorContainer' },

  surface: { on: 'onSurface' },
  onSurface: { on: 'surface' },
  surfaceVariant: { on: 'onSurfaceVariant' },
  onSurfaceVariant: { on: 'surfaceVariant' },

  background: { on: 'onBackground' },
  onBackground: { on: 'background' },
  outline: { on: 'surface' },
  outlineVariant: { on: 'onSurface' },

  shadow: { on: ['surface', 'onSurface'] },
  scrim: { on: ['surface', 'onSurface'] },
  inverseSurface: { on: 'inverseOnSurface' },
  inverseOnSurface: { on: 'inverseSurface' },
  inversePrimary: { on: 'onSurface' },
}

const ColorCard = defineVaporComponent(
  (props: { label: string[]; color: string; background: string }) => {
    const hex = props.background.toLowerCase()
    const isCopied = ref(false)
    let copyTimeout: number | undefined
    watch(isCopied, (newVal) => {
      if (newVal) {
        copyTimeout = setTimeout(() => {
          isCopied.value = false
        }, 1000)
      } else {
        if (copyTimeout) {
          clearTimeout(copyTimeout)
        }
      }
    })
    return (
      <button
        class="relative h-20 flex items-end justify-end p-2 rounded-lg hover:scale-105 transition-all hover:drop-shadow-md cursor-pointer"
        style={{
          backgroundColor: hex,
          color: props.color,
          borderColor: props.color,
        }}
        title={hex}
        onClick={() => {
          void copyToClipboard(hex)
          isCopied.value = true
        }}
        type="button"
      >
        <div
          class={cn(
            'absolute grid place-items-center bg-black/50  rounded-lg transition-opacity',
            isCopied.value ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div
            class={cn(
              'i-tabler-check w-6 h-6 transition-transform text-white',
              isCopied.value ? '' : 'translate-y-5',
            )}
          />
        </div>
        <div class="text-xs lowercase text-right" style={{}}>
          {props.label.map((part) => (
            <>{part} </>
          ))}
        </div>
      </button>
    )
  },
)
export const SchemeViewer = defineVaporComponent(
  (props: {
    scheme: Scheme
    colors: MaterialColors
    isDark: boolean
    customColorGroups: [name: string, color: ColorGroup][]
  }) => {
    return (
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(COLOR_MAP).map(([name, { on }]) => (
          <ColorCard
            label={
              splitWithCamelCase(name) // as is
            }
            background={hexFromArgb(props.scheme[name as ColorLabels])}
            color={hexFromArgb(
              props.scheme[
                Array.isArray(on)
                  ? on[props.isDark ? 1 : 0]
                  : (on as ColorLabels)
              ],
            )}
          />
        ))}
        <div class="col-span-2 md:col-span-4 border-t border-gray-300 mt-4 pt-4" />
        {props.customColorGroups.map(([name, color]) => (
          <>
            <ColorCard
              label={splitWithCamelCase(`${name}`)}
              background={hexFromArgb(color.onColor)}
              color={hexFromArgb(color.color)}
            />
            <ColorCard
              label={splitWithCamelCase(`on${firstUpper(name)}`)}
              background={hexFromArgb(color.color)}
              color={hexFromArgb(color.onColor)}
            />
            <ColorCard
              label={splitWithCamelCase(`${name}Container`)}
              background={hexFromArgb(color.onColorContainer)}
              color={hexFromArgb(color.colorContainer)}
            />
            <ColorCard
              label={splitWithCamelCase(`on${firstUpper(name)}Container`)}
              background={hexFromArgb(color.colorContainer)}
              color={hexFromArgb(color.onColorContainer)}
            />
          </>
        ))}
      </div>
    )
  },
)
