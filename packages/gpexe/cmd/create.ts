import * as fs from 'node:fs'
import prisma from '@repo/db'

import { Semaphore } from '../src/async/semaphore'
import { athses, dbAth, dbSes } from '../src/mapper'

export default async function create() {
  const semaphore = Semaphore(8)

  // Create session in db
  const localDetails: GpexeDetails[] = await getLocalData('details')

  localDetails.forEach(async (detail) => {
    const currentSession: GpexeTrainingSession = JSON.parse(
      await fs.promises.readFile(
        `./temp_data/sessions/session-${detail.teamsession}.json`,
        'utf-8'
      )
    )
    const dbSesion = await prisma.session.findUnique({
      where: { gpexe_id: currentSession.id },
    })
    if (!dbSesion) {
      await prisma.session.create({
        data: {
          ...dbSes(currentSession, detail.team.parameters),
        },
      })
      console.log(`creating session ${currentSession.id} in db`)
    }
  })

  // Create athlete in db
  const athletes = await getLocalData('athletes')

  athletes.forEach(async (athlete) => {
    const dbAthlete = await prisma.athlete.findUnique({
      where: { gpexe_id: athlete.id },
    })
    if (!dbAthlete) {
      await prisma.athlete.create({
        data: {
          ...dbAth(athlete),
        },
      })
      console.log('creating athlete: ' + athlete.name)
    }
  })

  // Create athlete_sesions in db
  localDetails.forEach(async (detail) => {
    semaphore.acquire()

    const athleteSessions: GpexeAthleteTrainingSession[] = Object.values(
      detail.players
    )
    const dbSessionId = await prisma.session.findUnique({
      where: { gpexe_id: detail.teamsession },
      select: { id: true },
    })

    athleteSessions.forEach(async (athSes) => {
      const { id, ...athlete_session } = athses(
        athSes.athlete_session_id,
        athSes
      )

      const dbAthleteId = await prisma.athlete.findUnique({
        where: { gpexe_id: athSes.athlete.id },
        select: { id: true },
      })

      const dbAthleteSession = await prisma.athlete_session.findUnique({
        where: {
          gpexe_id: id,
        },
      })

      if (!dbAthleteSession && dbAthleteId && dbSessionId) {
        await prisma.athlete_session.create({
          data: {
            ...athlete_session,
            gpexe_id: id,
            athlete_id: dbAthleteId.id,
            session_id: dbSessionId.id,
            start_timestamp: new Date(detail.start_timestamp),
          },
        })
        console.log('creating athlete session ' + id)
      }
    })

    semaphore.release()
  })
}

export async function getLocalData(type: 'sessions' | 'details' | 'athletes') {
  const files = await fs.promises.readdir(`./temp_data/${type}`)
  const result = []

  for await (const file of files) {
    if (file.slice(-4) !== 'json')
      console.log(`Wrong file [${file}] in directory`)
    else {
      const data = await fs.promises.readFile(
        `./temp_data/${type}/${file}`,
        'utf8'
      )
      result.push(JSON.parse(data))
    }
  }

  return result
}
