'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CredentialSchema, type CredentialsType } from './signin.schema'

export const SigninForm = () => {
    const router = useRouter()

    const form = useForm<CredentialsType>({
        resolver: zodResolver(CredentialSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: true
        }
    })

    const onSubmit = async (data: CredentialsType) => {
        const response = await signIn(
            'credentials',
            { email: data.email, password: data.password, redirect: false }
        )

        if (!response || response.error) {
            form.setError('root', { message: 'Invalid login or password' })
            return
        }

        router.push('/')
    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                name='email'
                control={form.control}
                disabled={form.formState.isSubmitting}
                render={(context) => (
                    <FormItem>
                        <FormLabel>
                            Email
                        </FormLabel>
                        <FormControl>
                            <Input type='text' placeholder='Type your Email address' {...context.field}
                                className={`mb-4 mt-2 h-10 w-full rounded-none border border-background
                         bg-background px-3 py-2 shadow-md`}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name='password'
                control={form.control}
                disabled={form.formState.isSubmitting}
                render={(context) => (
                    <FormItem>
                        <FormLabel>
                            Password
                        </FormLabel>
                        <FormControl>
                            <Input type='password' placeholder='Type your Password' {...context.field}
                                className={`mb-4 mt-2 h-10 w-full rounded-none border border-background
                                 bg-background px-3 py-2 shadow-md`}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {form.formState.errors.root && <div className='mt-2 mb-5 text-xs text-red-500'>
                {form.formState.errors.root.message}
            </div>}

            <div className={`mb-6 mt-2 flex flex-col
                items-center gap-2 text-xs sm:flex-row sm:justify-between md:items-end`}>
                <div className='flex items-center justify-center gap-2'>
                    <FormField
                        name='remember'
                        control={form.control}
                        render={(context) => (<>
                            <Checkbox
                                checked={context.field.value}
                                onCheckedChange={context.field.onChange}
                                disabled={form.formState.isSubmitting}
                            />
                            Remember me
                        </>
                        )}
                    />
                </div>
                <Link href='/forgot-password' className='hover:underline'>
                    Forgot your password?
                </Link>
            </div>
            <Button
                className='w-full mt-4 rounded-none dark'
                variant='secondary'
                disabled={form.formState.isSubmitting}
                type='submit'
                size='lg'
            >
                Connexion
                {form.formState.isSubmitting && <Loader2 className='ml-1 size-4 animate-spin' />}
            </Button>
        </form>
    </Form>)
}
