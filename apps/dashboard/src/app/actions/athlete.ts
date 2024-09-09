'use server'

import { revalidatePath } from 'next/cache'
import { AthleteFormData } from '@dashboard/players/components/athlete-form'
import prisma from '@repo/db'

export const updateAthlete = async (id: string, data: AthleteFormData) => {
  await prisma.athlete.update({
    where: { id: id },
    data,
  })

  revalidatePath('/players')
}
