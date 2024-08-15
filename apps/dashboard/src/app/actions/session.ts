'use server';

import { PrismaClient } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { SessionFormData } from '@components/Calendar/session-form';

const prisma = new PrismaClient();

export const addSession = async (data: SessionFormData) => {
  await prisma.session.create({
    data,
  });

  revalidatePath('/');
};
