import { checkServerSessionOrRedirect } from '@/lib/authentication'
import { AboutContent } from './about-content'

export default async function ProfilePage() {
  await checkServerSessionOrRedirect()

  return (
    <div className='grid size-full grid-flow-row-dense gap-4'>
      <AboutContent />
    </div>
  )
}
