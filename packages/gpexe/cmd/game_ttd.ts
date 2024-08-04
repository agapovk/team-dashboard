import * as fs from "node:fs";

import { PrismaClient } from "@repo/db";

const prisma = new PrismaClient();

type ttdRawData = {
  date: string;
  time: string;
  vs: string;
  competition: string;
  result: string;
  home: boolean;
  game_id: string;
  number: string | number;
  player: string;
  position: string;
  minutesPlayed: number;
  goals: number;
  assists: number;
  keyPasses: number;
  keyPassesSuccess: number;
  keyPassesSuccess_pct: string;
  shoots: number;
  shoots_OnTarget: number;
  shoots_OnTarget_pct: string;
  xG: string;
  fouls: number;
  foulsOnPlayer: number;
  offside: number;
  yellowCards: number;
  redCards: number;
  actions: number;
  actionsSuccess: number;
  actionsSuccess_pct: string;
  actionsInsideBox: number;
  chances: number;
  chancesSuccess: number;
  chancesSuccess_pct: string;
  lostBalls: number;
  lostBalls_OwnHalf: number;
  ballRecoveries: number;
  ballRecoveries_OppositeHalf: number;
  badBallControl: number;
  passes: number;
  passesSuccess: number;
  passesSuccess_pct: string;
  passForward: number;
  passForwardSuccess: number;
  passForwardSuccess_pct: string;
  passBack: number;
  passBackSuccess: number;
  passBackSuccess_pct: string;
  passLong: number;
  passLongSuccess: number;
  passLongSuccess_pct: string;
  passShorMedium: number;
  passShorMediumSuccess: number;
  passShorMediumSuccess_pct: string;
  passInsideFinalThird: number;
  passInsideFinalThirdSuccess: number;
  passInsideFinalThirdSuccess_pct: string;
  passInsideBox: number;
  passInsideBoxSuccess: number;
  passInsideBoxSuccess_pct: string;
  crosses: number;
  crossesSuccess: number;
  crossesSuccess_pct: string;
  shotAssists: number;
  shotAssistsSuccess: number;
  shotAssistsSuccess_pct: string;
  passesReceived: number;
  passesReceivedInsideBox: number;
  challenges: number;
  challengesSuccess: number;
  challengesSuccess_pct: string;
  aerialDuels: number;
  aerialDuelsSuccess: number;
  aerialDuelsSuccess_pct: string;
  challengesInDefence: number;
  challengesInDefenceSuccess: number;
  challengesInDefenceSuccess_pct: string;
  challengesInAttack: number;
  challengesInAttackSuccess: number;
  challengesInAttackSuccess_pct: string;
  dribbles: number;
  dribblesSuccess: number;
  dribblesSuccess_pct: string;
  tackles: number;
  tacklesSuccess: number;
  tacklesSuccess_pct: string;
  interceptions: number;
  freeKick: number;
  freeKickShoots: number;
  freeKickShootsOnTarget: number;
  freeKickShootsOnTarget_pct: string;
  corners: number;
  throwIns: number;
  throwInSuccess: number;
  throwInSuccess_pct: string;
};

// type fitnessRawData = {
//   name: string;
//   number: string | number;
//   minutes: string | number;
//   total_distance: string;
//   speedzone4_distance: string;
//   speedzone5_distance: string;
//   avg_speed: string;
//   date: string;
//   time: string;
//   vs: string;
//   competition: string;
//   result: string;
//   home: boolean | string;
//   game_id: string;
// };

const strToFloatNumber = (str: string | undefined): number => {
  if (!str) return 0;
  const newStr = str.replace(",", ".");
  return parseFloat(newStr);
};

const gameTtd = async () => {
  // const fitness_files = await fs.promises.readdir(`./temp_data/games/fitness`);
  const ttd_files = await fs.promises.readdir(`./temp_data/games/ttd`);
  const games = await prisma.game.findMany({
    include: {
      athlete_fitness: true,
      athlete_ttd: true,
    },
  });
  const athletes = await prisma.athlete.findMany();
  const findAthlete = (number: number) =>
    athletes.find((athlete) => athlete.number === number);
  const findGame = (id: string) => games.find((game) => game.id === id);

  ttd_files.forEach(async (file) => {
    const fileName = file.replace(".json", "");
    const file_data = await fs.promises.readFile(
      `./temp_data/games/ttd/${file}`,
      "utf-8",
    );
    const ttd_data: ttdRawData[] = JSON.parse(file_data);
    const team_ttdRaw = ttd_data.find((ttd) => ttd.number === "team");
    const {
      date,
      time,
      home,
      game_id,
      xG,
      number,
      player,
      position,
      ...restData
    } = {
      ...team_ttdRaw,
    };
    const team_ttd_data = {
      date: new Date(`${date}T${time}`),
      home: team_ttdRaw?.home === true,
      xG: strToFloatNumber(xG),
      ...restData,
    };

    const athlete_ttd_data = ttd_data
      .filter((player) => typeof player.number === "number")
      .map(
        ({
          date,
          time,
          vs,
          competition,
          result,
          home,
          game_id,
          player,
          position,
          xG,
          number,
          ...player_data
        }) => {
          return {
            athlete_id: findAthlete(Number(number))?.id,
            number: Number(number),
            xG: strToFloatNumber(xG),
            ...player_data,
          };
        },
      );

    // if game with id(fileName) already exists ? fill the ttd data : create a new game with ttd data
    if (games.find((game) => game.id === fileName)) {
      // cheack the ttd data filled
      if (
        typeof findGame(fileName)?.goals === "number" &&
        findGame(fileName)?.athlete_ttd.length === athlete_ttd_data.length
      ) {
        console.log(`Game ${findGame(fileName)?.id} ttd data already filled`);
        return;
      } else {
        // fill the ttd data
        try {
          const updateGame = await prisma.game.update({
            where: {
              id: fileName,
            },
            data: {
              xG: strToFloatNumber(xG),
              ...restData,
              athlete_ttd: {
                create: athlete_ttd_data,
              },
            },
          });
          console.log(`Game ${updateGame.id} updated with ttd`);
        } catch (error) {
          console.log(error);
        }
        return;
      }
    } else {
      // check game_id
      if (game_id && findGame(game_id)) {
        console.log(`Game ${game_id} already created`);
        try {
          const updateGame = await prisma.game.update({
            where: {
              id: game_id,
            },
            data: {
              xG: strToFloatNumber(xG),
              ...restData,
              athlete_ttd: {
                create: [...athlete_ttd_data],
              },
            },
          });
          console.log(`Game ${updateGame.id} updated with ttd`);
        } catch (error) {
          console.log(error);
        }
        await fs.promises.rename(
          `./temp_data/games/ttd/${file}`,
          `./temp_data/games/ttd/${game_id}.json`,
        );
        return;
      } else {
        // // create a new game with ttd data
        try {
          const createdGame = await prisma.game.create({
            data: {
              ...team_ttd_data,
              athlete_ttd: {
                create: [...athlete_ttd_data],
              },
            },
          });

          console.log(`Game with ttd${createdGame.id} created`);
          await fs.promises.rename(
            `./temp_data/games/ttd/${file}`,
            `./temp_data/games/ttd/${createdGame.id}.json`,
          );
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  // fitness_files.forEach(async (file) => {
  //   const fileName = file.replace('.json', '');
  //   const file_data = await fs.promises.readFile(`./temp_data/games/fitness/${file}`, 'utf-8');

  //   const fitness_data: fitnessRawData[] = JSON.parse(file_data);
  //   const team_fitnessRaw = fitness_data.find((game) => game.number === 'team');
  //   const {
  //     date,
  //     time,
  //     vs,
  //     competition,
  //     result,
  //     home,
  //     total_distance,
  //     speedzone4_distance,
  //     speedzone5_distance,
  //     avg_speed,
  //     game_id,
  //   } = { ...team_fitnessRaw };

  //   const team_fitness_data = {
  //     date: new Date(`${date}T${time}`),
  //     vs: vs ? vs : '',
  //     competition: competition ? competition : '',
  //     result: result ? result : '',
  //     home: home === true,
  //     total_distance: strToFloatNumber(total_distance),
  //     speedzone4_distance: strToFloatNumber(speedzone4_distance),
  //     speedzone5_distance: strToFloatNumber(speedzone5_distance),
  //     avg_speed: strToFloatNumber(avg_speed),
  //   };

  //   const athlete_fitness_data = fitness_data
  //     .filter((player) => typeof player.number === 'number')
  //     .map(
  //       ({
  //         number,
  //         minutes,
  //         total_distance,
  //         speedzone4_distance,
  //         speedzone5_distance,
  //         avg_speed,
  //       }) => {
  //         return {
  //           athlete_id: findAthlete(Number(number))?.id,
  //           number: Number(number),
  //           minutes: Number(minutes),
  //           total_distance: strToFloatNumber(total_distance),
  //           speedzone4_distance: strToFloatNumber(speedzone4_distance),
  //           speedzone5_distance: strToFloatNumber(speedzone5_distance),
  //           avg_speed: strToFloatNumber(avg_speed),
  //         };
  //       },
  //     );

  //   // if game with id(fileName) already exists ? fill the fitness data : create a new game with fitness data
  //   if (games.find((game) => game.id === fileName)) {
  //     // cheack the fitness data filled
  //     if (
  //       typeof findGame(fileName)?.total_distance === 'number' &&
  //       findGame(fileName)?.athlete_fitness.length === athlete_fitness_data.length
  //     ) {
  //       console.log(`Game ${findGame(fileName)?.id} fitness data already filled`);
  //       return;
  //     } else {
  //       // fill the fitness data
  //       try {
  //         const updateGame = await prisma.game.update({
  //           where: {
  //             id: fileName,
  //           },
  //           data: {
  //             ...team_fitness_data,
  //             athlete_fitness: {
  //               create: athlete_fitness_data,
  //             },
  //           },
  //         });
  //         console.log(`Game ${updateGame?.id} updated with fitness`);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   } else {
  //     // check game_id
  //     if (game_id && findGame(game_id)) {
  //       console.log(`Game ${game_id} already created`);
  //       await fs.promises.rename(
  //         `./temp_data/games/fitness/${file}`,
  //         `./temp_data/games/fitness/${game_id}.json`,
  //       );
  //       try {
  //         const updateGame = await prisma.game.update({
  //           where: {
  //             id: fileName,
  //           },
  //           data: {
  //             ...team_fitness_data,
  //             athlete_fitness: {
  //               create: athlete_fitness_data,
  //             },
  //           },
  //         });
  //         console.log(`Game ${updateGame?.id} updated with fitness`);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //       return;
  //     } else {
  //       // create a new game with fitness data
  //       try {
  //         const createdGame = await prisma.game.create({
  //           data: {
  //             ...team_fitness_data,
  //             athlete_fitness: {
  //               create: athlete_fitness_data,
  //             },
  //           },
  //         });

  //         console.log(`Game with fitness ${createdGame.id} created`);

  //         await fs.promises.rename(
  //           `./temp_data/games/fitness/${file}`,
  //           `./temp_data/games/fitness/${createdGame.id}.json`,
  //         );
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   }
  // });
};

export default gameTtd;
