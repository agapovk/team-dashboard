"use server";

import { PrismaClient } from "@repo/db";
import { revalidatePath } from "next/cache";
import { AthleteFormData } from "../players/components/athlete-form";

const prisma = new PrismaClient();

// export const addAthlete = async (formData: FormData) => {
//   const name = formData.get("name");
//   await prisma.athlete.create({
//     data: {
//       // Generate id?
//       id: 1234,
//       name: name as string,
//     },
//   });

//   revalidatePath("/");
// };

export const updateAthlete = async (id: number, data: AthleteFormData) => {
  await prisma.athlete.update({
    where: { id: id },
    data: {
      ...data,
    },
  });

  revalidatePath("/players");
};
