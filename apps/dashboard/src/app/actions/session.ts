'use server'
import prisma from '@repo/db'
import { revalidatePath } from 'next/cache'
import { SessionFormData } from '@components/Calendar/session-form'

export const addSession = async (data: SessionFormData) => {
  await prisma.session.create({
    data,
  })

  revalidatePath('/')
}
