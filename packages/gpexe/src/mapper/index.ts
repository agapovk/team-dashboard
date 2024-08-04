import { date } from "../fetch/date";

export const unitToNumber = (unit: UnitValue) => unit?.value;

export const athses = (id: number, s: GpexeAthleteTrainingSession) => {
  return {
    id: id,
    average_time: unitToNumber(s.average_time),
    total_distance: unitToNumber(s.total_distance),
    average_v: unitToNumber(s.average_v),
    athletesessionspeedzone_distance_1: unitToNumber(
      s.athletesessionspeedzone_distance_1,
    ),
    athletesessionspeedzone_distance_2: unitToNumber(
      s.athletesessionspeedzone_distance_2,
    ),
    athletesessionspeedzone_distance_3: unitToNumber(
      s.athletesessionspeedzone_distance_3,
    ),
    athletesessionspeedzone_distance_4: unitToNumber(
      s.athletesessionspeedzone_distance_4,
    ),
    athletesessionspeedzone_distance_5: unitToNumber(
      s.athletesessionspeedzone_distance_5,
    ),
    max_values_speed: unitToNumber(s.max_values_speed),
    speed_events: unitToNumber(s.speed_events),
    tot_burst_events: unitToNumber(s.tot_burst_events),
    tot_brake_events: unitToNumber(s.tot_brake_events),
    eccentric_index: unitToNumber(s.eccentric_index),
    athletesessionpowerzone_distance_1: unitToNumber(
      s.athletesessionpowerzone_distance_1,
    ),
    athletesessionpowerzone_distance_2: unitToNumber(
      s.athletesessionpowerzone_distance_2,
    ),
    athletesessionpowerzone_distance_3: unitToNumber(
      s.athletesessionpowerzone_distance_3,
    ),
    average_p: unitToNumber(s.average_p),
    max_values_power: unitToNumber(s.max_values_power),
    equivalent_distance_index: unitToNumber(s.equivalent_distance_index),
    equivalent_distance: unitToNumber(s.equivalent_distance),
    total_energy: unitToNumber(s.total_energy),
    anaerobic_energy: unitToNumber(s.anaerobic_energy),
    anaerobic_index: unitToNumber(s.anaerobic_index),
    aerobic_ratio: unitToNumber(s.aerobic_ratio),
    average_power_aer: unitToNumber(s.average_power_aer),
    power_events: unitToNumber(s.power_events),
    power_events_avg_time: unitToNumber(s.power_events_avg_time),
    power_events_avg_power: unitToNumber(s.power_events_avg_power),
    recovery_average_time: unitToNumber(s.recovery_average_time),
    recovery_average_power: unitToNumber(s.recovery_average_power),
    athletesessionpowereventdurationzone_events_1: unitToNumber(
      s.athletesessionpowereventdurationzone_events_1,
    ),
    athletesessionpowereventdurationzone_events_2: unitToNumber(
      s.athletesessionpowereventdurationzone_events_2,
    ),
    athletesessionpowereventdurationzone_events_3: unitToNumber(
      s.athletesessionpowereventdurationzone_events_3,
    ),
    athletesessionpowereventdistancezone_events_1: unitToNumber(
      s.athletesessionpowereventdistancezone_events_1,
    ),
    athletesessionpowereventdistancezone_events_2: unitToNumber(
      s.athletesessionpowereventdistancezone_events_2,
    ),
    athletesessionpowereventdistancezone_events_3: unitToNumber(
      s.athletesessionpowereventdistancezone_events_3,
    ),
    athletesessionpowereventmaxspeedzone_events_1: unitToNumber(
      s.athletesessionpowereventmaxspeedzone_events_1,
    ),
    athletesessionpowereventmaxspeedzone_events_2: unitToNumber(
      s.athletesessionpowereventmaxspeedzone_events_2,
    ),
    athletesessionpowereventmaxspeedzone_events_3: unitToNumber(
      s.athletesessionpowereventmaxspeedzone_events_3,
    ),
    external_work: unitToNumber(s.external_work),
    ext_work_over: unitToNumber(s.ext_work_over),
    ext_work_over_neg: unitToNumber(s.ext_work_over_neg),
    average_external_power: unitToNumber(s.average_external_power),
    ext_work_over_zone0: unitToNumber(s.ext_work_over_zone0),
    ext_work_over_zone1: unitToNumber(s.ext_work_over_zone1),
    ext_work_over_zone2: unitToNumber(s.ext_work_over_zone2),
    ext_work_over_zone0_neg: unitToNumber(s.ext_work_over_zone0_neg),
    ext_work_over_zone1_neg: unitToNumber(s.ext_work_over_zone1_neg),
    ext_work_over_zone2_neg: unitToNumber(s.ext_work_over_zone2_neg),
    average_hr: unitToNumber(s.average_hr),
    average_hr_percentual: unitToNumber(s.average_hr_percentual),
    max_values_cardio: unitToNumber(s.max_values_cardio),
    max_values_cardio_percentual: unitToNumber(s.max_values_cardio_percentual),
    athletesessionheartratezone_time_2: unitToNumber(
      s.athletesessionheartratezone_time_2,
    ),
    athletesessionheartratezone_time_3: unitToNumber(
      s.athletesessionheartratezone_time_3,
    ),
    athletesessionheartratezone_time_4: unitToNumber(
      s.athletesessionheartratezone_time_4,
    ),
  };
};

export const dbAth = (athlete: GpexeAthlete) => ({
  id: athlete.id,
  name: athlete.name,
  short_name: athlete.short_name,
  last_name: athlete.last_name,
  first_name: athlete.first_name,
  birthday: athlete.birthday,
});

export const dbSes = (
  s: GpexeTrainingSession,
  team: GpexeTeamFitnessSession,
) => ({
  id: s.id,
  team_id: s.team,
  name: s.name,
  start_timestamp: date(s.start_timestamp),
  end_timestamp: date(s.end_timestamp),
  category_name: s.category_name,
  notes: s.notes,
  total_time: s.total_time,
  n_tracks: s.n_tracks,
  average_time: unitToNumber(team.average_time),
  total_distance: unitToNumber(team.total_distance),
  average_v: unitToNumber(team.average_v),
  athletesessionspeedzone_distance_1: unitToNumber(
    team.athletesessionspeedzone_distance_1,
  ),
  athletesessionspeedzone_distance_2: unitToNumber(
    team.athletesessionspeedzone_distance_2,
  ),
  athletesessionspeedzone_distance_3: unitToNumber(
    team.athletesessionspeedzone_distance_3,
  ),
  athletesessionspeedzone_distance_4: unitToNumber(
    team.athletesessionspeedzone_distance_4,
  ),
  athletesessionspeedzone_distance_5: unitToNumber(
    team.athletesessionspeedzone_distance_5,
  ),
  max_values_speed: unitToNumber(team.max_values_speed),
  speed_events: unitToNumber(team.speed_events),
  tot_burst_events: unitToNumber(team.tot_burst_events),
  tot_brake_events: unitToNumber(team.tot_brake_events),
  eccentric_index: unitToNumber(team.eccentric_index),
  athletesessionpowerzone_distance_1: unitToNumber(
    team.athletesessionpowerzone_distance_1,
  ),
  athletesessionpowerzone_distance_2: unitToNumber(
    team.athletesessionpowerzone_distance_2,
  ),
  athletesessionpowerzone_distance_3: unitToNumber(
    team.athletesessionpowerzone_distance_3,
  ),
  average_p: unitToNumber(team.average_p),
  max_values_power: unitToNumber(team.max_values_power),
  equivalent_distance_index: unitToNumber(team.equivalent_distance_index),
  equivalent_distance: unitToNumber(team.equivalent_distance),
  total_energy: unitToNumber(team.total_energy),
  anaerobic_energy: unitToNumber(team.anaerobic_energy),
  anaerobic_index: unitToNumber(team.anaerobic_index),
  aerobic_ratio: unitToNumber(team.aerobic_ratio),
  average_power_aer: unitToNumber(team.average_power_aer),
  power_events: unitToNumber(team.power_events),
  power_events_avg_time: unitToNumber(team.power_events_avg_time),
  power_events_avg_power: unitToNumber(team.power_events_avg_power),
  recovery_average_time: unitToNumber(team.recovery_average_time),
  recovery_average_power: unitToNumber(team.recovery_average_power),
  athletesessionpowereventdurationzone_events_1: unitToNumber(
    team.athletesessionpowereventdurationzone_events_1,
  ),
  athletesessionpowereventdurationzone_events_2: unitToNumber(
    team.athletesessionpowereventdurationzone_events_2,
  ),
  athletesessionpowereventdurationzone_events_3: unitToNumber(
    team.athletesessionpowereventdurationzone_events_3,
  ),
  athletesessionpowereventdistancezone_events_1: unitToNumber(
    team.athletesessionpowereventdistancezone_events_1,
  ),
  athletesessionpowereventdistancezone_events_2: unitToNumber(
    team.athletesessionpowereventdistancezone_events_2,
  ),
  athletesessionpowereventdistancezone_events_3: unitToNumber(
    team.athletesessionpowereventdistancezone_events_3,
  ),
  athletesessionpowereventmaxspeedzone_events_1: unitToNumber(
    team.athletesessionpowereventmaxspeedzone_events_1,
  ),
  athletesessionpowereventmaxspeedzone_events_2: unitToNumber(
    team.athletesessionpowereventmaxspeedzone_events_2,
  ),
  athletesessionpowereventmaxspeedzone_events_3: unitToNumber(
    team.athletesessionpowereventmaxspeedzone_events_3,
  ),
  external_work: unitToNumber(team.external_work),
  ext_work_over: unitToNumber(team.ext_work_over),
  ext_work_over_neg: unitToNumber(team.ext_work_over_neg),
  average_external_power: unitToNumber(team.average_external_power),
  ext_work_over_zone0: unitToNumber(team.ext_work_over_zone0),
  ext_work_over_zone1: unitToNumber(team.ext_work_over_zone1),
  ext_work_over_zone2: unitToNumber(team.ext_work_over_zone2),
  ext_work_over_zone0_neg: unitToNumber(team.ext_work_over_zone0_neg),
  ext_work_over_zone1_neg: unitToNumber(team.ext_work_over_zone1_neg),
  ext_work_over_zone2_neg: unitToNumber(team.ext_work_over_zone2_neg),
  average_hr: unitToNumber(team.average_hr),
  average_hr_percentual: unitToNumber(team.average_hr_percentual),
  max_values_cardio: unitToNumber(team.max_values_cardio),
  max_values_cardio_percentual: unitToNumber(team.max_values_cardio_percentual),
  athletesessionheartratezone_time_2: unitToNumber(
    team.athletesessionheartratezone_time_2,
  ),
  athletesessionheartratezone_time_3: unitToNumber(
    team.athletesessionheartratezone_time_3,
  ),
  athletesessionheartratezone_time_4: unitToNumber(
    team.athletesessionheartratezone_time_4,
  ),
});
