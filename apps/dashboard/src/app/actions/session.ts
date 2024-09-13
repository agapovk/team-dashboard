'use server'

import { revalidatePath } from 'next/cache'
import { SessionFormData } from '@components/Calendar/session-form'
import prisma from '@repo/db'
import { v4 as uuidv4 } from 'uuid'

export const addSession = async ({ athletes, ...data }: SessionFormData) => {
  const result = await prisma.session.create({
    data: {
      id: uuidv4(),
      ...data,
      athlete_sessions: {
        create: athletes,
      },
    },
  })

  revalidatePath('/')
  return result
}

export const deleteSession = async (id: string) => {
  try {
    await prisma.athlete_session.deleteMany({
      where: {
        session_id: id,
      },
    })

    await prisma.session.delete({
      where: {
        id: id,
      },
    })
  } catch (error) {
    console.log(error)
  }

  revalidatePath('/')
}
