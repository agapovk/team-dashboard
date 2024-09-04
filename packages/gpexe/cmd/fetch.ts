import * as fs from 'node:fs'
import { athlete, athlete_session } from '@repo/db'

import { getSessionDetails, getSessions } from '../src/fetch'
import { getLocalData } from './create'

const fetch = async ({ all }: { all: boolean }) => {
  const limit = all ? 10000 : 10

  // Create folders if needed
  await fs.promises.mkdir('./temp_data/sessions', { recursive: true })
  await fs.promises.mkdir('./temp_data/details', { recursive: true })
  await fs.promises.mkdir('./temp_data/athletes', { recursive: true })

  // Check existing sessions
  const existingSessionFiles = await fs.promises.readdir(`./temp_data/sessions`)
  const existingSessions: number[] = []
  const existingDetailsFiles = await fs.promises.readdir(`./temp_data/details`)
  const existingDetails: number[] = []

  for await (const file of existingSessionFiles) {
    // Get team session data
    if (file.slice(0, 7) !== 'session')
      console.log(`Wrong file [${file}] in sessions directory`)
    else {
      const data_session = await fs.promises.readFile(
        `./temp_data/sessions/${file}`,
        'utf8'
      )
      const session = JSON.parse(data_session)
      existingSessions.push(session.id)
    }
  }

  for await (const file of existingDetailsFiles) {
    // Get details data
    if (file.slice(0, 7) !== 'details')
      console.log(`Wrong file [${file}] in details directory`)
    else {
      const data_details = await fs.promises.readFile(
        `./temp_data/details/${file}`,
        'utf8'
      )
      const details = JSON.parse(data_details)
      existingDetails.push(details.teamsession)
    }
  }

  // Get new sessions
  console.log(`Fetching last ${limit} sessions from server...`)
  console.time('Fetch time')
  const sessions = await getSessions({ limit })
  console.timeEnd('Fetch time')

  for (const session of sessions) {
    // Download only new sessions
    const id = session.id
    if (!existingSessions.includes(id)) {
      // Create local session
      console.time(`[local] Session ${id} have been saved!`)
      await fs.promises.writeFile(
        `./temp_data/sessions/session-${session.id}.json`,
        JSON.stringify(session)
      )
      console.timeEnd(`[local] Session ${id} have been saved!`)
    }

    if (!existingDetails.includes(id)) {
      // Create local session-details
      console.time(`[local] Details ${id} have been saved!`)
      const details = await getSessionDetails(id)
      const detailsWithDate = {
        ...details,
        start_timestamp: session.start_timestamp,
      }
      await fs.promises.writeFile(
        `./temp_data/details/details-${details.teamsession}.json`,
        JSON.stringify(detailsWithDate)
      )
      console.timeEnd(`[local] Details ${id} have been saved!`)
    }
  }

  // Find all athletes
  const localDetails: GpexeDetails[] = await getLocalData('details')
  let athletes: GpexeAthlete[] = []

  localDetails.forEach((detail) => {
    const athleteSession = Object.values(detail.players)
    athleteSession.forEach(async (athSes) => {
      const allAthletesInDetails = athletes.find(
        (athlete) => `${athlete.id}` === `${athSes.athlete.id}`
      )
      if (!allAthletesInDetails) athletes.push(athSes.athlete)
    })
  })
  const localAthletes: athlete[] = await getLocalData('athletes')
  localAthletes.forEach((athlete) => {
    athletes = athletes.filter((a) => `${a.id}` !== `${athlete.id}`)
  })

  // Create local athletes
  athletes.forEach(async (athlete) => {
    await fs.promises.writeFile(
      `./temp_data/athletes/athlete-${athlete.id}.json`,
      JSON.stringify(athlete)
    )
    console.log(`[local] Athlete ${athlete.last_name} created`)
  })
}

export default fetch
