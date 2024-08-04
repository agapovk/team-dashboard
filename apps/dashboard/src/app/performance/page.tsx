import { Metadata } from "next";
import { PrismaClient } from "@repo/db";
const prisma = new PrismaClient();

import { columns } from "./columns";
import { DataTable } from "./data-table";

export const metadata: Metadata = {
  title: "Список тренировок",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default async function LoadingPage() {
  const sessions = await prisma.session.findMany({
    where: {
      name: {
        startsWith: "[ТРЕНИРОВКА]",
      },
    },
    orderBy: {
      start_timestamp: "desc",
    },
  });

  // const games = await prisma.game.findMany();

  // const today = new Date();
  // const lastDay = new Date(sessions[sessions.length - 1].start_timestamp);
  // const dates = [];

  // let currentDate = today;
  // while (currentDate >= lastDay) {
  //   dates.push(new Date(currentDate));
  //   currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
  // }

  // const data = dates.map((d) => {
  //   const currentSession = sessions.find(
  //     (session) => session.start_timestamp.toLocaleDateString() === d.toLocaleDateString(),
  //   );
  //   const currentGame = games.find(
  //     (game) => game.date?.toLocaleDateString() === d.toLocaleDateString(),
  //   );

  //   if (!currentSession && !currentGame) {
  //     return {
  //       start_timestamp: d,
  //       id: '',
  //       team_id: null,
  //       name: '',
  //       end_timestamp: null,
  //       category_name: null,
  //       notes: null,
  //       total_time: null,
  //       n_tracks: null,
  //       event_id: null,
  //       average_time: null,
  //       total_distance: null,
  //       average_v: null,
  //       athletesessionspeedzone_distance_1: null,
  //       athletesessionspeedzone_distance_2: null,
  //       athletesessionspeedzone_distance_3: null,
  //       athletesessionspeedzone_distance_4: null,
  //       athletesessionspeedzone_distance_5: null,
  //       max_values_speed: null,
  //       speed_events: null,
  //       tot_burst_events: null,
  //       tot_brake_events: null,
  //       eccentric_index: null,
  //       athletesessionpowerzone_distance_1: null,
  //       athletesessionpowerzone_distance_2: null,
  //       athletesessionpowerzone_distance_3: null,
  //       average_p: null,
  //       max_values_power: null,
  //       equivalent_distance_index: null,
  //       equivalent_distance: null,
  //       total_energy: null,
  //       anaerobic_energy: null,
  //       anaerobic_index: null,
  //       aerobic_ratio: null,
  //       average_power_aer: null,
  //       power_events: null,
  //       power_events_avg_time: null,
  //       power_events_avg_power: null,
  //       recovery_average_time: null,
  //       recovery_average_power: null,
  //       athletesessionpowereventdurationzone_events_1: null,
  //       athletesessionpowereventdurationzone_events_2: null,
  //       athletesessionpowereventdurationzone_events_3: null,
  //       athletesessionpowereventdistancezone_events_1: null,
  //       athletesessionpowereventdistancezone_events_2: null,
  //       athletesessionpowereventdistancezone_events_3: null,
  //       athletesessionpowereventmaxspeedzone_events_1: null,
  //       athletesessionpowereventmaxspeedzone_events_2: null,
  //       athletesessionpowereventmaxspeedzone_events_3: null,
  //       external_work: null,
  //       ext_work_over: null,
  //       ext_work_over_neg: null,
  //       average_external_power: null,
  //       ext_work_over_zone0: null,
  //       ext_work_over_zone1: null,
  //       ext_work_over_zone2: null,
  //       ext_work_over_zone0_neg: null,
  //       ext_work_over_zone1_neg: null,
  //       ext_work_over_zone2_neg: null,
  //       average_hr: null,
  //       average_hr_percentual: null,
  //       max_values_cardio: null,
  //       max_values_cardio_percentual: null,
  //       athletesessionheartratezone_time_2: null,
  //       athletesessionheartratezone_time_3: null,
  //       athletesessionheartratezone_time_4: null,
  //     };
  //   }
  //   if (currentGame)
  //     return {
  //       start_timestamp: currentGame.date,
  //       id: '',
  //       team_id: null,
  //       name: 'game',
  //       end_timestamp: null,
  //       category_name: null,
  //       notes: null,
  //       total_time: null,
  //       n_tracks: null,
  //       event_id: null,
  //       average_time: null,
  //       total_distance: currentGame.total_distance,
  //       average_v: null,
  //       athletesessionspeedzone_distance_1: null,
  //       athletesessionspeedzone_distance_2: null,
  //       athletesessionspeedzone_distance_3: null,
  //       athletesessionspeedzone_distance_4: currentGame.speedzone4_distance,
  //       athletesessionspeedzone_distance_5: currentGame.speedzone5_distance,
  //       max_values_speed: null,
  //       speed_events: null,
  //       tot_burst_events: null,
  //       tot_brake_events: null,
  //       eccentric_index: null,
  //       athletesessionpowerzone_distance_1: null,
  //       athletesessionpowerzone_distance_2: null,
  //       athletesessionpowerzone_distance_3: null,
  //       average_p: null,
  //       max_values_power: null,
  //       equivalent_distance_index: null,
  //       equivalent_distance: null,
  //       total_energy: null,
  //       anaerobic_energy: null,
  //       anaerobic_index: null,
  //       aerobic_ratio: null,
  //       average_power_aer: null,
  //       power_events: null,
  //       power_events_avg_time: null,
  //       power_events_avg_power: null,
  //       recovery_average_time: null,
  //       recovery_average_power: null,
  //       athletesessionpowereventdurationzone_events_1: null,
  //       athletesessionpowereventdurationzone_events_2: null,
  //       athletesessionpowereventdurationzone_events_3: null,
  //       athletesessionpowereventdistancezone_events_1: null,
  //       athletesessionpowereventdistancezone_events_2: null,
  //       athletesessionpowereventdistancezone_events_3: null,
  //       athletesessionpowereventmaxspeedzone_events_1: null,
  //       athletesessionpowereventmaxspeedzone_events_2: null,
  //       athletesessionpowereventmaxspeedzone_events_3: null,
  //       external_work: null,
  //       ext_work_over: null,
  //       ext_work_over_neg: null,
  //       average_external_power: null,
  //       ext_work_over_zone0: null,
  //       ext_work_over_zone1: null,
  //       ext_work_over_zone2: null,
  //       ext_work_over_zone0_neg: null,
  //       ext_work_over_zone1_neg: null,
  //       ext_work_over_zone2_neg: null,
  //       average_hr: null,
  //       average_hr_percentual: null,
  //       max_values_cardio: null,
  //       max_values_cardio_percentual: null,
  //       athletesessionheartratezone_time_2: null,
  //       athletesessionheartratezone_time_3: null,
  //       athletesessionheartratezone_time_4: null,
  //     };
  //   if (currentSession) return currentSession;
  // });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Нагрузка</h2>
          <p className="text-muted-foreground">Анализ динамики нагрузки</p>
        </div>
      </div>
      <div className="space-y-4">
        <DataTable data={sessions} columns={columns} />
      </div>
    </div>
  );
}
