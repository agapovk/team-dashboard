'use server'

import { revalidatePath } from 'next/cache'
import { InjuryFormData } from '@dashboard/injury/components/injury-form'
import prisma from '@repo/db'

export const updateInjury = async (id: string, data: InjuryFormData) => {
  const result = await prisma.injury.update({
    where: { id: id },
    data,
  })

  revalidatePath('/injury')
  return result
}
