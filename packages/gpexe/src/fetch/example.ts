// import sessions from './examples/sessions.json';
import session from './examples/session.json'
import details from './examples/sessionDetails.json'

export const exSession = session as GpexeTrainingSession

export const exDetails = details // as GpexeTrainigSessionDetails;

export const exAthlete = details['players']['2822']['athlete'] as GpexeAthlete

export const exAthleteSession = details['players'][
  '2822'
] as GpexeAthleteTrainingSession
