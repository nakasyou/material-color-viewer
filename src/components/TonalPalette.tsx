import {
  type TonalPalette,
  rgbaFromArgb,
  hexFromArgb,
} from '@material/material-color-utilities'
import { defineVaporComponent } from '../utils/define-vapor-component'
import { cn } from '../utils/cn'
import { ArgbColor } from './ArgbColor'

export const TONE_NUMS = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95]
export const TonalPaletteColors = defineVaporComponent(
  (props: { palette?: TonalPalette }) => {
    return (
      <div class="flex gap-1">
        {TONE_NUMS.map((tone) => (
          <ArgbColor tone={tone} color={props?.palette?.tone(tone) ?? 0} />
        ))}
      </div>
    )
  },
)
