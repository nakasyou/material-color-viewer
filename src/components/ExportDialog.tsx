import { Dialog } from '@ark-ui/vue'
import {
  hexFromArgb,
  TonalPalette,
  type Theme,
} from '@material/material-color-utilities'
import { defineVaporComponent } from '../utils/define-vapor-component'
import { computed } from 'vue'
import { TONE_NUMS } from './TonalPalette'
import { splitWithCamelCase } from '../utils/cases'

export const ExportDialog = defineVaporComponent((props: { theme: Theme }) => {
  const tailwindCode = computed(() => {
    let code = ''

    // Named colors
    for (const [name, color] of Object.entries(
      props.theme.schemes.light.toJSON(),
    )) {
      code += `--color-light-${splitWithCamelCase(name).join('-').toLowerCase()}: ${hexFromArgb(color)};\n`
    }
    for (const customColor of props.theme.customColors) {
      code += `--color-light-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}: ${hexFromArgb(
        customColor.light.color,
      )};\n`
      code += `--color-light-on-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}: ${hexFromArgb(
        customColor.light.onColor,
      )};\n`
      code += `--color-light-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}-container: ${hexFromArgb(
        customColor.light.colorContainer,
      )};\n`
      code += `--color-light-on-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}-container: ${hexFromArgb(
        customColor.light.onColorContainer,
      )};\n`
    }
    code += '\n'
    for (const [name, color] of Object.entries(
      props.theme.schemes.dark.toJSON(),
    )) {
      code += `--color-dark-${splitWithCamelCase(name).join('-').toLowerCase()}: ${hexFromArgb(color)};\n`
    }
    for (const customColor of props.theme.customColors) {
      code += `--color-dark-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}: ${hexFromArgb(
        customColor.dark.color,
      )};\n`
      code += `--color-dark-on-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}: ${hexFromArgb(
        customColor.dark.onColor,
      )};\n`
      code += `--color-dark-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}-container: ${hexFromArgb(
        customColor.dark.colorContainer,
      )};\n`
      code += `--color-dark-on-${splitWithCamelCase(customColor.color.name).join('-').toLowerCase()}-container: ${hexFromArgb(
        customColor.dark.onColorContainer,
      )};\n`
    }
    code += '\n'

    // Base theme by tone
    for (const [name, palette] of Object.entries({
      ...props.theme.palettes,
      ...Object.fromEntries(
        props.theme.customColors.map((color) => [
          color.color.name,
          TonalPalette.fromInt(color.color.value),
        ]),
      ),
    })) {
      for (const tone of TONE_NUMS) {
        code += `--color-${name}-${tone * 10}: ${hexFromArgb(palette.tone(tone))};\n`
      }
      code += '\n'
    }

    code = code.trim()

    code = `@theme {\n${code
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n')}\n}`

    return code
  })
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger class="cursor-pointer">Export</Dialog.Trigger>
        <Dialog.Backdrop class="fixed top-0 left-0 w-full h-dvh bg-black/50 z-10" />
        <Dialog.Positioner class="fixed top-0 left-0 w-full h-dvh grid place-items-center z-20">
          <Dialog.Content class="bg-white p-4 rounded-lg">
            <div class="flex justify-between items-center mb-4 gap-2">
              <Dialog.Title class="font-bold">Export theme</Dialog.Title>
              <Dialog.CloseTrigger class="i-tabler-x w-6 h-6"></Dialog.CloseTrigger>
            </div>
            <div class="h-50">
              <pre class="h-full overflow-y-auto p-4 bg-gray-900 text-white rounded-lg">
                <code>{tailwindCode.value}</code>
              </pre>
            </div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </div>
  )
})
