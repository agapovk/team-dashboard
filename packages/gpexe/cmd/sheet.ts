/* eslint-disable turbo/no-undeclared-env-vars */
import * as fs from 'node:fs'

const sheet = async (all: Boolean) => {
  const { GoogleSpreadsheet } = require('google-spreadsheet')
  console.log(process.env.GOOGLE_SPREADSHEET_ID)
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID)
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  })
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['data']

  // Read team session directory
  const files = await fs.promises.readdir(`./temp_data/sessions`)

  let result: GoogleSheetAthleteSession[] = []

  // Clear all rows
  await sheet.clearRows()

  for await (const file of files) {
    // Get team session data
    if (file.slice(0, 7) !== 'session')
      console.log(`Wrong file [${file}] in directory`)
    else {
      const data_session = await fs.promises.readFile(
        `./temp_data/sessions/${file}`,
        'utf8'
      )
      const session = JSON.parse(data_session)
      const {
        id,
        category_name,
        start_timestamp,
        end_timestamp,
        total_time,
        name,
        n_tracks,
      } = session

      // Get details of the session
      const data_details = await fs.promises.readFile(
        `./temp_data/details/details-${id}.json`,
        'utf8'
      )
      const details = JSON.parse(data_details)
      const players: GpexeAthleteTrainingSession[] = Object.values(
        details.players
      )
      // const roles = Object.entries(details.roles);
      // const team = details.team.parameters;

      // Write to sheet
      await players.forEach((player: GpexeAthleteTrainingSession) => {
        const {
          athlete,
          average_time,
          total_seconds,
          total_distance,
          average_v,
          athletesessionspeedzone_distance_3,
          athletesessionspeedzone_distance_4,
          athletesessionspeedzone_distance_5,
          speed_events,
          max_values_speed,
          athletesessionpowerzone_distance_1,
          athletesessionpowerzone_distance_2,
          athletesessionpowerzone_distance_3,
          power_events,
          power_events_avg_power,
          power_events_avg_time,
          recovery_average_power,
          recovery_average_time,
          max_values_power,
          acceleration_events,
          deceleration_events,
          eccentric_index,
          equivalent_distance_index,
          average_hr,
          max_values_cardio,
          athletesessionheartratezone_time_3,
          athletesessionheartratezone_time_4,
        } = player

        const googleSheetAthleteSession: GoogleSheetAthleteSession = [
          id,
          category_name,
          start_timestamp,
          end_timestamp,
          total_time,
          name,
          n_tracks,
          athlete.name,
          athlete.last_name,
          athlete.first_name,
          athlete.birthday,
          athlete.short_name,
          average_time.value,
          total_seconds.value,
          total_distance.value,
          average_v.value,
          athletesessionspeedzone_distance_3.value,
          athletesessionspeedzone_distance_4.value,
          athletesessionspeedzone_distance_5.value,
          speed_events.value,
          max_values_speed.value,
          athletesessionpowerzone_distance_1.value,
          athletesessionpowerzone_distance_2.value,
          athletesessionpowerzone_distance_3.value,
          power_events.value,
          power_events_avg_power.value,
          power_events_avg_time.value,
          recovery_average_power.value,
          recovery_average_time.value,
          max_values_power.value,
          acceleration_events.value,
          deceleration_events.value,
          eccentric_index.value,
          equivalent_distance_index.value,
          average_hr.value,
          max_values_cardio.value,
          athletesessionheartratezone_time_3.value,
          athletesessionheartratezone_time_4.value,
        ]

        result.push(googleSheetAthleteSession)
      })
    }
  }

  // Fill rows with new values
  await sheet.addRows(result)
}

export default sheet
