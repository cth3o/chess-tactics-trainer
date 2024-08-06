'use server'

import { CloudTasksClient } from '@google-cloud/tasks'
import fs from 'fs'

const serviceAccountEmail = JSON.parse(
  fs.readFileSync(process.env.GCP_SERVICE_ACCOUNT!,
  'utf-8'
)).client_email

const cloudTaskClient = new CloudTasksClient({
  keyFilename: process.env.GCP_SERVICE_ACCOUNT
})

export const createLichessSynchonizerTask = async (accountId: string) => {  
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
