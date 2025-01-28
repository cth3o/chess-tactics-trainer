'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { LayoutDashboard, AreaChart, UserCog, Swords } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarButton } from './sidebar-button'
import Link from 'next/link'

export const Sidebar = () => {
  const pathname = usePathname()

  const activeMenu = useMemo(() => {
    if (pathname?.startsWith('/stats')) {
      return 'stats'
    } else if (pathname?.startsWith('/profile')) {
      return 'profile'
    } else if (pathname?.startsWith('/challenge')) {
      return 'challenge'
    }
    return 'home'
  }, [pathname])

  return (
    // eslint-disable-next-line tailwindcss/no-custom-classname
    <div className='fixed z-10 w-screen shadow-lg h-18 bg-foreground md:h-full md:w-16'>
      <div className='flex items-center justify-around md:h-full md:flex-col md:justify-between'>
        <Link href='/' className='hidden md:block'>
          <Image
            src='/logo.png'
            width='220'
            height='220'
            alt='logo'
            className='w-12 m-2 mt-4 hover:scale-110'
          />
        </Link>
        <div className='flex gap-14 md:flex-col'>
          <SidebarButton
            label='Home'
            baseUrl='/'
            icon={<LayoutDashboard />}
            active={activeMenu === 'home'}
          />
          <SidebarButton
            label='Stats'
            baseUrl='/stats'
            icon={<AreaChart />}
            active={activeMenu === 'stats'}
          />
          <SidebarButton
            label='Challenge'
            baseUrl='/challenge'
            icon={<Swords />}
            active={activeMenu === 'challenge'}
          />
          <SidebarButton
            label='Profile'
            baseUrl='/profile'
            icon={<UserCog />}
            active={activeMenu === 'profile'}
          />
        </div>
        <div className='hidden md:block' />
      </div>
    </div>
  )
}
