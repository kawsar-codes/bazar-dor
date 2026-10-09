import type { ChangeDir } from '@/lib/api'
import { formatChange } from '@/lib/bn'

const STYLES: Record<ChangeDir, string> = {
  up: 'text-up bg-up-soft',
  down: 'text-down bg-down-soft',
  flat: 'text-flat bg-flat-soft',
}

export default function ChangeBadge({ dir, pct }: { dir: ChangeDir; pct: number }) {
  return (
    <span className={`badge badge-sm whitespace-nowrap font-medium ${STYLES[dir]}`}>
      {formatChange(dir, pct)}
    </span>
  )
}
