'use server'

import prisma from '@/lib/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { decode } from 'next-auth/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { lichessUsername, chesscomUsername }  = req.body

    if (lichessUsername !== undefined) {
    const response = await fetch(`https://lichess.org/api/users/status?ids=${lichessUsername}`)

    const data = await response.json()

    if (data.length === 0) {
      res.status(404).json({ success: false })
      return
    }
    res
      .status(200)
      .json({ success: true })
    } else if (chesscomUsername !== undefined) {

      const response = await fetch(`https://www.chess.com/member/${chesscomUsername}`)
      const data = await response.text()
      if (data.includes('Page not found')) {
        res.status(404).json({ success: false })
        return
      }

      res
        .status(200)
        .json({ success: true })
    }
  } else if (req.method === 'PUT') {
    const sessionToken = req.cookies['next-auth.session-token']

    const decodedUser = await decode({
      token: sessionToken,
      secret: process.env.NEXTAUTH_SECRET!,
    })

    if (!decodedUser || !decodedUser.email) {
      res.status(403).json({ success: false })
      return
    }

    const { lichessUsername, chesscomUsername }  = req.body

    if (lichessUsername === undefined && chesscomUsername === undefined) {
      res.status(400).json({ success: false })
      return
    }

    // model ChessAccount {
    //   id        String   @id @default(cuid())
    //   userId    String   @unique
    //   provider  String
    //   username  String
    //   rating    Int?
    //   fetchTime DateTime?
    
    //   gamesAsWhite Game[] @relation("WhiteChessAccount")
    //   gamesAsBlack Game[] @relation("BlackChessAccount")
    
    //   user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    
    //   @@unique([provider, username])
    // }

    const user = await prisma.user.findUnique({
      where: {
        email: decodedUser.email,
      },
    })

    if (!user) {
      res.status(403).json({ success: false })
      return
    }
    
    if (lichessUsername !== undefined) {
      await prisma.chessAccount.create({
        data: {
          provider: 'lichess',
          username: lichessUsername,
          userId: user.id
        },
      })
      }

    
    res.status(200).json({ success: true })
  } else {
    res.status(400).json({ success: false })
  }
}
