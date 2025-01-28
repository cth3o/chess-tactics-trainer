import { AuthImage } from '@/components/auth/auth-image'
import { SignupForm } from '@/app/(auth)/signup/signup.form'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'
import Link from 'next/link'

export default async function SignupPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex items-center justify-center w-full min-h-screen text-white border-none bg-foreground'>
            <div className='flex flex-col items-center justify-around w-full lg:w-5/12'>
                <h1 className='pb-2 mb-10 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0'>
                    Chess Tactics Manager
                </h1>
                <h2 className='mb-10 text-2xl font-semibold'>
                    Create account
                </h2>
                <div className='w-3/4 text-left md:w-1/2'>
                    <SignupForm />
                    <p className='mt-10 text-sm text-center'>
                        Already have an account?
                        <span className='ml-1 text-active hover:underline'>
                            <Link href='/signin'>
                                Sign In
                            </Link>
                        </span>
                    </p>
                </div>
            </div>
            <AuthImage />
        </div>
    )
}
