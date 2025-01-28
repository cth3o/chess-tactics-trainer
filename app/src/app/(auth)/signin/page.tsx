import { AuthImage } from '@/components/auth/auth-image'
import { FacebookButton } from '@/components/auth/facebook-button'
import { GoogleButton } from '@/components/auth/google-button'
import { SigninForm } from '@/app/(auth)/signin/signin.form'
import { Separator } from '@/components/ui/separator'
import { checkNotAuthenticatedOrRedirect } from '@/lib/authentication'
import Link from 'next/link'

export default async function SignInPage() {
    await checkNotAuthenticatedOrRedirect()

    return (
        <div className='flex items-center justify-center w-full min-h-screen text-white border-none bg-foreground'>
            <AuthImage />
            <div className='flex flex-col items-center justify-around w-full lg:w-5/12'>
                <h1 className='pb-2 mb-10 text-4xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0'>
                    Chess Tactics Manager
                </h1>
                <div className='w-3/4 text-left md:w-1/2'>
                    <SigninForm />
                    <Separator className='my-12 bg-secondary' />
                    <div className='flex flex-col items-center justify-center gap-2'>
                            <GoogleButton />
                            <FacebookButton />
                        <p className='mt-10 text-sm'>
                            Don’t have an account?
                            <span className='ml-1 text-active hover:underline'>
                                <Link href='/signup'>
                                    Sign up now
                                </Link>
                            </span>
                        </p>
                    </div>
                    <div className='mt-5 text-center'>
                        <p className='mt-10 text-xs'>
                            © Chess Tactics Manager 2024
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
