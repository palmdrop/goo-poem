import { SERVER_PORT } from "../server/constants";
import { Data } from "../server/types";
import { ChangeEvent } from "../types/events";
import { changeLog } from "./editor/changeLog";

export const cleanLog = (log: ChangeEvent[]) => {
  return log.filter(event => event.change);
}

export const parseLog = (log: any[]) => {
  log.forEach((event: any) => {
    event.timestamp = new Date(event.timestamp);
  });

  return log;
}

export const parseData = (data: Record<string, any>) => {
  parseLog(data.log);
  return data as Data;
}

export const fetchData = async () => parseData(
  await fetch(`http://localhost:${SERVER_PORT}/`, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => response.json())
);

export const storeData = async () => {
  try {
    const log = changeLog.actionLog.slice(
      changeLog.storedToIndex
    );

    const response = await fetch(`http://localhost:${SERVER_PORT}/push`, {
      method: 'POST',
      body: JSON.stringify({
        log: cleanLog(log),
        value: changeLog.log.at(-1)?.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if(response.ok) {
      changeLog.storedToIndex = changeLog.actionLog.length;
      const log = parseLog(await response.json());

      console.log("Data stored!");
      return log;
    } else {
      console.error("Error, data not stored", response);
    }
  } catch (error) {
    console.error(error)
    return undefined;
  }
}