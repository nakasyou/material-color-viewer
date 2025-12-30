import {
  argbFromHex,
  type CustomColor,
  hexFromArgb,
  sourceColorFromImage,
  type Theme,
  themeFromSourceColor,
} from '@material/material-color-utilities'
import { computed, effect, onScopeDispose, ref } from 'vue'
import { cn } from '../utils/cn'
import { defineVaporComponent } from '../utils/define-vapor-component'
import type { MaterialColors } from '../utils/get-material-colors'
import {
  readThemeStateFromHash,
  writeThemeStateToHash,
} from '../utils/url-hash-state'

const SeedUseButton = defineVaporComponent(
  (props: { onClick: () => void; isActive: boolean; label: string }) => {
    return (
      <button
        type="button"
        onClick={props.onClick}
        class={cn(
          'transition-all cursor-pointer text-sm',
          props.isActive ? '' : 'opacity-70 hover:opacity-90',
        )}
      >
        {props.label}
      </button>
    )
  },
)
export const SeedPicker = defineVaporComponent(
  (props: {
    colors: MaterialColors
    onChangeTheme: (theme: Theme) => void
  }) => {
    const colorString = ref('#ff0000')
    const imageElement = ref<HTMLImageElement>()
    const useImage = ref(false)
    const additionalColors = ref<[name: string, color: string][]>([])

    const applyHashToState = (hash: string) => {
      const state = readThemeStateFromHash(hash)
      if (!state) return
      if (state.seedHex) colorString.value = state.seedHex
      if (state.customColors) {
        additionalColors.value = state.customColors.map(([name, colorHex]) => [
          name,
          colorHex,
        ])
      }
    }

    applyHashToState(location.hash)

    const customColors = computed((): CustomColor[] => {
      return additionalColors.value.map(
        ([name, color]): CustomColor => ({
          name,
          value: argbFromHex(color),
          blend: true,
        }),
      )
    })

    const theme = computed(() => {
      return themeFromSourceColor(
        argbFromHex(colorString.value),
        customColors.value,
      )
    })

    effect(() => {
      props.onChangeTheme(theme.value)
    })

    let lastWrittenHash: string | null = null
    effect(() => {
      const nextHash = writeThemeStateToHash({
        seedHex: colorString.value,
        customColors: additionalColors.value,
      })
      if (nextHash !== location.hash) {
        lastWrittenHash = nextHash
        history.replaceState(null, '', nextHash)
      } else {
        lastWrittenHash = nextHash
      }
    })

    const onHashChange = () => {
      if (lastWrittenHash === location.hash) return
      applyHashToState(location.hash)
    }
    window.addEventListener('hashchange', onHashChange)
    onScopeDispose(() => {
      window.removeEventListener('hashchange', onHashChange)
    })

    return (
      <div>
        <div>
          <div class="font-bold text-lg mb-1">SEED</div>
          <div class="flex gap-2 mb-2">
            <SeedUseButton
              label="Use color"
              isActive={!useImage.value}
              onClick={() => {
                useImage.value = false
              }}
            />
            <SeedUseButton
              label="Use image"
              isActive={useImage.value}
              onClick={() => {
                useImage.value = true
              }}
            />
          </div>
        </div>

        <div class="mb-3">
          <label v-if={!useImage.value}>
            <div>Pick a seed color:</div>
            <input type="color" v-model={colorString.value} />
          </label>
          <div v-else class="flex items-center gap-2">
            <button
              type="button"
              style={{
                backgroundColor: props.colors.secondary,
                color: props.colors.onSecondary,
              }}
              class="px-3 py-2 rounded-xl cursor-pointer hover:opacity-90"
              onClick={() => {
                const fileInput = document.createElement('input')
                fileInput.type = 'file'
                fileInput.accept = 'image/*'
                fileInput.onchange = (event) => {
                  const target = event.target as HTMLInputElement
                  if (target.files?.[0]) {
                    const file = target.files[0]
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      const image = new Image()
                      image.src = e.target?.result as string
                      image.onload = () => {
                        imageElement.value = image
                        sourceColorFromImage(image).then((sourceColor) => {
                          colorString.value = hexFromArgb(sourceColor)
                        })
                      }
                    }
                    reader.readAsDataURL(file)
                  }
                  fileInput.remove()
                }
                fileInput.click()
              }}
            >
              Upload Image
            </button>
            <img
              v-if={imageElement.value}
              src={imageElement.value?.src}
              class="mt-2 max-h-8  object-contain"
              alt="Uploaded seed"
            />
          </div>
        </div>
        <div class="h-px bg-gray-400 my-4" />
        <div>
          <div class="font-bold text-lg">CUSTOM COLORS</div>
          <div class="flex flex-col gap-2 mt-2">
            {additionalColors.value.map(([name, color], index) => (
              <div class="flex items-center gap-2" key={index}>
                <input
                  type="text"
                  class="px-2 py-1 rounded-lg border border-gray-300"
                  value={name}
                  onChange={(e) => {
                    additionalColors.value = [
                      ...additionalColors.value.slice(0, index),
                      [
                        e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''),
                        color,
                      ],
                      ...additionalColors.value.slice(index + 1),
                    ]
                  }}
                  placeholder="Color Name"
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    additionalColors.value = [
                      ...additionalColors.value.slice(0, index),
                      [name, e.target.value],
                      ...additionalColors.value.slice(index + 1),
                    ]
                  }}
                />
                <button
                  type="button"
                  class="hover:underline i-tabler-trash "
                  onClick={() => {
                    additionalColors.value = [
                      ...additionalColors.value.slice(0, index),
                      ...additionalColors.value.slice(index + 1),
                    ]
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              style={{
                backgroundColor: props.colors.secondary,
                color: props.colors.onSecondary,
              }}
              class="rounded-2xl flex justify-center items-center px-4 py-2 cursor-pointer gap-1 hover:opacity-90"
              onClick={() => {
                additionalColors.value = [
                  ...additionalColors.value,
                  [
                    'untited',
                    `#${Math.floor(Math.random() * 0xffffff)
                      .toString(16)
                      .padStart(6, '0')}`,
                  ],
                ]
              }}
            >
              <div class="i-tabler-plus w-6 h-6" />
              <div>Add Color</div>
            </button>
          </div>
        </div>
      </div>
    )
  },
)
