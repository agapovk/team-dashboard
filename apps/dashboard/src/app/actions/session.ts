'use server'

import { revalidatePath } from 'next/cache'
import { SessionFormData } from '@components/Calendar/session-form'
import prisma from '@repo/db'

export const addSession = async (data: SessionFormData) => {
  await prisma.session.create({
    data,
  })

  revalidatePath('/')
}
