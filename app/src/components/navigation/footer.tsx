'use client'

import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className='text-center text-xs text-white/20 absolute bottom-0 -z-10 py-2 w-full'>
      <Link href='/about' className='hover:underline'>
        Chess Tactics Manager
      </Link>{' '}
      © {new Date().getFullYear()} - All rights reserved
    </footer>
  )
}
