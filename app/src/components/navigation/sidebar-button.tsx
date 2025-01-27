import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SidebarButtonProps {
    label: string
    baseUrl: string
    icon: React.ReactNode
    active: boolean
}

export const SidebarButton = ({
    label,
    baseUrl,
    icon,
    active
}: SidebarButtonProps) => {
    return (<Link href={baseUrl}>
        <Button
            variant='link'
            className={cn('size-4 p-8 text-white hover:no-underline rounded-none', {
                'bg-primary text-white': active
            })}
            size='icon'
        >
            <div className='flex flex-col items-center justify-center text-xs font-light'>
                {icon}
                {label}
            </div>
        </Button>
    </Link>
    )
}
