import * as fs from "node:fs";
import { getSessionDetails, getSessions } from "../src/fetch";

const fetch = async ({ all }: { all: boolean }) => {
  // Create folders if needed
  await fs.promises.mkdir("./temp_data/sessions", { recursive: true });
  await fs.promises.mkdir("./temp_data/details", { recursive: true });

  // Check existing sessions
  const existingFiles = await fs.promises.readdir(`./temp_data/sessions`);
  const existingSessions: number[] = [];

  for await (const file of existingFiles) {
    // Get team session data
    if (file.slice(0, 7) !== "session")
      console.log(`Wrong file [${file}] in directory`);
    else {
      const data_session = await fs.promises.readFile(
        `./temp_data/sessions/${file}`,
        "utf8",
      );
      const session = JSON.parse(data_session);
      existingSessions.push(session.id);
    }
  }

  console.log(`${existingSessions.length} already downloaded sessions`);

  const limit = all ? 10000 : 10;

  // Get new sessions
  console.log(`Fetching last ${limit} sessions from server...`);
  console.time("Fetch time");
  let sessions = await getSessions({ limit });
  console.timeEnd("Fetch time");

  for (const session of sessions) {
    // Download only new sessions
    if (!existingSessions.includes(session.id)) {
      await fs.promises.writeFile(
        `./temp_data/sessions/session-${session.id}.json`,
        JSON.stringify(session),
      );

      console.log(`[local] Session ${session.id} has been saved!`);

      const id = session.id;
      console.time(`Session details ${id} have been saved!`);
      const details = await getSessionDetails(id);

      await fs.promises.writeFile(
        `./temp_data/details/details-${details.teamsession}.json`,
        JSON.stringify(details),
      );
      console.timeEnd(`[local] Details ${id} have been saved!`);
    }
  }
};

export default fetch;
