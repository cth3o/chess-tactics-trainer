import React from 'react'
import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Chess Tactics Manager',
  description: `Chess Tactics Manager is an open-source web application designed 
  for training and analyzing chess tactics. 
  This application provides a unified platform to track and improve your chess skills by integrating game data 
  from popular chess platforms such as Lichess.org and Chess.com.`
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='min-h-screen overflow-x-hidden flex flex-col font-sans dark antialiased bg-background'>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
