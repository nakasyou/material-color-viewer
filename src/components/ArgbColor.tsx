import { hexFromArgb } from '@material/material-color-utilities'
import { cn } from '../utils/cn'
import { defineVaporComponent } from '../utils/define-vapor-component'

export const ArgbColor = defineVaporComponent((props: {
  tone: number
  color: number
}) => {
  return (
    <div
      class={cn(
        'shrink-0 w-12 h-12 flex items-center justify-center hover:scale-105 transition-transform rounded-lg',
        props.tone >= 60 ? 'text-gray-900' : 'text-white',
      )}
      style={{
        backgroundColor: `${hexFromArgb(props.color)}`,
      }}
    >
      {props.tone * 10}
    </div>
  )
})
