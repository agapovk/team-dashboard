type GpexeTeamFitnessSession = {
  average_time: UnitValue;
  total_distance: UnitValue;
  average_v: UnitValue;
  athletesessionspeedzone_distance_1: UnitValue;
  athletesessionspeedzone_distance_2: UnitValue;
  athletesessionspeedzone_distance_3: UnitValue;
  athletesessionspeedzone_distance_4: UnitValue;
  athletesessionspeedzone_distance_5: UnitValue;
  max_values_speed: UnitValue;
  speed_events: UnitValue;
  tot_burst_events: UnitValue;
  tot_brake_events: UnitValue;
  eccentric_index: UnitValue;
  athletesessionpowerzone_distance_1: UnitValue;
  athletesessionpowerzone_distance_2: UnitValue;
  athletesessionpowerzone_distance_3: UnitValue;
  average_p: UnitValue;
  max_values_power: UnitValue;
  equivalent_distance_index: UnitValue;
  equivalent_distance: UnitValue;
  total_energy: UnitValue;
  anaerobic_energy: UnitValue;
  anaerobic_index: UnitValue;
  aerobic_ratio: UnitValue;
  average_power_aer: UnitValue;
  power_events: UnitValue;
  power_events_avg_time: UnitValue;
  power_events_avg_power: UnitValue;
  recovery_average_time: UnitValue;
  recovery_average_power: UnitValue;
  athletesessionpowereventdurationzone_events_1: UnitValue;
  athletesessionpowereventdurationzone_events_2: UnitValue;
  athletesessionpowereventdurationzone_events_3: UnitValue;
  athletesessionpowereventdistancezone_events_1: UnitValue;
  athletesessionpowereventdistancezone_events_2: UnitValue;
  athletesessionpowereventdistancezone_events_3: UnitValue;
  athletesessionpowereventmaxspeedzone_events_1: UnitValue;
  athletesessionpowereventmaxspeedzone_events_2: UnitValue;
  athletesessionpowereventmaxspeedzone_events_3: UnitValue;
  external_work: UnitValue;
  ext_work_over: UnitValue;
  ext_work_over_neg: UnitValue;
  average_external_power: UnitValue;
  ext_work_over_zone0: UnitValue;
  ext_work_over_zone1: UnitValue;
  ext_work_over_zone2: UnitValue;
  ext_work_over_zone0_neg: UnitValue;
  ext_work_over_zone1_neg: UnitValue;
  ext_work_over_zone2_neg: UnitValue;
  average_hr: UnitValue;
  average_hr_percentual: UnitValue;
  max_values_cardio: UnitValue;
  max_values_cardio_percentual: UnitValue;
  athletesessionheartratezone_time_2: UnitValue;
  athletesessionheartratezone_time_3: UnitValue;
  athletesessionheartratezone_time_4: UnitValue;
};

type GpexeTrainingSession = GpexeTeamFitnessSession & {
  id: number;
  team: number;
  name: string;
  start_timestamp: string;
  end_timestamp: string;
  category_name: string;
  notes: string;
  total_time: number;
  n_tracks: number;
  average_time: UnitValue;
};

type GpexeAthlete = {
  id: number;
  name: string;
  short_name: string;
  last_name: string;
  first_name: string;
  birthday: string;
};

type GpexeAthleteTrainingSession = {
  athlete_session_id: number;
  athlete: GpexeAthlete;
  average_time: UnitValue;
  total_distance: UnitValue;
  average_v: UnitValue;
  athletesessionspeedzone_distance_1: UnitValue;
  athletesessionspeedzone_distance_2: UnitValue;
  athletesessionspeedzone_distance_3: UnitValue;
  athletesessionspeedzone_distance_4: UnitValue;
  athletesessionspeedzone_distance_5: UnitValue;
  max_values_speed: UnitValue;
  speed_events: UnitValue;
  tot_burst_events: UnitValue;
  tot_brake_events: UnitValue;
  eccentric_index: UnitValue;
  athletesessionpowerzone_distance_1: UnitValue;
  athletesessionpowerzone_distance_2: UnitValue;
  athletesessionpowerzone_distance_3: UnitValue;
  average_p: UnitValue;
  max_values_power: UnitValue;
  equivalent_distance_index: UnitValue;
  equivalent_distance: UnitValue;
  total_energy: UnitValue;
  anaerobic_energy: UnitValue;
  anaerobic_index: UnitValue;
  aerobic_ratio: UnitValue;
  average_power_aer: UnitValue;
  power_events: UnitValue;
  power_events_avg_time: UnitValue;
  power_events_avg_power: UnitValue;
  recovery_average_time: UnitValue;
  recovery_average_power: UnitValue;
  athletesessionpowereventdurationzone_events_1: UnitValue;
  athletesessionpowereventdurationzone_events_2: UnitValue;
  athletesessionpowereventdurationzone_events_3: UnitValue;
  athletesessionpowereventdistancezone_events_1: UnitValue;
  athletesessionpowereventdistancezone_events_2: UnitValue;
  athletesessionpowereventdistancezone_events_3: UnitValue;
  athletesessionpowereventmaxspeedzone_events_1: UnitValue;
  athletesessionpowereventmaxspeedzone_events_2: UnitValue;
  athletesessionpowereventmaxspeedzone_events_3: UnitValue;
  external_work: UnitValue;
  ext_work_over: UnitValue;
  ext_work_over_neg: UnitValue;
  average_external_power: UnitValue;
  ext_work_over_zone0: UnitValue;
  ext_work_over_zone1: UnitValue;
  ext_work_over_zone2: UnitValue;
  ext_work_over_zone0_neg: UnitValue;
  ext_work_over_zone1_neg: UnitValue;
  ext_work_over_zone2_neg: UnitValue;
  average_hr: UnitValue;
  average_hr_percentual: UnitValue;
  max_values_cardio: UnitValue;
  max_values_cardio_percentual: UnitValue;
  athletesessionheartratezone_time_2: UnitValue;
  athletesessionheartratezone_time_3: UnitValue;
  athletesessionheartratezone_time_4: UnitValue;
  total_seconds: UnitValue;
  acceleration_events: UnitValue;
  deceleration_events: UnitValue;
};

type GoogleSheetAthleteSession = [
  id: string,
  category_name: string,
  start_timestamp: string,
  end_timestamp: string,
  total_time: string,
  name: string,
  n_tracks: string,
  name: string,
  athlete_last_name: string,
  athlete_first_name: string,
  athlete_birthday: string,
  athlete_short_name: string,
  average_time_value: number | null,
  total_seconds_value: number | null,
  total_distance_value: number | null,
  average_v_value: number | null,
  athletesessionspeedzone_distance_3_value: number | null,
  athletesessionspeedzone_distance_4_value: number | null,
  athletesessionspeedzone_distance_5_value: number | null,
  speed_events_value: number | null,
  max_values_speed_value: number | null,
  athletesessionpowerzone_distance_1_value: number | null,
  athletesessionpowerzone_distance_2_value: number | null,
  athletesessionpowerzone_distance_3_value: number | null,
  power_events_value: number | null,
  power_events_avg_power_value: number | null,
  power_events_avg_time_value: number | null,
  recovery_average_power_value: number | null,
  recovery_average_time_value: number | null,
  max_values_power_value: number | null,
  acceleration_events_value: number | null,
  deceleration_events_value: number | null,
  eccentric_index_value: number | null,
  equivalent_distance_index_value: number | null,
  average_hr_value: number | null,
  max_values_cardio_value: number | null,
  athletesessionheartratezone_time_3_value: number | null,
  athletesessionheartratezone_time_4_value: number | null,
];

type UnitValue = {
  unit: string;
  value: number | null;
};

type GpexeDetails = {
  teamsession: number;
  players: {
    [id: string]: GpexeAthleteTrainingSession;
  };
  team: {
    parameters: GpexeTeamFitnessSession;
  };
};
