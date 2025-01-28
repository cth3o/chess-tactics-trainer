import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import * as React from 'react'
import config from '../tailwind.config'

interface ResetPasswordEmailProps {
  resetEmail?: string
  resetPasswordLink?: string
  resetFromIp?: string
  resetFromLocation?: string
}

const baseUrl = process.env.NEXT_APP_URL ?? 'http://localhost:3000/static'

export const ResetPasswordEmail = ({
  resetEmail,
  resetPasswordLink,
  resetFromIp,
  resetFromLocation,
}: ResetPasswordEmailProps) => {
  const previewText = `Reset password`

  return (
    <Html>
      <Head />
      <Preview>
        {previewText}
      </Preview>
      <Tailwind config={config}>
        <Body className='px-2 m-auto font-sans bg-background'>
          <Container className={`mx-auto my-[40px] max-w-[465px] rounded border border-y-0 border-l-6
            border-r-0 border-solid border-active bg-foreground p-[20px]`}>
            <Section className='mt-[32px]'>
              <Img
                src={`${baseUrl}/ctm-logo.png`}
                width='65'
                height='65'
                alt='ctm-logo'
                className='mx-auto my-0'
              />
            </Section>
            <Text className='text-[14px] leading-[24px] text-white'>
              Hello chess player,
            </Text>
            <Text className='text-[14px] leading-[24px] text-white'>
              Someone recently requested a password change for your account.
              If this was you, you can set a new password here:
            </Text>
            <Section className='my-[32px] text-center'>
              <Button
                className='rounded bg-primary px-5 py-3 text-center text-[12px] font-semibold text-white no-underline'
                href={resetPasswordLink}
              >
                Reset password
              </Button>
            </Section>
            <Text className='text-[14px] leading-[24px] text-white'>
              or copy and paste this URL into your browser:
              {' '}
              <Link href={resetPasswordLink} className='text-blue-600 no-underline'>
                {resetPasswordLink}
              </Link>
            </Text>
            <Hr className='mx-0 my-[26px] w-full border border-solid border-[#eaeaea]' />
            <Text className='text-[12px] leading-[24px] text-[#666666]'>
              This invitation was intended for
              {' '}
              <span className='text-white'>
                {resetEmail}
              </span>
              {`. This invite was sent from `}
              <span className='text-white'>
                {resetFromIp}
              </span>
              {` on `}
              <span className='text-white'>
                {resetFromLocation}
              </span>
              . If you were not expecting this invitation, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPasswordEmail.PreviewProps = {
  resetEmail: 'me@example.com',
  resetPasswordLink: 'http://localhost:3000/reset-password?token=123',
  resetFromIp: 'XXX.XXX.XXX.XXX',
  resetFromLocation: 'Paris, France',
} as ResetPasswordEmailProps

export default ResetPasswordEmail
