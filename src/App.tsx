import {
  argbFromHex,
  type Scheme,
  type Theme,
  TonalPalette,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import { computed, defineVaporComponent, ref } from 'vue'
import { ExportDialog } from './components/ExportDialog'
import { SchemeViewer } from './components/SchemeViewer'
import { SeedPicker } from './components/SeedPicker'
import { TonalPaletteColors } from './components/TonalPalette'
import { getMaterialColors } from './utils/get-material-colors'

export default defineVaporComponent(() => {
  const theme = ref<Theme>(themeFromSourceColor(argbFromHex('#ff0000')))

  const lightColors = computed(() =>
    getMaterialColors(theme.value.schemes.light as Scheme),
  )
  const darkColors = computed(() =>
    getMaterialColors(theme.value.schemes.dark as Scheme),
  )

  return (
    <div
      class="py-10 px-10 md:px-20 min-h-dvh flex flex-col gap-10"
      style={{
        backgroundColor: lightColors.value.surfaceVariant,
        color: lightColors.value.onSurfaceVariant,
      }}
    >
      <div class="flex flex-col justify-center gap-4">
        <div
          class="font-bold text-4xl"
          style={{
            color: lightColors.value.onSurface,
          }}
        >
          Material Color Playground
        </div>
        <div class="flex gap-2">
          <ExportDialog theme={theme.value as Theme} />
          <button
            type="button"
            class="cursor-pointer"
            onClick={() => {
              navigator.share({
                url: location.href,
              })
            }}
          >
            Share
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row justify-between">
        <SeedPicker
          colors={lightColors.value}
          onChangeTheme={(t) => {
            theme.value = t
          }}
        />

        <div class="font-bold text-lg mb-1 lg:hidden mt-8">PALETTE</div>
        <div class="flex flex-col gap-2 overflow-x-auto px-3">
          {Object.entries(theme.value.palettes).map(([name, palette]) => (
            <div class="flex items-center">
              <div class="w-28 shrink-0 font-bold text-sm text-left flex items-center gap-1">
                <div class="">{name}</div>
                <div class="grow px-2 pt-1">
                  <div
                    class="h-px"
                    style={{
                      backgroundColor: lightColors.value.outlineVariant,
                    }}
                    hidden
                  />
                </div>
              </div>
              <div class="grow">
                <TonalPaletteColors palette={palette as TonalPalette} />
              </div>
            </div>
          ))}
          {theme.value.customColors.map((color) => (
            <div class="flex items-center">
              <div class="w-28 font-bold text-sm text-left flex items-center gap-1">
                <div class="">{color.color.name}</div>
                <div class="grow px-2 pt-1">
                  <div
                    class="h-px"
                    style={{
                      backgroundColor: lightColors.value.outlineVariant,
                    }}
                    hidden
                  />
                </div>
              </div>
              <TonalPaletteColors
                palette={TonalPalette.fromInt(color.color.value)}
              />
            </div>
          ))}
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2  gap-5">
        <div
          class="flex flex-col gap-5 px-6 py-5 rounded-xl max-w-2xl"
          style={{
            background: lightColors.value.surface,
            color: lightColors.value.onSurface,
          }}
        >
          <div class="font-bold text-3xl ">Light</div>
          <SchemeViewer
            colors={lightColors.value}
            scheme={theme.value.schemes.light as Scheme}
            customColorGroups={theme.value.customColors.map((c) => [
              c.color.name,
              c.light,
            ])}
            isDark={false}
          />
        </div>
        <div
          class="flex flex-col gap-5 px-6 py-5 rounded-xl max-w-2xl"
          style={{
            background: darkColors.value.surface,
            color: darkColors.value.onSurface,
          }}
        >
          <div class="font-bold text-3xl">Dark</div>
          <SchemeViewer
            colors={darkColors.value}
            scheme={theme.value.schemes.dark as Scheme}
            customColorGroups={theme.value.customColors.map((c) => [
              c.color.name,
              c.dark,
            ])}
            isDark={true}
          />
        </div>
      </div>
    </div>
  )
})
