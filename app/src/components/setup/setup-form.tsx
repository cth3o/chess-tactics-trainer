
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { debounce } from 'lodash'
import { BadgeCheck, Loader2 } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'

export const SetupForm = () => {
    const [accounts, setAccounts] = React.useState({
        chesscom: '',
        lichess: ''
    })
    const [isLoading, setIsLoading] = React.useState({
        lichess: false,
        chesscom: false
    })
    const [verifiedAccount, setVerifiedAccount] = React.useState({
        lichess: false,
        chesscom: false
    })

    const verifyAccount = async (value: string, type: 'lichess' | 'chesscom') => {
        setIsLoading({ ...isLoading, [type]: true })
        const response = await fetch('/api/setup/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lichessUsername: type === 'lichess' ? value : undefined,
                chesscomUsername: type === 'chesscom' ? value : undefined
            })
        })
        setIsLoading({ ...isLoading, [type]: false })
        if (response.ok) {
            setVerifiedAccount({ ...verifiedAccount, [type]: true })
        } else {
            setVerifiedAccount({ ...verifiedAccount, [type]: false })
        }
    }


    const onChangeLichess = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccounts({ ...accounts, lichess: e.target.value })
        verifyAccount(e.target.value, 'lichess')
    }

    const onChangeChesscom = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccounts({ ...accounts, chesscom: e.target.value })
        verifyAccount(e.target.value, 'chesscom')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const response = await fetch('/api/setup/account', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lichessUsername: accounts.lichess.trim(),
                chesscomUsername: accounts.chesscom.trim()
            })
        })
        if (response.ok) {
            toast.success('Configuration saved')
            setTimeout(() => {
                window.location.href = '/'
            }, 1500)
        } else {
            toast.error('An error occured')
        }
    }

    return (
        <form className='w-full mt-10 ' onSubmit={handleSubmit}>
            <div className='flex justify-center w-full'>
                <div className='w-3/4'>
                    <Label htmlFor='chesscom'>
                        Chess.com
                    </Label>
                    <div className='flex items-baseline gap-2'>
                        <Input type='text' id='chesscom' name='chesscom'
                            className={cn('mb-5 w-96 shadow-md border mt-2 h-10 px-3 py-2',
                                'bg-background border-background mb-4 rounded-none')}
                            placeholder='Type your Chess.com username'
                            onChange={debounce(onChangeChesscom, 1000)}
                        />
                        {isLoading['chesscom'] && <Loader2 className='ml-1 size-4 animate-spin' />}
                        {verifiedAccount['chesscom'] && !isLoading['chesscom'] &&
                            <BadgeCheck className='ml-1 size-4' />}
                    </div>
                    <Label htmlFor='password'>
                        Lichess.org
                    </Label>
                    <div className='flex items-baseline gap-2'>
                        <Input type='text' id='lichess' name='lichess'
                            className={cn('mb-5 w-96 shadow-md border mt-2 h-10 px-3 py-2',
                                'bg-background border-background mb-4 rounded-none')}
                            placeholder='Type your Lichess.org username'
                            onChange={debounce(onChangeLichess, 1000)}
                        />
                        {isLoading['lichess'] && <Loader2 className='ml-1 size-4 animate-spin' />}
                        {verifiedAccount['lichess'] && !isLoading['lichess'] && <BadgeCheck className='ml-1 size-4' />}
                    </div>
                </div>
            </div>
            <Button
                type='submit'
                className='w-full mt-5'
                disabled={!verifiedAccount['lichess'] && !verifiedAccount['chesscom']}
            >
                Save settings
            </Button>
        </form>
    )
}
