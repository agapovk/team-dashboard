'use server'

import { revalidatePath } from 'next/cache'
import { SessionFormData } from '@components/Calendar/session-form'
import prisma from '@repo/db'
import { v4 as uuidv4 } from 'uuid'

export const addSession = async ({ athletes, ...data }: SessionFormData) => {
  await prisma.session.create({
    data: {
      id: uuidv4(),
      ...data,
      athlete_sessions: {
        create: athletes,
      },
    },
  })

  revalidatePath('/')
}
