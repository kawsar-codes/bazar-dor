import { SectionSkeleton } from '@/components/Skeletons'

export default function HomeLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <SectionSkeleton count={6} />
      <SectionSkeleton count={6} />
      <SectionSkeleton count={8} />
    </div>
  )
}
