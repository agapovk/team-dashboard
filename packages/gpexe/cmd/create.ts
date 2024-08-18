import * as fs from 'node:fs'
// import { Semaphore } from "../src/async/semaphore";
import { athses, dbAth, dbSes } from '../src/mapper'
import prisma from '@repo/db'
import { Semaphore } from '../src/async/semaphore'

const create = async () => {
  const semaphore = Semaphore(8)

  // Find all session-details
  const session = await fs.promises.readdir(`./temp_data/sessions`)
  const details = await fs.promises.readdir(`./temp_data/details`)

  console.log(`Session folder has ${session.length} files`)
  console.log(`Details folder has ${details.length} files`)
  console.log('Check DB')

  details.forEach(async (file) => {
    const data = await fs.promises.readFile(
      `./temp_data/details/${file}`,
      'utf-8'
    )

    // Get session details data
    const details: GpexeDetails = JSON.parse(data)

    const sessionData = await fs.promises.readFile(
      `./temp_data/sessions/session-${details.teamsession}.json`,
      'utf-8'
    )

    // Get session data
    const session: GpexeTrainingSession = JSON.parse(sessionData)

    //Find this session in db
    const s = await prisma.session.findUnique({
      where: { id: session.id },
    })
    // If session not in db -> create
    if (s === null) {
      console.log(`creating session ${session.id}`)
      await prisma.session.create({
        data: {
          ...dbSes(session, details.team.parameters),
        },
      })
    }

    // Get players session data from session
    const athleteSession = Object.values(details.players)

    // For each plaeyer session data
    athleteSession.forEach(async (oneAthSes) => {
      const mapped = athses(oneAthSes.athlete_session_id, oneAthSes)

      // semaphore.acquire();

      // Find this player in db
      try {
        const a = await prisma.athlete.findUnique({
          where: {
            id: oneAthSes.athlete.id,
          },
        })
        // If player not in db -> create
        if (a === null) {
          console.log('creating athlete: ' + oneAthSes.athlete.name)
          await prisma.athlete.create({
            data: {
              ...dbAth(oneAthSes.athlete),
            },
          })
        }
      } catch (error) {
        console.log('ATHLETE ERROR')
      }

      // Find this player session in db
      try {
        const as = await prisma.athlete_session.findUnique({
          where: {
            id: mapped.id,
          },
        })

        //If player session not in db -> create
        if (as === null) {
          console.log('creating athlete session ' + mapped.id)
          await prisma.athlete_session.create({
            data: {
              ...mapped,
              athlete_id: oneAthSes.athlete.id,
              session_id: details.teamsession,
            },
          })
        }
      } catch (error) {
        console.log(s?.id + ' ATHLETE SESSION ERROR')
      }

      semaphore.release()
    })
  })

  // console.log('DB updated!');
}

export default create
