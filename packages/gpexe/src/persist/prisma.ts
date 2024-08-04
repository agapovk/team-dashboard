import { PrismaClient } from "@repo/db";
import { date } from "../fetch/date";

const prisma = new PrismaClient();

export const createAthlete = async (athlete: GpexeAthlete) => {
  return await prisma.athlete.create({
    data: {
      id: athlete.id,
      name: athlete.name,
      short_name: athlete.short_name,
    },
  });
};

export const createSession = async (session: GpexeTrainingSession) => {
  return await prisma.session.create({
    data: {
      id: session.id,
      team_id: session.team,
      name: session.name,
      start_timestamp: date(session.start_timestamp),
      end_timestamp: date(session.end_timestamp),
    },
  });
};

export const createAthleteSession = async (
  session: GpexeAthleteTrainingSession,
) => {
  // return await prisma.session.create({
  //   data: {
  //     id: session.id,
  //     team_id: session.team,
  //     name: session.name,
  //     start_timestamp: date(session.start_timestamp),
  //     end_timestamp: date(session.end_timestamp),
  //   },
  // });
};

export const usePrisma = (call: (p: PrismaClient) => Promise<void>) => {
  call(prisma)
    .then(async () => {
      console.log("Finished");
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
};

export const callPrisma = (method: () => Promise<any>) => {
  method()
    .then(async () => {
      console.log("Finished");
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
};
