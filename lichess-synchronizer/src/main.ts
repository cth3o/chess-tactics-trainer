import prisma from './prisma'

export const updateLichessAccount = async (accountId: string) => {
    console.log('Updating lichess account', accountId)
    const account = await prisma.chessAccount.findUnique({
      where: {
        id: accountId
      }
    })
  
    if (!account) {
      console.log('Account not found')
      return null
    }
  
    await prisma.chessAccount.update({
      where: {
        id: accountId
      },
      data: {
        isFetching: true
      }
    })
  
    console.log('Fetching lichess games for', account.username)
  
    const response = await fetch(
      `https://lichess.org/api/games/user/${account.username.trim()}?clocks=true&opening=true&max=100`,
      {
        headers: {
          Accept: 'application/x-ndjson'
        }
      }
    )
    const responseText = await response.text()
    const games = (responseText.match(/.+/g) ?? []).map((text) =>
      JSON.parse(text)
    )
  
    for (const game of games) {
      console.log('Creating game', game.id)
  
      const gameExist = await prisma.game.findUnique({
        where: {
          id: game.id
        }
      })
  
      if (gameExist) {
        if ((gameExist.whiteChessAccountId === accountId || gameExist.blackChessAccountId === accountId)) {
          console.log('Game already exists for the account', account.username)
        }
        else {
          if (gameExist.whiteChessAccountId) {
            await prisma.game.update({
              where: {
                id: game.id
              },
              data: {
                blackChessAccountId: accountId
              }
            })
          } else {
            await prisma.game.update({
              where: {
                id: game.id
              },
              data: {
                whiteChessAccountId: accountId
              }
            })
          }
        }
        continue
      }
  
      const whitePlayer = game.players.white
      const blackPlayer = game.players.black
  
      if (!whitePlayer?.user || !blackPlayer?.user) {
        console.log('Skipping game', game.id)
        continue
      }
  
      await prisma.game.create({
        data: {
          id: game.id,
          pgn: game.moves,
          whitePlayer: whitePlayer.user.id,
          whiteChessAccountId:
            whitePlayer.user.id === account.username ? accountId : null,
          whiteRating: whitePlayer.rating,
          blackPlayer: blackPlayer.user.id,
          blackChessAccountId:
            blackPlayer.user.id === account.username ? accountId : null,
          blackRating: blackPlayer.rating,
          winner: game.winner || 'draw',
          status: game.status,
          rated: game.rated,
          category: game.speed,
          clocks: game.clocks,
          opening: game.opening.name,
          date: new Date(game.createdAt)
        }
      })
      console.log('Game created')
    }
  
    await prisma.chessAccount.update({
      where: {
        id: accountId
      },
      data: {
        lastFetch: new Date(),
        isFetching: false
      }
    })
  
    return games
  }
  