'use server'

import { revalidatePath } from 'next/cache'
import { GameFormData } from '@components/Calendar/game-form'
import prisma from '@repo/db'
import { v4 as uuidv4 } from 'uuid'

export const addGame = async (data: GameFormData) => {
  await prisma.game.create({
    data: {
      id: uuidv4(),
      ...data,
    },
  })

  revalidatePath('/')
}

// export const deleteGame = async (id: string) => {
//   try {
//     const as = await prisma.athlete_session.deleteMany({
//       where: {
//         session_id: id,
//       },
//     })

//     const s = await prisma.session.delete({
//       where: {
//         id: id,
//       },
//     })
//     console.log(as, s)
//   } catch (error) {
//     console.log(error)
//   }

//   revalidatePath('/')
// }
