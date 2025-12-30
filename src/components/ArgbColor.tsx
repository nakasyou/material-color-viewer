import { hexFromArgb } from '@material/material-color-utilities'
import { copyToClipboard } from '../utils/clipboard'
import { cn } from '../utils/cn'
import { defineVaporComponent } from '../utils/define-vapor-component'
import { ref, watch } from 'vue'

export const ArgbColor = defineVaporComponent(
  (props: { tone: number; color: number }) => {
    const hex = hexFromArgb(props.color).toLowerCase()
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
        class={cn(
          'relative shrink-0 w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform rounded-lg cursor-pointer',
          props.tone >= 60 ? 'text-gray-900' : 'text-white',
        )}
        style={{
          backgroundColor: hex,
        }}
        title={hex}
        onClick={() => {
          void copyToClipboard(hex)
          isCopied.value = true
        }}
        type="button"
      >
        <div class={cn("absolute grid place-items-center bg-black/50 w-full h-full rounded-lg transition-opacity", isCopied.value ? 'opacity-100' : 'opacity-0', )}>
          <div class={cn("i-tabler-check w-6 h-6 transition-transform", isCopied.value ? '' : 'translate-y-5')} />
        </div>

        {props.tone * 10}
      </button>
    )
  },
)
