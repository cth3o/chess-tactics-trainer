'use server'

import { CloudTasksClient } from '@google-cloud/tasks'

import fs from 'fs'
import prisma from './database'

const serviceAccountEmail = JSON.parse(
  fs.readFileSync(process.env.GCP_SERVICE_ACCOUNT!,
  'utf-8'
)).client_email

const cloudTaskClient = new CloudTasksClient({
  keyFilename: process.env.GCP_SERVICE_ACCOUNT
})

export const createLichessSynchonizerTask = async (accountId: string) => { 
  await prisma.chessAccount.update({
    where: {
      id: accountId
    },
    data: {
      isFetching: true
    }
  })
   
  const project = process.env.GCP_PROJECT_ID!
  const location = process.env.GCP_LOCATION!
  const queue = process.env.GCP_LICHESS_SYNCHRONIZER_QUEUE!
  const url = process.env.GCP_LICHESS_SYNCHRONIZER_URL

  const parent = cloudTaskClient.queuePath(project, location, queue)

  const [response] = await cloudTaskClient.createTask(
    {
      parent,
      task: {
        httpRequest: {
          httpMethod: 'POST',
          url,
          body: Buffer.from(JSON.stringify({ accountId })).toString('base64'),
          headers: {
            'Content-Type': 'application/json',
          },
          oidcToken: {
            serviceAccountEmail,
          }
        },
      },
    }
  )

  console.log(`Created task ${response.name}`)
}

export const createChesscomTask = async (accountId: string) => {
  await prisma.chessAccount.update({
    where: {
      id: accountId
    },
    data: {
      isFetching: true
    }
  })

  const project = process.env.GCP_PROJECT_ID!
  const location = process.env.GCP_LOCATION!
  const queue = process.env.GCP_CHESSCOM_SYNCHRONIZER_QUEUE!
  const url = process.env.GCP_CHESSCOM_SYNCHRONIZER_URL

  const parent = cloudTaskClient.queuePath(project, location, queue)

  const [response] = await cloudTaskClient.createTask(
    {
      parent,
      task: {
        httpRequest: {
          httpMethod: 'POST',
          url,
          body: Buffer.from(JSON.stringify({ accountId })).toString('base64'),
          headers: {
            'Content-Type': 'application/json',
          },
          oidcToken: {
            serviceAccountEmail,
          }
        },
      },
    }
  )

  console.log(`Created task ${response.name}`)
}

export const createChessAnalysisTask = async (gameId: string) => {
  const project = process.env.GCP_PROJECT_ID!
  const location = process.env.GCP_LOCATION!
  const queue = process.env.GCP_CHESS_ANALYSIS_QUEUE!
  const url = process.env.GCP_CHESS_ANALYSIS_URL

  const parent = cloudTaskClient.queuePath(project, location, queue)

  const [response] = await cloudTaskClient.createTask(
    {
      parent,
      task: {
        httpRequest: {
          httpMethod: 'POST',
          url,
          body: Buffer.from(JSON.stringify(
            { 
              gameId,
              engine: 'stockfish',
              forceAnalysis: false,
              depth: 15,
              movetime: 400,
              multipv: 1,
              skillLevel: 20,
              threads: 1,
              hash: 128,
            })).toString('base64'),
          headers: {
            'Content-Type': 'application/json',
          },
          oidcToken: {
            serviceAccountEmail,
          }
        },
      },
    }
  )

  console.log(`Created task ${response.name}`)
}