// fetcher
import * as dotenv from 'dotenv'

dotenv.config()

type GpexeTrainingSession = {
  id: number
  team: number
  name: string
  start_timestamp: string
  end_timestamp: string
  category_name: string
  notes: string
  total_time: number
  n_tracks: number
}

const myHeaders = new Headers()
myHeaders.append('Authorization', process.env.TOKEN || '')
// myHeaders.append("Cookie", process.env.COOKIE || "");

// Get athletes
export const getAthletes = async () => {
  const response = await fetch('https://server11.gpexe.com/api/athlete', {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  })

  return response.json()
}

// Get sessions
// TODO: метод для скачивания ВСЕХ тренировок (несколько страниц). Возможно придется склеивать
export const getSessions = async (options: { limit: number }) => {
  const response = await fetch(
    `https://server11.gpexe.com/api/team_session?type=session&${
      options.limit && `limit=${options.limit}`
    }`,
    {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
  )
  return response.json() as Promise<GpexeTrainingSession[]>
}

// Get session details
export const getSessionDetails = async (id: number) => {
  const response = await fetch(
    `https://server11.gpexe.com/api/team_session/${id}/details`,
    {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    }
  )

  return response.json()
}
